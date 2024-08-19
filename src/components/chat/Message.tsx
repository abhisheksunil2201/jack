import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/types/message";
import { Icons } from "../Icons";
import { format } from "date-fns";
import { forwardRef } from "react";

type MessageProps = {
  message: ExtendedMessage;
  inNextMessageSamePerson: boolean;
};

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, inNextMessageSamePerson }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-end", {
          "justify-end": message.isUserMessage,
        })}
      >
        {/* <div
          className={cn(
            "relative flex h-6 w-6 aspect-square items-center justify-center",
            {
              "order-2 bg-[#1F1F1F]": message.isUserMessage,
              "order-1 bg-zinc-800": !message.isUserMessage,
              invisible: inNextMessageSamePerson,
            }
          )}
        >
          {message.isUserMessage ? (
            <Icons.user className="fill-zinc-200 text-zinc-200 h-3/4 w-3/4" />
          ) : (
            <Icons.logo className="fill-zinc-300 h-3/4 w-3/4" />
          )}
        </div> */}
        <div
          className={cn("flex flex-col space-y-2 text-base max-w-md mx-2", {
            "order-1 items-end": message.isUserMessage,
            "order-2 items-start": !message.isUserMessage,
          })}
        >
          <div
            className={cn("px-4 py-2 rounded-lg inline-block", {
              "bg-[#1F1F1F] text-white": message.isUserMessage,
              "bg-gray-900 text-zinc-400": !message.isUserMessage,
              "rounded-br-none":
                message.isUserMessage && !inNextMessageSamePerson,
              "rounded-bl-none":
                !message.isUserMessage && !inNextMessageSamePerson,
            })}
          >
            {typeof message.text === "string" ? (
              <div
                className={cn("prose", {
                  "text-zinc-50": message.isUserMessage,
                })}
              >
                {message.text}
              </div>
            ) : (
              message.text
            )}
            {message.id !== "loading-message" ? (
              <div
                className={cn("text-xs select-none mt-2 w-full text-right", {
                  "text-zinc-500": !message.isUserMessage,
                  "text-blue-300": message.isUserMessage,
                })}
              >
                {format(new Date(message.timestamp), "HH:mm")}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

Message.displayName = "Message";

export default Message;
