import { useMemo, useState } from "react";
import { Filter, MoreHorizontal } from "lucide-react";

import { TransitionNavLink } from "@/components/motion/TransitionLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import type { WorkbenchTaskStatus, WorkbenchTaskSummary } from "./data";

type WorkbenchListPaneProps = {
  items: WorkbenchTaskSummary[];
  currentPath: string;
  onOpenCommandPalette: () => void;
};

const STATUS_OPTIONS: Array<{ value: WorkbenchTaskStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "planning", label: "Planning" },
  { value: "review", label: "In review" },
  { value: "shipped", label: "Shipped" },
];

const STATUS_BADGES: Record<WorkbenchTaskStatus, { label: string; variant: "default" | "secondary" | "outline" }> = {
  planning: { label: "Planning", variant: "outline" },
  active: { label: "Active", variant: "default" },
  review: { label: "Review", variant: "secondary" },
  shipped: { label: "Shipped", variant: "outline" },
};

export function WorkbenchListPane({ items, currentPath, onOpenCommandPalette }: WorkbenchListPaneProps) {
  const [status, setStatus] = useState<WorkbenchTaskStatus | "all">("all");

  const activeId = useMemo(() => {
    const match = currentPath.match(/\/workbench\/(.+)$/);
    if (!match) {
      return null;
    }
    return decodeURIComponent(match[1]);
  }, [currentPath]);

  const filteredItems = useMemo(() => {
    if (status === "all") {
      return items;
    }
    return items.filter((item) => item.status === status);
  }, [items, status]);

  return (
    <SidebarGroup className="gap-4">
      <SidebarGroupLabel className="flex items-center justify-between">
        <span className="text-sm font-semibold">Tasks</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="Open command palette"
              size="icon"
              variant="ghost"
              className="size-7"
              onClick={onOpenCommandPalette}
            >
              <Filter className="h-4 w-4" aria-hidden />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Jump anywhere (⌘/Ctrl + K)</TooltipContent>
        </Tooltip>
      </SidebarGroupLabel>
      <SidebarGroupContent className="gap-3">
        <Tabs value={status} onValueChange={(value) => setStatus(value as WorkbenchTaskStatus | "all")}>
          <TabsList className="grid grid-cols-3 bg-surface-elevated/30">
            {STATUS_OPTIONS.map((option) => (
              <TabsTrigger key={option.value} value={option.value} className="text-xs">
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <ScrollArea className="max-h-[calc(100vh-320px)]">
          <SidebarMenu>
            {filteredItems.map((item) => {
              const badge = STATUS_BADGES[item.status];
              const isActive = item.id === activeId;
              return (
                <SidebarMenuItem key={item.id} data-active={isActive}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <TransitionNavLink to={`/workbench/${encodeURIComponent(item.id)}`} className="flex w-full flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">{item.title}</span>
                        <Badge variant={badge.variant} className="text-[10px] uppercase">
                          {badge.label}
                        </Badge>
                      </div>
                      <p className="line-clamp-2 text-xs text-text-muted">{item.summary}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-subtle">
                        <span className="font-medium">{item.owner}</span>
                        <span aria-hidden>•</span>
                        <span>{new Date(item.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="border-border/40 bg-transparent text-[10px]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TransitionNavLink>
                  </SidebarMenuButton>
                  <SidebarMenuAction asChild>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-label={`Actions for ${item.title}`} variant="ghost" size="icon" className="size-7">
                          <MoreHorizontal className="h-4 w-4" aria-hidden />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onSelect={onOpenCommandPalette}>Open in command palette</DropdownMenuItem>
                        <DropdownMenuItem disabled={item.status === "shipped"}>Mark as shipped</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuAction>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </ScrollArea>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

