import { ReactNode, createContext, useRef, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";

type StreamResponse = {
  addMessage: ({ chatId }: { chatId?: string }) => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

interface Props {
  children: ReactNode;
  chatId?: string;
}

export const ChatContextProvider = ({ chatId, children }: Props) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const utils = trpc.useUtils();

  const { toast } = useToast();

  const backupMessage = useRef("");

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({
      message,
      chatId,
    }: {
      message: string;
      chatId?: string;
    }) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          message,
          chatId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return response.body;
    },
    onMutate: async ({ message }) => {
      backupMessage.current = message;
      setMessage("");

      await utils.getAiChatMessages.cancel();

      const previousMessages = utils.getAiChatMessages.getInfiniteData({
        chatId: chatId!,
      });

      utils.getAiChatMessages.setInfiniteData({ chatId: chatId! }, (old) => {
        if (!old) {
          return {
            pages: [],
            pageParams: [],
          };
        }

        let newPages = [...old.pages];

        let latestPage = newPages[0]!;

        latestPage.messages = [
          {
            timestamp: new Date().toISOString(),
            id: crypto.randomUUID(),
            text: message,
            isUserMessage: true,
          },
          ...latestPage.messages,
        ];

        newPages[0] = latestPage;

        return {
          ...old,
          pages: newPages,
        };
      });

      setIsLoading(true);

      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
    onSuccess: async (stream) => {
      setIsLoading(false);

      if (!stream) {
        return toast({
          title: "There was a problem sending this message",
          description: "Please refresh this page and try again",
          variant: "destructive",
        });
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      // accumulated response
      let accResponse = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        accResponse += chunkValue;

        // append chunk to the actual message
        utils.getAiChatMessages.setInfiniteData({ chatId: chatId! }, (old) => {
          if (!old) return { pages: [], pageParams: [] };

          let isAiResponseCreated = old.pages.some((page) =>
            page.messages.some((message) => message.id === "ai-response")
          );

          let updatedPages = old.pages.map((page) => {
            if (page === old.pages[0]) {
              let updatedMessages;

              if (!isAiResponseCreated) {
                updatedMessages = [
                  {
                    timestamp: new Date().toISOString(),
                    id: "ai-response",
                    text: accResponse,
                    isUserMessage: false,
                  },
                  ...page.messages,
                ];
              } else {
                updatedMessages = page.messages.map((message) => {
                  if (message.id === "ai-response") {
                    return {
                      ...message,
                      text: accResponse,
                    };
                  }
                  return message;
                });
              }

              return {
                ...page,
                messages: updatedMessages,
              };
            }

            return page;
          });

          return { ...old, pages: updatedPages };
        });
      }
    },

    onError: (_, __, context) => {
      setMessage(backupMessage.current);
      utils.getAiChatMessages.setData(
        { chatId: chatId! },
        { messages: context?.previousMessages ?? [] }
      );
    },
    onSettled: async () => {
      setIsLoading(false);

      await utils.getAiChatMessages.invalidate({ chatId: chatId! });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const addMessage = ({ chatId }: { chatId?: string }) =>
    sendMessage({ chatId, message });

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
