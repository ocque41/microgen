import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"

import {
  CommandExamples,
  DialogExamples,
  DropdownMenuExamples,
  PrimitiveShowcaseGrid,
  ScrollAreaExamples,
  SelectExamples,
  SheetExamples,
  TabsExamples,
  ToastExamples,
  TooltipExamples,
  primitiveShowcases,
} from "@/examples/primitives"
import { Toaster } from "@/components/ui/sonner"

describe("DialogExamples", () => {
  it("closes on escape and restores focus to the trigger", async () => {
    const user = userEvent.setup()
    render(<DialogExamples />)

    await user.click(screen.getByTestId("dialog-uncontrolled-trigger"))

    await screen.findByRole("dialog", { name: /send quick feedback/i })

    await user.keyboard("{Escape}")

    await waitFor(() =>
      expect(screen.queryByRole("dialog", { name: /send quick feedback/i })).not.toBeInTheDocument()
    )
    expect(screen.getByTestId("dialog-uncontrolled-trigger")).toHaveFocus()
  })

  it("respects controlled close actions", async () => {
    const user = userEvent.setup()
    render(<DialogExamples />)

    await user.click(screen.getByTestId("dialog-controlled-trigger"))
    await screen.findByRole("dialog", { name: /plan a working session/i })

    await user.click(screen.getByTestId("dialog-controlled-close"))

    await waitFor(() =>
      expect(screen.queryByRole("dialog", { name: /plan a working session/i })).not.toBeInTheDocument()
    )
    expect(screen.getByTestId("dialog-controlled-trigger")).toHaveFocus()
  })

  it("has no axe violations when the dialog is open", async () => {
    const user = userEvent.setup()
    render(<DialogExamples />)

    await user.click(screen.getByTestId("dialog-uncontrolled-trigger"))
    await screen.findByRole("dialog", { name: /send quick feedback/i })

    const results = await axe(document.body, {
      rules: { region: { enabled: false } },
    })
    expect(results).toHaveNoViolations()
  })
})

describe("SheetExamples", () => {
  it("keeps focus inside the sheet and returns to trigger on close", async () => {
    const user = userEvent.setup()
    render(<SheetExamples />)

    await user.click(screen.getByTestId("sheet-controlled-trigger"))

    const dialog = await screen.findByRole("dialog", { name: /profile/i })
    expect(dialog).toBeInTheDocument()

    await user.tab()
    expect(screen.getByLabelText(/display name/i)).toHaveFocus()

    await user.keyboard("{Escape}")
    await waitFor(() =>
      expect(screen.queryByRole("dialog", { name: /profile/i })).not.toBeInTheDocument()
    )
    expect(screen.getByTestId("sheet-controlled-trigger")).toHaveFocus()
  })
})

describe("TooltipExamples", () => {
  it("reveals tooltip content on keyboard focus", async () => {
    const user = userEvent.setup()
    render(<TooltipExamples />)

    await user.tab()
    const trigger = screen.getByTestId("tooltip-trigger")
    expect(trigger).toHaveFocus()

    const tooltip = await screen.findByRole("tooltip", { name: /tooltips respect reduced motion/i })
    expect(tooltip).toBeVisible()
  })
})

describe("CommandExamples", () => {
  it("supports arrow key navigation and enter activation", async () => {
    const user = userEvent.setup()
    render(
      <main role="main">
        <CommandExamples />
      </main>
    )

    await user.click(screen.getByTestId("command-open"))
    await screen.findByRole("dialog")

    await user.keyboard("{ArrowDown}")
    await user.keyboard("{Enter}")
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
    await waitFor(() => expect(screen.getByTestId("command-open")).toHaveFocus())
  })

  it("passes axe checks when the command menu is open", async () => {
    const user = userEvent.setup()
    render(
      <main role="main">
        <CommandExamples />
      </main>
    )

    await user.click(screen.getByTestId("command-open"))
    await screen.findByRole("dialog", { name: /command palette/i })

    const results = await axe(document.body, {
      rules: { region: { enabled: false } },
    })
    expect(results).toHaveNoViolations()
  })
})

describe("SelectExamples", () => {
  it("updates controlled select value with keyboard interactions", async () => {
    const user = userEvent.setup()
    render(
      <main role="main">
        <SelectExamples />
      </main>
    )

    const trigger = screen.getByTestId("select-controlled-trigger")
    await user.click(trigger)

    await user.keyboard("{ArrowDown}")
    await user.keyboard("{Enter}")
    await waitFor(() =>
      expect(screen.getByTestId("select-value")).toHaveTextContent(/current value:\s*body/i)
    )
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it("maintains accessible semantics for the combobox", async () => {
    const user = userEvent.setup()
    render(
      <main role="main">
        <SelectExamples />
      </main>
    )

    const trigger = screen.getByTestId("select-controlled-trigger")
    await user.click(trigger)
    await screen.findByRole("option", { name: /caption/i })

    const results = await axe(document.body, {
      rules: { region: { enabled: false } },
    })
    expect(results).toHaveNoViolations()
  })
})

describe("TabsExamples", () => {
  it("moves selection with arrow keys", async () => {
    const user = userEvent.setup()
    render(<TabsExamples />)

    const tabs = screen.getByTestId("tabs-controlled")
    const overviewTrigger = within(tabs).getByRole("tab", { name: /overview/i })
    await user.click(overviewTrigger)

    await user.keyboard("{ArrowRight}")
    await waitFor(() => expect(screen.getByTestId("tabs-value")).toHaveTextContent(/activity/i))
  })
})

describe("ToastExamples", () => {
  it("announces toast messages without stealing focus", async () => {
    const user = userEvent.setup()
    render(
      <>
        <ToastExamples />
        <Toaster position="bottom-right" richColors closeButton />
      </>
    )

    const trigger = screen.getByTestId("toast-default")
    await user.click(trigger)

    await screen.findByText(/new workspace created/i)
    expect(trigger).toHaveFocus()
  })
})

describe("ScrollAreaExamples", () => {
  it("allows tabbing into scrollable content", async () => {
    const user = userEvent.setup()
    render(<ScrollAreaExamples />)

    const [firstItem] = screen.getAllByRole("button", { name: /focusable item/i })
    await user.tab()
    await waitFor(() => expect(firstItem).toHaveFocus())
  })
})

describe("DropdownMenuExamples", () => {
  it("supports checkbox toggles and radio selection via keyboard", async () => {
    const user = userEvent.setup()
    render(<DropdownMenuExamples />)

    const trigger = screen.getByTestId("dropdown-trigger")
    await user.click(trigger)

    const menu = await screen.findByRole("menu")
    expect(menu).toBeVisible()

    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}")
    const lineToggle = screen.getByTestId("dropdown-lines")
    expect(lineToggle).toHaveAttribute("aria-checked", "true")
    await user.keyboard("{Enter}")
    await waitFor(() => expect(lineToggle).toHaveAttribute("aria-checked", "false"))

    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument())

    await user.click(trigger)
    await screen.findByRole("menu")
    await user.keyboard("{ArrowDown}")
    await user.keyboard("{ArrowDown}")
    await user.keyboard("{ArrowDown}")
    await user.keyboard("{ArrowDown}")
    await user.keyboard("{ArrowRight}")
    await waitFor(() => expect(screen.getAllByRole("menu")).toHaveLength(2))
    await screen.findByRole("menuitemradio", { name: /medium/i })
  })
})

describe("PrimitiveShowcaseGrid", () => {
  it("renders all showcase sections", () => {
    render(<PrimitiveShowcaseGrid />)
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(primitiveShowcases.length)
  })
})
