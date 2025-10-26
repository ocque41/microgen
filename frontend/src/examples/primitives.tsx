import { useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export type PrimitiveShowcase = {
  id: string
  title: string
  description: string
  Component: () => ReactNode
}

const cardClasses =
  "flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-surface"

function DialogExamples() {
  const [open, setOpen] = useState(false)

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button data-testid="dialog-uncontrolled-trigger">Quick feedback</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send quick feedback</DialogTitle>
            <DialogDescription>
              Uncontrolled dialogs rely on Radix triggers and automatically trap
              focus while open.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <label className="text-sm font-medium" htmlFor="dialog-uncontrolled-message">
              Message
            </label>
            <textarea
              id="dialog-uncontrolled-message"
              className="h-24 w-full rounded-lg border border-border bg-surface-muted/40 px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
            />
          </div>
          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              data-testid="dialog-uncontrolled-close"
            >
              Cancel
            </Button>
            <Button type="submit" variant="outline">
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" data-testid="dialog-controlled-trigger">
            Plan trip (controlled)
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Plan a working session</DialogTitle>
            <DialogDescription>
              Controlled dialogs provide deterministic open state. Press Escape
              or activate Close to restore focus to the trigger.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="dialog-controlled-title">
              Session title
              <Input id="dialog-controlled-title" placeholder="Accessibility jam" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="dialog-controlled-attendees">
              Attendees
              <Input id="dialog-controlled-attendees" placeholder="Add teammates" />
            </label>
          </div>
          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              data-testid="dialog-controlled-close"
            >
              Close
            </Button>
            <Button type="button" onClick={() => setOpen(false)}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SheetExamples() {
  const [open, setOpen] = useState(false)

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button data-testid="sheet-uncontrolled-trigger">Open notifications</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Inbox</SheetTitle>
            <SheetDescription>
              Uncontrolled sheets handle their own open and close lifecycle.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="max-h-[300px] rounded-xl bg-surface-muted/40 p-3">
            <ul className="space-y-2 text-sm">
              {Array.from({ length: 5 }).map((_, index) => (
                <li
                  key={`sheet-uncontrolled-${index}`}
                  className="rounded-lg border border-border/70 bg-surface px-3 py-2"
                >
                  <p className="font-medium text-text">Alert {index + 1}</p>
                  <p className="text-text-muted">
                    Suspendisse ac felis vel mauris ultrices ultricies.
                  </p>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" data-testid="sheet-controlled-trigger">
            Edit profile (controlled)
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Profile</SheetTitle>
            <SheetDescription>
              Controlled sheets expose explicit state management and focus
              restoration.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-3">
            <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="sheet-controlled-name">
              Display name
              <Input id="sheet-controlled-name" placeholder="Ada Lovelace" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="sheet-controlled-bio">
              Bio
              <textarea
                id="sheet-controlled-bio"
                className="h-24 w-full rounded-lg border border-border bg-surface-muted/40 px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
              />
            </label>
          </div>
          <SheetFooter className="flex flex-row justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              data-testid="sheet-controlled-close"
            >
              Cancel
            </Button>
            <Button type="button" onClick={() => setOpen(false)}>
              Update profile
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function TooltipExamples() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" data-testid="tooltip-trigger">
              Hover or focus me
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Tooltips respect reduced motion.</TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={0}>
          <TooltipTrigger className="rounded-lg border border-border px-3 py-2 text-sm text-text">
            Plain trigger
          </TooltipTrigger>
          <TooltipContent side="bottom">Traps focus when needed.</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

function CommandExamples() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const initialRenderRef = useRef(true)

  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false
      return
    }

    if (!open) {
      triggerRef.current?.focus()
    }
  }, [open])

  return (
    <div className="flex flex-wrap gap-3">
      <Button ref={triggerRef} data-testid="command-open" onClick={() => setOpen(true)}>
        Open palette
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Search actions" />
          <CommandList>
            <CommandEmpty>No matches found</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => setOpen(false)} data-testid="command-dashboard">
                Go to dashboard
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)} data-testid="command-chat">
                Go to chat
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}

function SelectExamples() {
  const [value, setValue] = useState("caption")

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Select defaultValue="body">
        <SelectTrigger aria-label="Choose font size" data-testid="select-uncontrolled-trigger">
          <SelectValue placeholder="Typography size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="body">Body</SelectItem>
          <SelectItem value="caption">Caption</SelectItem>
          <SelectItem value="footnote">Footnote</SelectItem>
        </SelectContent>
      </Select>

      <Select value={value} onValueChange={setValue}>
        <SelectTrigger aria-label="Controlled font weight" data-testid="select-controlled-trigger">
          <SelectValue placeholder="Font weight" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="caption">Caption</SelectItem>
          <SelectItem value="body">Body</SelectItem>
          <SelectItem value="display">Display</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-text-muted" data-testid="select-value">
        Current value: {value}
      </p>
    </div>
  )
}

