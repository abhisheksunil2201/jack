import { db } from "@/components/db";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  AstraDBVectorStore,
  AstraLibArgs,
} from "@langchain/community/vectorstores/astradb";
import { NextRequest } from "next/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { OpenAIStream, StreamingTextResponse, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const astraConfig: AstraLibArgs = {
  token: process.env.ASTRA_DB_APPLICATION_TOKEN as string,
  endpoint: process.env.ASTRA_DB_API_ENDPOINT as string,
  collection: process.env.ASTRA_DB_COLLECTION ?? "langchain_test",
  collectionOptions: {
    vector: {
      dimension: 1536,
      metric: "cosine",
    },
  },
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) return new Response("Unauthorized", { status: 401 });

  const userId = user.id;

  const { message, chatId } = SendMessageValidator.parse(body);

  let currentChatId: string | undefined = chatId;

  if (!chatId) {
    const aiChat = await db.aIChat.create({
      data: {
        userId,
        title: message,
      },
    });
    currentChatId = aiChat.id;
  }

  await db.aIMessage.create({
    data: {
      userId,
      text: message,
      isUserMessage: true,
      chatId: currentChatId!,
    },
  });

  const vectorStore = await AstraDBVectorStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    astraConfig
  );

  const results = await vectorStore.similaritySearch(message, 4);

  const prevMessages = await db.aIMessage.findMany({
    where: {
      userId,
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  const formattedPrevMessages = prevMessages.map((message) => ({
    role: message.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: message.text,
  }));

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages: [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
      
      \n----------------\n
      
      PREVIOUS CONVERSATION:
      ${formattedPrevMessages.map((message) => {
        if (message.role === "user") return `User: ${message.content}\n`;
        return `Assistant: ${message.content}\n`;
      })}
      
      \n----------------\n
      
      CONTEXT:
      ${results.map((r) => r.pageContent).join("\n\n")}
      
      USER INPUT: ${message}`,
      },
    ],
    async onFinish({ text }) {
      await db.aIMessage.create({
        data: {
          text,
          isUserMessage: false,
          userId,
          chatId: currentChatId!,
        },
      });
    },
  });

  return result.toDataStreamResponse();
};
