import { render } from "vitest-browser-react";
import { describe, expect, it, vi } from "vitest";
import { userEvent, server } from "@vitest/browser/context";
import { StrictMode, createRef, type ReactNode } from "react";
import { RovingFocusGroup } from "./RovingFocusGroup";
import { RovingFocusItem } from "./RovingFocusItem";

const isWebkit =
  server.provider === "playwright" && server.browser === "webkit";

describe.each([
  ["default", false],
  ["StrictMode", true],
] as const)("regressions (%s)", (_, strict) => {
  const wrapper = strict
    ? ({ children }: { children: ReactNode }) => (
        <StrictMode>{children}</StrictMode>
      )
    : undefined;

  function List({ items }: { items: string[] }) {
    return (
      <RovingFocusGroup orientation="vertical" loop={false}>
        {items.map((item) => (
          <RovingFocusItem key={item}>{item}</RovingFocusItem>
        ))}
      </RovingFocusGroup>
    );
  }

  it("makes the first item tabbable when items arrive after mount", async () => {
    const screen = await render(<List items={[]} />, { wrapper });

    screen.rerender(<List items={["Item 1", "Item 2", "Item 3"]} />);
    await expect.element(screen.getByText("Item 1")).toBeInTheDocument();

    await userEvent.keyboard("{Tab}");

    await expect.element(screen.getByText("Item 1")).toHaveFocus();
    await expect
      .element(screen.getByText("Item 1"))
      .toHaveAttribute("tabindex", "0");
  });

  it.skipIf(isWebkit)(
    "keeps an item tabbable after the list shrinks below the active item",
    async () => {
      const five = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];
      const screen = await render(
        <>
          <List items={five} />
          <button>Outside</button>
        </>,
        { wrapper },
      );

      await userEvent.keyboard("{Tab}");
      await userEvent.keyboard("{End}");
      await expect.element(screen.getByText("Item 5")).toHaveFocus();

      screen.rerender(
        <>
          <List items={["Item 1", "Item 2"]} />
          <button>Outside</button>
        </>,
      );
      await expect.element(screen.getByText("Item 5")).not.toBeInTheDocument();
      (document.activeElement as HTMLElement | null)?.blur();

      await userEvent.keyboard("{Tab}");

      await expect.element(screen.getByText("Item 1")).toHaveFocus();
    },
  );

  it("navigates in DOM order after an item is inserted in the middle", async () => {
    const screen = await render(<List items={["Item 1", "Item 2"]} />, {
      wrapper,
    });
    screen.rerender(<List items={["Item 1", "New", "Item 2"]} />);
    await expect.element(screen.getByText("New")).toBeInTheDocument();

    await screen.getByText("Item 1").click();
    await userEvent.keyboard("{ArrowDown}");

    await expect.element(screen.getByText("New")).toHaveFocus();
  });

  it("calls a consumer onKeyDown and still moves focus", async () => {
    const onKeyDown = vi.fn();
    const screen = await render(
      <RovingFocusGroup orientation="vertical">
        <RovingFocusItem onKeyDown={onKeyDown}>Item 1</RovingFocusItem>
        <RovingFocusItem>Item 2</RovingFocusItem>
      </RovingFocusGroup>,
      { wrapper },
    );

    await screen.getByText("Item 1").click();
    await userEvent.keyboard("{ArrowDown}");

    await expect.element(screen.getByText("Item 2")).toHaveFocus();
    expect(onKeyDown).toHaveBeenCalled();
  });

  it("does not move focus when a consumer onKeyDown prevents default", async () => {
    const screen = await render(
      <RovingFocusGroup orientation="vertical">
        <RovingFocusItem onKeyDown={(e) => e.preventDefault()}>
          Item 1
        </RovingFocusItem>
        <RovingFocusItem>Item 2</RovingFocusItem>
      </RovingFocusGroup>,
      { wrapper },
    );

    await screen.getByText("Item 1").click();
    await userEvent.keyboard("{ArrowDown}");

    await expect.element(screen.getByText("Item 1")).toHaveFocus();
  });

  it("calls a group onKeyDown and lets it prevent navigation", async () => {
    const onKeyDown = vi.fn((e: React.KeyboardEvent) => e.preventDefault());
    const screen = await render(
      <RovingFocusGroup orientation="vertical" onKeyDown={onKeyDown}>
        <RovingFocusItem>Item 1</RovingFocusItem>
        <RovingFocusItem>Item 2</RovingFocusItem>
      </RovingFocusGroup>,
      { wrapper },
    );

    await screen.getByText("Item 1").click();
    await userEvent.keyboard("{ArrowDown}");

    expect(onKeyDown).toHaveBeenCalled();
    await expect.element(screen.getByText("Item 1")).toHaveFocus();
  });

  it("calls a consumer onFocus", async () => {
    const onFocus = vi.fn();
    const screen = await render(
      <RovingFocusGroup>
        <RovingFocusItem onFocus={onFocus}>Item 1</RovingFocusItem>
      </RovingFocusGroup>,
      { wrapper },
    );

    await userEvent.keyboard("{Tab}");

    expect(onFocus).toHaveBeenCalled();
  });

  it.skipIf(isWebkit)(
    "returns to the clicked item after tabbing away and back",
    async () => {
      const screen = await render(
        <>
          <List items={["Item 1", "Item 2", "Item 3"]} />
          <button>Outside</button>
        </>,
        { wrapper },
      );

      await screen.getByText("Item 3").click();
      await userEvent.keyboard("{Tab}");
      await expect.element(screen.getByText("Outside")).toHaveFocus();
      await userEvent.keyboard("{Shift>}{Tab}{/Shift}");

      await expect.element(screen.getByText("Item 3")).toHaveFocus();
    },
  );

  it.skipIf(isWebkit)(
    "makes a programmatically focused item the tab stop",
    async () => {
      const screen = await render(
        <>
          <List items={["Item 1", "Item 2", "Item 3"]} />
          <button>Outside</button>
        </>,
        { wrapper },
      );

      (screen.getByText("Item 2").element() as HTMLElement).focus();
      await userEvent.keyboard("{Tab}");
      await expect.element(screen.getByText("Outside")).toHaveFocus();
      await userEvent.keyboard("{Shift>}{Tab}{/Shift}");

      await expect.element(screen.getByText("Item 2")).toHaveFocus();
    },
  );

  it("passes consumer refs to the group and items and keeps navigation", async () => {
    const groupRef = createRef<HTMLElement>();
    const itemRef = createRef<HTMLElement>();
    let callbackEl: HTMLElement | null = null;
    const screen = await render(
      <RovingFocusGroup ref={groupRef} orientation="vertical">
        <RovingFocusItem ref={itemRef}>Item 1</RovingFocusItem>
        <RovingFocusItem ref={(el: HTMLElement | null) => (callbackEl = el)}>
          Item 2
        </RovingFocusItem>
      </RovingFocusGroup>,
      { wrapper },
    );

    expect(groupRef.current).toBeInstanceOf(HTMLDivElement);
    expect(itemRef.current?.textContent).toBe("Item 1");
    expect((callbackEl as HTMLElement | null)?.textContent).toBe("Item 2");

    await screen.getByText("Item 1").click();
    await userEvent.keyboard("{ArrowDown}");

    await expect.element(screen.getByText("Item 2")).toHaveFocus();
  });

  it("does not render a hard-coded data-testid on the group", async () => {
    const groupRef = createRef<HTMLElement>();
    await render(
      <RovingFocusGroup ref={groupRef}>
        <RovingFocusItem>Item 1</RovingFocusItem>
      </RovingFocusGroup>,
      { wrapper },
    );

    expect(groupRef.current?.hasAttribute("data-testid")).toBe(false);
  });

  it("does not hijack PageDown by default", async () => {
    const screen = await render(<List items={["Item 1", "Item 2"]} />, {
      wrapper,
    });

    await screen.getByText("Item 1").click();
    await userEvent.keyboard("{PageDown}");

    await expect.element(screen.getByText("Item 1")).toHaveFocus();
  });

  it("stops at the last focusable item with loop disabled and unfocusable neighbours", async () => {
    const screen = await render(
      <RovingFocusGroup orientation="vertical" loop={false}>
        <RovingFocusItem focusable={false}>Item 1</RovingFocusItem>
        <RovingFocusItem>Item 2</RovingFocusItem>
        <RovingFocusItem>Item 3</RovingFocusItem>
        <RovingFocusItem focusable={false}>Item 4</RovingFocusItem>
      </RovingFocusGroup>,
      { wrapper },
    );

    await screen.getByText("Item 3").click();
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(screen.getByText("Item 3")).toHaveFocus();

    await userEvent.keyboard("{ArrowUp}");
    await userEvent.keyboard("{ArrowUp}");
    await expect.element(screen.getByText("Item 2")).toHaveFocus();
  });

  it("skips over several unfocusable items with loop disabled", async () => {
    const screen = await render(
      <RovingFocusGroup orientation="vertical" loop={false}>
        <RovingFocusItem>Item 1</RovingFocusItem>
        <RovingFocusItem focusable={false}>Item 2</RovingFocusItem>
        <RovingFocusItem focusable={false}>Item 3</RovingFocusItem>
        <RovingFocusItem>Item 4</RovingFocusItem>
      </RovingFocusGroup>,
      { wrapper },
    );

    await screen.getByText("Item 1").click();
    await userEvent.keyboard("{ArrowDown}");

    await expect.element(screen.getByText("Item 4")).toHaveFocus();
  });
});
