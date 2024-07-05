import { generateReplicateInput } from "@/lib/replicate";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import OpenAI from "openai";
import { db } from "@/lib/astraDB";

const openai = new OpenAI();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const WEBHOOK_HOST = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NGROK_HOST;

export const POST = async (req: NextRequest) => {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: "REPLICATE_API_TOKEN is not set" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const input = generateReplicateInput({ prompt: body.prompt });

    const res = (await replicate.run("meta/meta-llama-3-8b-instruct", {
      input,
    })) as string[];

    // const embedding = await openai.embeddings.create({
    //   model: "text-embedding-3-small",
    //   input: res.join(""),
    //   encoding_format: "float",
    // });

    const collection = db.collection("users");
    await collection.insertOne({
      name: "Abhishek",
      $vectorize: res.join(""),
    });

    return NextResponse.json(res, { status: 201 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 400 }
    );
  }
};
