"use client";

import { useState } from "react";
import Nav from "./Nav";
import Chat from "./Chat";
import { TooltipProvider } from "./ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { Inbox, UserRoundSearch } from "lucide-react";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import PeopleList from "./PeopleList";

interface ChatScreenProps {
  layout: RequestCookie;
}

export default function ChatScreen({ layout }: ChatScreenProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const defaultLayout = layout ? JSON.parse(layout.value) : [400, 1090];
  const navCollapsedSize = 3.5;

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full w-full m-0 max-h-[800px] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[1]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={30}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=true`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=false`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "discover",
                label: "",
                icon: UserRoundSearch,
                variant: "default",
              },
              {
                title: "inbox",
                label: "",
                icon: Inbox,
                variant: "ghost",
              },
            ]}
          />
          <Separator />
          {!isCollapsed && <PeopleList />}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={defaultLayout[1]}
          collapsedSize={navCollapsedSize}
          minSize={30}
        >
          <Chat />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