function TabsExamples() {
  const [value, setValue] = useState("overview")

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Tabs defaultValue="overview" className="w-full" data-testid="tabs-uncontrolled">
        <TabsList aria-label="Project summary">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <p className="text-sm text-text-muted">
            Uncontrolled tabs manage focus and selection internally.
          </p>
        </TabsContent>
        <TabsContent value="activity">
          <p className="text-sm text-text-muted">Activity feed.</p>
        </TabsContent>
        <TabsContent value="files">
          <p className="text-sm text-text-muted">Shared files.</p>
        </TabsContent>
      </Tabs>

      <Tabs value={value} onValueChange={setValue} className="w-full" data-testid="tabs-controlled">
        <TabsList aria-label="Controlled tabs">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <p className="text-sm text-text-muted">Select a tab to update state.</p>
        </TabsContent>
        <TabsContent value="activity">
          <p className="text-sm text-text-muted">Activity feed.</p>
        </TabsContent>
        <TabsContent value="files">
          <p className="text-sm text-text-muted">Files list.</p>
        </TabsContent>
      </Tabs>
      <p className="text-sm text-text-muted" data-testid="tabs-value">
        Active tab: {value}
      </p>
    </div>
  )
}

function ToastExamples() {
  const notify = (variant: "success" | "default") => {
    if (variant === "success") {
      toast.success("Changes saved", {
        description: "We kept the contrast ratios above WCAG AA+.",
      })
      return
    }

    toast("New workspace created", {
      description: "Invite your team to collaborate in the new space.",
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button data-testid="toast-default" onClick={() => notify("default")}>
        Show message toast
      </Button>
      <Button variant="outline" data-testid="toast-success" onClick={() => notify("success")}>
        Show success toast
      </Button>
    </div>
  )
}

function ScrollAreaExamples() {
  return (
    <ScrollArea className="h-40 w-full max-w-md rounded-xl border border-border bg-surface" data-testid="scroll-area">
      <ul className="space-y-2 p-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <li key={`scroll-area-item-${index}`}>
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              Focusable item {index + 1}
            </Button>
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}

function DropdownMenuExamples() {
  const [fontSize, setFontSize] = useState("medium")
  const [showLineNumbers, setShowLineNumbers] = useState(true)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" data-testid="dropdown-trigger">
          Editor settings
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={8} align="start">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem data-testid="dropdown-theme-dark">
            Dark theme
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem data-testid="dropdown-theme-light">
            Light theme
            <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showLineNumbers}
          onCheckedChange={(checked) => setShowLineNumbers(Boolean(checked))}
          data-testid="dropdown-lines"
        >
          Show line numbers
        </DropdownMenuCheckboxItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger inset data-testid="dropdown-font">
            Font size
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={fontSize} onValueChange={setFontSize}>
              <DropdownMenuRadioItem value="small">Small</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="large">Large</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled data-testid="dropdown-disabled">
          Export project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const primitiveShowcases: PrimitiveShowcase[] = [
  {
    id: "dialog",
    title: "Dialog",
    description: "Modal windows with tokenized focus rings and escape handling.",
    Component: DialogExamples,
  },
  {
    id: "sheet",
    title: "Sheet",
    description: "Edge-attached panels with controlled and uncontrolled flows.",
    Component: SheetExamples,
  },
  {
    id: "tooltip",
    title: "Tooltip",
    description: "High-contrast tooltips respecting reduced motion preferences.",
    Component: TooltipExamples,
  },
  {
    id: "command",
    title: "Command palette",
    description: "Palette with search, keyboard shortcuts, and roving focus.",
    Component: CommandExamples,
  },
  {
    id: "select",
    title: "Select & combobox",
    description: "Radix-powered select with controlled values for accessibility.",
    Component: SelectExamples,
  },
  {
    id: "tabs",
    title: "Tabs",
    description: "Horizontal tabs exposing arrow-key navigation and state sync.",
    Component: TabsExamples,
  },
  {
    id: "toast",
    title: "Toast",
    description: "Token-colored toasts with focusable actions and AA+ contrast.",
    Component: ToastExamples,
  },
  {
    id: "scroll-area",
    title: "Scroll area",
    description: "Overflow container with visible thumb and accessible focus.",
    Component: ScrollAreaExamples,
  },
  {
    id: "dropdown-menu",
    title: "Dropdown menu",
    description: "Nested menu with checkbox and radio interactions for input parity.",
    Component: DropdownMenuExamples,
  },
]

export function PrimitiveShowcaseGrid() {
  const entries = useMemo(() => primitiveShowcases, [])

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {entries.map(({ id, title, description, Component }) => (
        <section key={id} className={cardClasses} aria-labelledby={`${id}-title`}>
          <header className="space-y-1">
            <h3 id={`${id}-title`} className="text-lg font-semibold text-text">
              {title}
            </h3>
            <p className="text-sm text-text-muted">{description}</p>
          </header>
          <Component />
        </section>
      ))}
    </div>
  )
}

export {
  DialogExamples,
  SheetExamples,
  TooltipExamples,
  CommandExamples,
  SelectExamples,
  TabsExamples,
  ToastExamples,
  ScrollAreaExamples,
  DropdownMenuExamples,
}
