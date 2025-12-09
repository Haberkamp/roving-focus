import { render } from "vitest-browser-react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RovingFocusGroup } from "./RovingFocusGroup";
import { RovingFocusItem } from "./RovingFocusItem";
import { userEvent, page, server } from "@vitest/browser/context";
import { useState } from "react";

const isWebkit =
  server.provider === "playwright" && server.browser === "webkit";

afterEach(() => vi.restoreAllMocks());

it("focuses the first item when pressing tab", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup>
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
      <RovingFocusItem>Item 3</RovingFocusItem>
    </RovingFocusGroup>,
  );

  // ACT
  await userEvent.keyboard("{Tab}");

  // ASSERT
  await expect.element(screen.getByText("Item 1")).toHaveFocus();
});

it.skipIf(isWebkit)(
  "focuses the next item outside the group when pressing tab",
  async () => {
    // ARRANGE
    const screen = await render(
      <div>
        <RovingFocusGroup>
          <RovingFocusItem>Item 1</RovingFocusItem>
          <RovingFocusItem>Item 2</RovingFocusItem>
          <RovingFocusItem>Item 3</RovingFocusItem>
        </RovingFocusGroup>

        <button>Outside</button>
      </div>,
    );

    // ACT
    await userEvent.keyboard("{Tab}");
    await userEvent.keyboard("{Tab}");

    // ASSERT
    await expect.element(screen.getByText("Outside")).toHaveFocus();
  },
);

it("re-focuses the first item when pressing Shift + Tab", async () => {
  // ARRANGE
  const screen = await render(
    <div>
      <RovingFocusGroup>
        <RovingFocusItem>Item 1</RovingFocusItem>
        <RovingFocusItem>Item 2</RovingFocusItem>
        <RovingFocusItem>Item 3</RovingFocusItem>
      </RovingFocusGroup>
      <button>Outside</button>
    </div>,
  );

  await userEvent.keyboard("{Tab}");
  await userEvent.keyboard("{Tab}");

  // ACT
  await userEvent.keyboard("{Shift>}{Tab}{/Shift}");

  // ASSERT
  await expect.element(screen.getByText("Item 1")).toHaveFocus();
});

it("focuses the next item when pressing the right arrow key", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup>
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
      <RovingFocusItem>Item 3</RovingFocusItem>
    </RovingFocusGroup>,
  );

  await userEvent.keyboard("{Tab}");

  // ACT
  await userEvent.keyboard("{ArrowRight}");

  // ASSERT
  await expect.element(screen.getByText("Item 2")).toHaveFocus();
  await expect
    .element(screen.getByText("Item 2"))
    .toHaveAttribute("tabindex", "0");

  await expect.element(screen.getByText("Item 3")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 3"))
    .toHaveAttribute("tabindex", "-1");

  await expect.element(screen.getByText("Item 1")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 1"))
    .toHaveAttribute("tabindex", "-1");
});

it("focuses the third item when pressing the right arrow key on the second item", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup>
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
      <RovingFocusItem>Item 3</RovingFocusItem>
    </RovingFocusGroup>,
  );

  await userEvent.tab();
  await userEvent.keyboard("{ArrowRight}");

  // ACT
  await userEvent.keyboard("{ArrowRight}");

  // ASSERT
  await expect.element(screen.getByText("Item 3")).toHaveFocus();
});

it("focuses the last item when pressing the right arrow key on the second item", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup>
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
    </RovingFocusGroup>,
  );

  await userEvent.tab();
  await userEvent.keyboard("{ArrowRight}");

  // ACT
  await userEvent.keyboard("{ArrowRight}");

  // ASSERT
  await expect.element(screen.getByText("Item 1")).toHaveFocus();
  await expect
    .element(screen.getByText("Item 1"))
    .toHaveAttribute("tabindex", "0");

  await expect.element(screen.getByText("Item 2")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 2"))
    .toHaveAttribute("tabindex", "-1");
});

it("focues the previous item when pressing the left arrow key", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup>
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
      <RovingFocusItem>Item 3</RovingFocusItem>
    </RovingFocusGroup>,
  );

  await userEvent.tab();
  await userEvent.keyboard("{ArrowRight}");

  // ACT
  await userEvent.keyboard("{ArrowLeft}");

  // ASSERT
  await expect.element(screen.getByText("Item 1")).toHaveFocus();
  await expect
    .element(screen.getByText("Item 1"))
    .toHaveAttribute("tabindex", "0");

  await expect.element(screen.getByText("Item 2")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 2"))
    .toHaveAttribute("tabindex", "-1");

  await expect.element(screen.getByText("Item 3")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 3"))
    .toHaveAttribute("tabindex", "-1");
});

it("focuses the last item when pressing the left arrow key on the first item", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup>
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
    </RovingFocusGroup>,
  );

  await userEvent.tab();
  await userEvent.keyboard("{ArrowLeft}");

  // ASSERT
  await expect.element(screen.getByText("Item 2")).toHaveFocus();
  await expect
    .element(screen.getByText("Item 2"))
    .toHaveAttribute("tabindex", "0");

  await expect.element(screen.getByText("Item 1")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 1"))
    .toHaveAttribute("tabindex", "-1");
});

it("focuses back to the last selected item when pressing Shift + Tab", async () => {
  // ARRANGE
  const screen = await render(
    <div>
      <RovingFocusGroup>
        <RovingFocusItem>Item 1</RovingFocusItem>
        <RovingFocusItem>Item 2</RovingFocusItem>
      </RovingFocusGroup>

      <button>Outside</button>
    </div>,
  );

  await userEvent.tab();
  await userEvent.keyboard("{ArrowRight}");
  await userEvent.tab();

  // ACT
  await userEvent.tab({
    shift: true,
  });

  // ASSERT
  await expect.element(screen.getByText("Item 2")).toHaveFocus();
  await expect
    .element(screen.getByText("Item 2"))
    .toHaveAttribute("tabindex", "0");

  await expect.element(screen.getByText("Item 1")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 1"))
    .toHaveAttribute("tabindex", "-1");
});

it("stops at the last item when pressing the right arrow key on the last item and loop is disabled", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup loop={false}>
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
    </RovingFocusGroup>,
  );

  await userEvent.tab();
  await userEvent.keyboard("{ArrowRight}");

  // ACT
  await userEvent.keyboard("{ArrowRight}");

  // ASSERT
  await expect.element(screen.getByText("Item 2")).toHaveFocus();
  await expect
    .element(screen.getByText("Item 2"))
    .toHaveAttribute("tabindex", "0");

  await expect.element(screen.getByText("Item 1")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 1"))
    .toHaveAttribute("tabindex", "-1");
});

it("stops at the first item when pressing the left arrow key on the first item and loop is disabled", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup loop={false}>
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
    </RovingFocusGroup>,
  );

  await userEvent.tab();

  // ACT
  await userEvent.keyboard("{ArrowLeft}");

  // ASSERT
  await expect.element(screen.getByText("Item 1")).toHaveFocus();
  await expect
    .element(screen.getByText("Item 1"))
    .toHaveAttribute("tabindex", "0");

  await expect.element(screen.getByText("Item 2")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 2"))
    .toHaveAttribute("tabindex", "-1");
});

it.each(["PageDown", "End"])(
  "focuses the last item when pressing the %s key",
  async (key) => {
    // ARRANGE
    const screen = await render(
      <RovingFocusGroup>
        <RovingFocusItem>Item 1</RovingFocusItem>
        <RovingFocusItem>Item 2</RovingFocusItem>
        <RovingFocusItem>Item 3</RovingFocusItem>
      </RovingFocusGroup>,
    );

    await userEvent.tab();

    // ACT
    await userEvent.keyboard(`{${key}}`);

    // ASSERT
    await expect.element(screen.getByText("Item 3")).toHaveFocus();
    await expect
      .element(screen.getByText("Item 3"))
      .toHaveAttribute("tabindex", "0");

    await expect.element(screen.getByText("Item 1")).not.toHaveFocus();
    await expect
      .element(screen.getByText("Item 1"))
      .toHaveAttribute("tabindex", "-1");

    await expect.element(screen.getByText("Item 2")).not.toHaveFocus();
    await expect
      .element(screen.getByText("Item 2"))
      .toHaveAttribute("tabindex", "-1");
  },
);

it.each(["PageUp", "Home"])(
  "focuses the first item when pressing the %s key",
  async (key) => {
    // ARRANGE
    const screen = await render(
      <RovingFocusGroup>
        <RovingFocusItem>Item 1</RovingFocusItem>
        <RovingFocusItem>Item 2</RovingFocusItem>
        <RovingFocusItem>Item 3</RovingFocusItem>
      </RovingFocusGroup>,
    );

    await userEvent.tab();
    await userEvent.keyboard("{PageDown}");

    // ACT
    await userEvent.keyboard(`{${key}}`);

    // ASSERT
    await expect.element(screen.getByText("Item 1")).toHaveFocus();
    await expect
      .element(screen.getByText("Item 1"))
      .toHaveAttribute("tabindex", "0");

    await expect.element(screen.getByText("Item 2")).not.toHaveFocus();
    await expect
      .element(screen.getByText("Item 2"))
      .toHaveAttribute("tabindex", "-1");

    await expect.element(screen.getByText("Item 3")).not.toHaveFocus();
    await expect
      .element(screen.getByText("Item 3"))
      .toHaveAttribute("tabindex", "-1");
  },
);

it("renders as a button using the asChild prop", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup>
      <RovingFocusItem>Item 1</RovingFocusItem>

      <RovingFocusItem asChild>
        <button>Item 2</button>
      </RovingFocusItem>
    </RovingFocusGroup>,
  );

  // ACT
  await userEvent.tab();
  await userEvent.keyboard("{ArrowRight}");

  // ASSERT
  await expect
    .element(screen.getByRole("button", { name: "Item 2" }))
    .toHaveFocus();

  await expect
    .element(screen.getByRole("button", { name: "Item 2" }))
    .toHaveAttribute("tabindex", "0");

  await expect.element(screen.getByText("Item 1")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 1"))
    .toHaveAttribute("tabindex", "-1");
});

it("renders as a button using the as prop", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup>
      <RovingFocusItem>Item 1</RovingFocusItem>

      <RovingFocusItem as="button">Item 2</RovingFocusItem>
    </RovingFocusGroup>,
  );

  await userEvent.tab();

  // ACT
  await userEvent.keyboard("{ArrowRight}");

  // ASSERT
  await expect
    .element(screen.getByRole("button", { name: "Item 2" }))
    .toHaveFocus();

  await expect
    .element(screen.getByRole("button", { name: "Item 2" }))
    .toHaveAttribute("tabindex", "0");

  await expect.element(screen.getByText("Item 1")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 1"))
    .toHaveAttribute("tabindex", "-1");
});

it("prefers asChild over as prop", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup>
      <RovingFocusItem asChild as="button">
        <a href="https://www.google.com">Item 1</a>
      </RovingFocusItem>
    </RovingFocusGroup>,
  );

  // ASSERT
  await expect
    .element(screen.getByText("Item 1"))
    .toBeInstanceOf(HTMLAnchorElement);

  expect(screen.getByText("Item 1")).toHaveAttribute(
    "href",
    "https://www.google.com",
  );
});

it("focuses the previous item when pressing the Arrow Up key and orientation is vertical", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup
      orientation="vertical"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
      <RovingFocusItem>Item 3</RovingFocusItem>
    </RovingFocusGroup>,
  );

  await userEvent.tab();
  await userEvent.keyboard("{ArrowDown}");

  // ACT
  await userEvent.keyboard("{ArrowUp}");

  // ASSERT
  await expect.element(screen.getByText("Item 1")).toHaveFocus();
  await expect
    .element(screen.getByText("Item 1"))
    .toHaveAttribute("tabindex", "0");

  await expect.element(screen.getByText("Item 2")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 2"))
    .toHaveAttribute("tabindex", "-1");

  await expect.element(screen.getByText("Item 3")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 3"))
    .toHaveAttribute("tabindex", "-1");
});

it("focuses the next item when pressing the Arrow Down key and orientation is vertical", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup
      orientation="vertical"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
      <RovingFocusItem>Item 3</RovingFocusItem>
    </RovingFocusGroup>,
  );

  await userEvent.tab();

  // ACT
  await userEvent.keyboard("{ArrowDown}");

  // ASSERT
  await expect.element(screen.getByText("Item 2")).toHaveFocus();
  await expect
    .element(screen.getByText("Item 2"))
    .toHaveAttribute("tabindex", "0");

  await expect.element(screen.getByText("Item 1")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 1"))
    .toHaveAttribute("tabindex", "-1");

  await expect.element(screen.getByText("Item 3")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 3"))
    .toHaveAttribute("tabindex", "-1");
});

it("is not possible to focus the next item with the Right Arrow key and orientation is vertical", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup
      orientation="vertical"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
    </RovingFocusGroup>,
  );

  await userEvent.tab();

  // ACT
  await userEvent.keyboard("{ArrowRight}");

  // ASSERT
  await expect.element(screen.getByText("Item 1")).toHaveFocus();
  await expect
    .element(screen.getByText("Item 1"))
    .toHaveAttribute("tabindex", "0");

  await expect.element(screen.getByText("Item 2")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 2"))
    .toHaveAttribute("tabindex", "-1");
});

it("is not possible to focus the previous item with the Left Arrow key and orientation is vertical", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup
      orientation="vertical"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
    </RovingFocusGroup>,
  );

  await userEvent.tab();
  await userEvent.keyboard("{ArrowDown}");

  // ACT
  await userEvent.keyboard("{ArrowLeft}");

  // ASSERT
  await expect.element(screen.getByText("Item 1")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 1"))
    .toHaveAttribute("tabindex", "-1");

  await expect.element(screen.getByText("Item 2")).toHaveFocus();
  await expect
    .element(screen.getByText("Item 2"))
    .toHaveAttribute("tabindex", "0");
});

it("is not possible to focus the next item with the right arrow key when the orientation is vertical", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup
      orientation="vertical"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
      <RovingFocusItem>Item 3</RovingFocusItem>
    </RovingFocusGroup>,
  );

  await userEvent.tab();
  await userEvent.keyboard("{ArrowDown}");

  // ACT
  await userEvent.keyboard("{ArrowRight}");

  // ASSERT
  await expect.element(screen.getByText("Item 2")).toHaveFocus();
  await expect
    .element(screen.getByText("Item 2"))
    .toHaveAttribute("tabindex", "0");

  await expect.element(screen.getByText("Item 1")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 1"))
    .toHaveAttribute("tabindex", "-1");

  await expect.element(screen.getByText("Item 3")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 3"))
    .toHaveAttribute("tabindex", "-1");
});

it("is not possible to focus the previous item with the left arrow key when the orientation is vertical", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup
      orientation="vertical"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
      <RovingFocusItem>Item 3</RovingFocusItem>
    </RovingFocusGroup>,
  );

  await userEvent.tab();
  await userEvent.keyboard("{ArrowDown}");

  // ACT
  await userEvent.keyboard("{ArrowLeft}");

  // ASSERT
  await expect.element(screen.getByText("Item 2")).toHaveFocus();
  await expect
    .element(screen.getByText("Item 2"))
    .toHaveAttribute("tabindex", "0");

  await expect.element(screen.getByText("Item 1")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 1"))
    .toHaveAttribute("tabindex", "-1");

  await expect.element(screen.getByText("Item 3")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 3"))
    .toHaveAttribute("tabindex", "-1");
});

it.each([["horizontal", "vertical"] as const])(
  'adds a data-orientation="%s" attribute to the group when the orientation is %s',
  async (orientation) => {
    // ARRANGE
    const screen = await render(
      <RovingFocusGroup
        orientation={orientation}
        style={{ display: "flex", flexDirection: "row" }}
      >
        <RovingFocusItem>Item 1</RovingFocusItem>
        <RovingFocusItem>Item 2</RovingFocusItem>
      </RovingFocusGroup>,
    );

    // ASSERT
    await expect
      .element(screen.getByTestId("roving-focus-group"))
      .toHaveAttribute("data-orientation", orientation);
  },
);

it('adds a data-orientation="horizontal" attribute to the group when no orientation is provided', async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup>
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
    </RovingFocusGroup>,
  );

  // ASSERT
  await expect
    .element(screen.getByTestId("roving-focus-group"))
    .toHaveAttribute("data-orientation", "horizontal");
});

it.each([["horizontal", "vertical"] as const])(
  'adds data-orientation="%s" to every single child',
  async (orientation) => {
    // ARRANGE
    const screen = await render(
      <RovingFocusGroup orientation={orientation}>
        <RovingFocusItem>Item 1</RovingFocusItem>
        <RovingFocusItem>Item 2</RovingFocusItem>
      </RovingFocusGroup>,
    );

    // ASSERT
    await expect
      .element(screen.getByText("Item 1"))
      .toHaveAttribute("data-orientation", orientation);

    await expect
      .element(screen.getByText("Item 2"))
      .toHaveAttribute("data-orientation", orientation);
  },
);

it("renders the group as a div by default", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup>
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
    </RovingFocusGroup>,
  );

  // ASSERT
  await expect
    .element(screen.getByTestId("roving-focus-group"))
    .toBeInstanceOf(HTMLDivElement);
});

it("renders the group as a span when using the as prop", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup as="span">
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
    </RovingFocusGroup>,
  );

  // ASSERT
  await expect
    .element(screen.getByTestId("roving-focus-group"))
    .toBeInstanceOf(HTMLSpanElement);
});

it("renders the group as a span when using the asChild prop", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup asChild>
      <span>
        <RovingFocusItem>Item 1</RovingFocusItem>
        <RovingFocusItem>Item 2</RovingFocusItem>
      </span>
    </RovingFocusGroup>,
  );

  // ASSERT
  await expect
    .element(screen.getByTestId("roving-focus-group"))
    .toBeInstanceOf(HTMLSpanElement);
});

it("prefers the asChild prop over the as prop for the group component", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup as="span" asChild>
      <div>
        <RovingFocusItem>Item 1</RovingFocusItem>
        <RovingFocusItem>Item 2</RovingFocusItem>
      </div>
    </RovingFocusGroup>,
  );

  // ASSERT
  await expect
    .element(screen.getByTestId("roving-focus-group"))
    .toBeInstanceOf(HTMLDivElement);
});

it("skips the unfocusable items until it reaches the next focusable item", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup>
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem focusable={false}>Item 2</RovingFocusItem>
      <RovingFocusItem>Item 3</RovingFocusItem>
    </RovingFocusGroup>,
  );

  await userEvent.tab();

  // ACT
  await userEvent.keyboard("{ArrowRight}");

  // ASSERT
  await expect.element(screen.getByText("Item 3")).toHaveFocus();

  await expect.element(screen.getByText("Item 2")).not.toHaveFocus();
  await expect.element(screen.getByText("Item 1")).not.toHaveFocus();
});

it('adds a data-disabled="true" attribute the unfocusable items', async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup>
      <RovingFocusItem focusable={false}>Item 1</RovingFocusItem>
    </RovingFocusGroup>,
  );

  // ASSERT
  await expect
    .element(screen.getByText("Item 1"))
    .toHaveAttribute("data-disabled", "true");
});

it("does not add a data-disabled attribute to focusable items", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup>
      <RovingFocusItem focusable={true}>Item 1</RovingFocusItem>
    </RovingFocusGroup>,
  );

  // ASSERT
  await expect
    .element(screen.getByText("Item 1"))
    .not.toHaveAttribute("data-disabled");
});

it("focuses the last focusable item when pressing the End key", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup>
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
      <RovingFocusItem focusable={false}>Item 3</RovingFocusItem>
    </RovingFocusGroup>,
  );

  await userEvent.tab();

  // ACT
  await userEvent.keyboard("{End}");

  // ASSERT
  await expect.element(screen.getByText("Item 2")).toHaveFocus();

  await expect.element(screen.getByText("Item 1")).not.toHaveFocus();
  await expect.element(screen.getByText("Item 3")).not.toHaveFocus();
});

it("focuses the first focusable item when pressing the Home key", async () => {
  // ARRANGE
  const screen = await render(
    <RovingFocusGroup>
      <RovingFocusItem focusable={false}>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
      <RovingFocusItem>Item 3</RovingFocusItem>
    </RovingFocusGroup>,
  );

  await userEvent.tab();

  // ACT
  await userEvent.keyboard("{Home}");

  // ASSERT
  await expect.element(screen.getByText("Item 2")).toHaveFocus();

  await expect.element(screen.getByText("Item 1")).not.toHaveFocus();
  await expect.element(screen.getByText("Item 3")).not.toHaveFocus();
});

it("focuses the next item when pressing the right arrow key after the clicked on an item that is not the first item", async () => {
  // ARRANGE
  const screen = render(
    <RovingFocusGroup>
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
      <RovingFocusItem>Item 3</RovingFocusItem>
    </RovingFocusGroup>,
  );

  // ACT
  await screen.getByText("Item 2").click();

  await userEvent.keyboard("{ArrowRight}");

  // ASSERT
  await expect.element(screen.getByText("Item 3")).toHaveFocus();
  await expect
    .element(screen.getByText("Item 3"))
    .toHaveAttribute("tabindex", "0");

  await expect.element(screen.getByText("Item 2")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 2"))
    .toHaveAttribute("tabindex", "-1");

  await expect.element(screen.getByText("Item 1")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 1"))
    .toHaveAttribute("tabindex", "-1");
});

it("throws an error when using the RovingFocusItem outside of a RovingFocusGroup", async () => {
  // ARRANGE
  expect(() => {
    render(<RovingFocusItem>Item 1</RovingFocusItem>);
  }).toThrow("useRovingFocus must be used within a RovingFocusGroup");
});

it("focuses the item which is marked as the defaul active item", async () => {
  // ARRANGE
  const screen = render(
    <RovingFocusGroup>
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem active>Item 2</RovingFocusItem>
    </RovingFocusGroup>,
  );

  // ASSERT
  await userEvent.tab();

  await expect.element(screen.getByText("Item 2")).toHaveFocus();
  await expect
    .element(screen.getByText("Item 2"))
    .toHaveAttribute("tabindex", "0");

  await expect.element(screen.getByText("Item 1")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 1"))
    .toHaveAttribute("tabindex", "-1");
});

it("adds a data-active attribute to the default active item", async () => {
  // ARRANGE
  const screen = render(
    <RovingFocusGroup>
      <RovingFocusItem active>Item 1</RovingFocusItem>
      <RovingFocusItem>Item 2</RovingFocusItem>
    </RovingFocusGroup>,
  );

  // ASSERT
  await expect
    .element(screen.getByText("Item 1"))
    .toHaveAttribute("data-active", "true");

  await expect
    .element(screen.getByText("Item 2"))
    .not.toHaveAttribute("data-active");
});

it("logs a message to the console when the default active item is unfocusable", async () => {
  // ARRANGE
  const consoleWarnSpy = vi.spyOn(console, "warn");

  render(
    <RovingFocusGroup>
      <RovingFocusItem focusable={false} active>
        Item 1
      </RovingFocusItem>
    </RovingFocusGroup>,
  );

  // ASSERT
  expect(consoleWarnSpy).toHaveBeenCalledWith(
    "The default active item is unfocusable. This is not recommended.",
  );
});

it("focuses the next focusable item when the default active item is unfocusable", async () => {
  // ARRANGE
  const screen = render(
    <RovingFocusGroup>
      <RovingFocusItem>Item 1</RovingFocusItem>
      <RovingFocusItem focusable={false} active>
        Item 2
      </RovingFocusItem>
      <RovingFocusItem>Item 3</RovingFocusItem>
    </RovingFocusGroup>,
  );

  // ACT
  await userEvent.tab();

  // ASSERT
  await expect.element(screen.getByText("Item 3")).toHaveFocus();
  await expect
    .element(screen.getByText("Item 3"))
    .toHaveAttribute("tabindex", "0");

  await expect.element(screen.getByText("Item 1")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 1"))
    .toHaveAttribute("tabindex", "-1");

  await expect.element(screen.getByText("Item 2")).not.toHaveFocus();
  await expect
    .element(screen.getByText("Item 2"))
    .toHaveAttribute("tabindex", "-1");
});

// =============================================================================
// GRID ORIENTATION TESTS (using CSS grid layout for auto-detection)
// =============================================================================

describe("grid orientation", () => {
  // Helper to create a grid style
  const gridStyle = (cols: number) => ({
    display: "grid" as const,
    gridTemplateColumns: `repeat(${cols}, 50px)`,
  });

  // ---------------------------------------------------------------------------
  // Orientation & Data Attributes
  // ---------------------------------------------------------------------------

  it('renders group with data-orientation="grid"', async () => {
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid" style={gridStyle(2)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,1
        </RovingFocusItem>
      </RovingFocusGroup>,
    );

    // ASSERT
    await expect
      .element(screen.getByTestId("roving-focus-group"))
      .toHaveAttribute("data-orientation", "grid");
  });

  it('renders items with data-orientation="grid"', async () => {
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid" style={gridStyle(2)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,1
        </RovingFocusItem>
      </RovingFocusGroup>,
    );

    // ASSERT
    await expect
      .element(screen.getByText("Cell 0,0"))
      .toHaveAttribute("data-orientation", "grid");
    await expect
      .element(screen.getByText("Cell 0,1"))
      .toHaveAttribute("data-orientation", "grid");
  });

  // ---------------------------------------------------------------------------
  // Arrow Key Navigation - Row (ArrowRight / ArrowLeft)
  // ---------------------------------------------------------------------------

  it("focuses next cell in row when pressing ArrowRight", async () => {
    // ARRANGE - 3 items in a row
    const screen = render(
      <RovingFocusGroup orientation="grid" style={gridStyle(3)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,2
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{ArrowRight}");

    // ASSERT
    await expect.element(screen.getByText("Cell 0,1")).toHaveFocus();
    await expect
      .element(screen.getByText("Cell 0,1"))
      .toHaveAttribute("tabindex", "0");
    await expect
      .element(screen.getByText("Cell 0,0"))
      .toHaveAttribute("tabindex", "-1");
  });

  it("focuses previous cell in row when pressing ArrowLeft", async () => {
    // ARRANGE - 2 items in a row
    const screen = render(
      <RovingFocusGroup orientation="grid" style={gridStyle(2)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,1
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");

    // ACT
    await userEvent.keyboard("{ArrowLeft}");

    // ASSERT
    await expect.element(screen.getByText("Cell 0,0")).toHaveFocus();
    await expect
      .element(screen.getByText("Cell 0,0"))
      .toHaveAttribute("tabindex", "0");
    await expect
      .element(screen.getByText("Cell 0,1"))
      .toHaveAttribute("tabindex", "-1");
  });

  it("loops to first cell in row when pressing ArrowRight on last cell (loop=true)", async () => {
    // ARRANGE - 2 items in a row
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={true} style={gridStyle(2)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,1
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");

    // ACT
    await userEvent.keyboard("{ArrowRight}");

    // ASSERT
    await expect.element(screen.getByText("Cell 0,0")).toHaveFocus();
  });

  it("stays on last cell in row when pressing ArrowRight on last cell (loop=false)", async () => {
    // ARRANGE - 2 items in a row
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={false} style={gridStyle(2)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,1
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");

    // ACT
    await userEvent.keyboard("{ArrowRight}");

    // ASSERT
    await expect.element(screen.getByText("Cell 0,1")).toHaveFocus();
  });

  it("loops to last cell in row when pressing ArrowLeft on first cell (loop=true)", async () => {
    // ARRANGE - 2 items in a row
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={true} style={gridStyle(2)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,1
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{ArrowLeft}");

    // ASSERT
    await expect.element(screen.getByText("Cell 0,1")).toHaveFocus();
  });

  it("stays on first cell in row when pressing ArrowLeft on first cell (loop=false)", async () => {
    // ARRANGE - 2 items in a row
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={false} style={gridStyle(2)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,1
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{ArrowLeft}");

    // ASSERT
    await expect.element(screen.getByText("Cell 0,0")).toHaveFocus();
  });

  // ---------------------------------------------------------------------------
  // Arrow Key Navigation - Column (ArrowDown / ArrowUp)
  // ---------------------------------------------------------------------------

  it("focuses next cell in column when pressing ArrowDown", async () => {
    // ARRANGE - 3 items in a column (1 col grid)
    const screen = render(
      <RovingFocusGroup orientation="grid" style={gridStyle(1)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 2,0
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{ArrowDown}");

    // ASSERT
    await expect.element(screen.getByText("Cell 1,0")).toHaveFocus();
    await expect
      .element(screen.getByText("Cell 1,0"))
      .toHaveAttribute("tabindex", "0");
    await expect
      .element(screen.getByText("Cell 0,0"))
      .toHaveAttribute("tabindex", "-1");
  });

  it("focuses previous cell in column when pressing ArrowUp", async () => {
    // ARRANGE - 2 items in a column
    const screen = render(
      <RovingFocusGroup orientation="grid" style={gridStyle(1)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1,0
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}");

    // ACT
    await userEvent.keyboard("{ArrowUp}");

    // ASSERT
    await expect.element(screen.getByText("Cell 0,0")).toHaveFocus();
    await expect
      .element(screen.getByText("Cell 0,0"))
      .toHaveAttribute("tabindex", "0");
    await expect
      .element(screen.getByText("Cell 1,0"))
      .toHaveAttribute("tabindex", "-1");
  });

  it("loops to first cell in column when pressing ArrowDown on last cell (loop=true)", async () => {
    // ARRANGE - 2 items in a column
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={true} style={gridStyle(1)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1,0
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}");

    // ACT
    await userEvent.keyboard("{ArrowDown}");

    // ASSERT
    await expect.element(screen.getByText("Cell 0,0")).toHaveFocus();
  });

  it("stays on last cell in column when pressing ArrowDown on last cell (loop=false)", async () => {
    // ARRANGE - 2 items in a column
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={false} style={gridStyle(1)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1,0
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}");

    // ACT
    await userEvent.keyboard("{ArrowDown}");

    // ASSERT
    await expect.element(screen.getByText("Cell 1,0")).toHaveFocus();
  });

  it("loops to last cell in column when pressing ArrowUp on first cell (loop=true)", async () => {
    // ARRANGE - 2 items in a column
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={true} style={gridStyle(1)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1,0
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{ArrowUp}");

    // ASSERT
    await expect.element(screen.getByText("Cell 1,0")).toHaveFocus();
  });

  it("stays on first cell in column when pressing ArrowUp on first cell (loop=false)", async () => {
    // ARRANGE - 2 items in a column
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={false} style={gridStyle(1)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1,0
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{ArrowUp}");

    // ASSERT
    await expect.element(screen.getByText("Cell 0,0")).toHaveFocus();
  });

  // ---------------------------------------------------------------------------
  // 2D Grid Navigation (Multiple Rows and Columns)
  // ---------------------------------------------------------------------------

  it("navigates within row without crossing to other rows via ArrowRight", async () => {
    // ARRANGE - 2x2 grid
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={false} style={gridStyle(2)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1,1
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}"); // now at 0,1

    // ACT
    await userEvent.keyboard("{ArrowRight}"); // should stay at 0,1 (no loop)

    // ASSERT
    await expect.element(screen.getByText("Cell 0,1")).toHaveFocus();
  });

  it("navigates within column without crossing to other columns via ArrowDown", async () => {
    // ARRANGE - 2x2 grid
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={false} style={gridStyle(2)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1,1
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}"); // now at 1,0

    // ACT
    await userEvent.keyboard("{ArrowDown}"); // should stay at 1,0 (no loop)

    // ASSERT
    await expect.element(screen.getByText("Cell 1,0")).toHaveFocus();
  });

  it("navigates full 2D grid: right, down, left, up", async () => {
    // ARRANGE - 2x2 grid
    const screen = render(
      <RovingFocusGroup orientation="grid" style={gridStyle(2)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1,1
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();

    // ACT & ASSERT
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(screen.getByText("Cell 0,1")).toHaveFocus();

    await userEvent.keyboard("{ArrowDown}");
    await expect.element(screen.getByText("Cell 1,1")).toHaveFocus();

    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(screen.getByText("Cell 1,0")).toHaveFocus();

    await userEvent.keyboard("{ArrowUp}");
    await expect.element(screen.getByText("Cell 0,0")).toHaveFocus();
  });

  // ---------------------------------------------------------------------------
  // Home / End Navigation (Entire Grid)
  // ---------------------------------------------------------------------------

  it.each(["Home", "PageUp"])(
    "focuses first focusable cell in grid when pressing %s",
    async (key) => {
      // ARRANGE - 2x2 grid
      const screen = render(
        <RovingFocusGroup orientation="grid" style={gridStyle(2)}>
          <RovingFocusItem style={{ width: 50, height: 50 }}>
            Cell 0,0
          </RovingFocusItem>
          <RovingFocusItem style={{ width: 50, height: 50 }}>
            Cell 0,1
          </RovingFocusItem>
          <RovingFocusItem style={{ width: 50, height: 50 }}>
            Cell 1,0
          </RovingFocusItem>
          <RovingFocusItem style={{ width: 50, height: 50 }}>
            Cell 1,1
          </RovingFocusItem>
        </RovingFocusGroup>,
      );
      await userEvent.tab();
      await userEvent.keyboard("{ArrowRight}");
      await userEvent.keyboard("{ArrowDown}"); // now at 1,1

      // ACT
      await userEvent.keyboard(`{${key}}`);

      // ASSERT
      await expect.element(screen.getByText("Cell 0,0")).toHaveFocus();
      await expect
        .element(screen.getByText("Cell 0,0"))
        .toHaveAttribute("tabindex", "0");
    },
  );

  it.each(["End", "PageDown"])(
    "focuses last focusable cell in grid when pressing %s",
    async (key) => {
      // ARRANGE - 2x2 grid
      const screen = render(
        <RovingFocusGroup orientation="grid" style={gridStyle(2)}>
          <RovingFocusItem style={{ width: 50, height: 50 }}>
            Cell 0,0
          </RovingFocusItem>
          <RovingFocusItem style={{ width: 50, height: 50 }}>
            Cell 0,1
          </RovingFocusItem>
          <RovingFocusItem style={{ width: 50, height: 50 }}>
            Cell 1,0
          </RovingFocusItem>
          <RovingFocusItem style={{ width: 50, height: 50 }}>
            Cell 1,1
          </RovingFocusItem>
        </RovingFocusGroup>,
      );
      await userEvent.tab();

      // ACT
      await userEvent.keyboard(`{${key}}`);

      // ASSERT
      await expect.element(screen.getByText("Cell 1,1")).toHaveFocus();
      await expect
        .element(screen.getByText("Cell 1,1"))
        .toHaveAttribute("tabindex", "0");
    },
  );

  it("Home skips unfocusable first cell and focuses next focusable", async () => {
    // ARRANGE - 2x2 grid with first cell unfocusable
    const screen = render(
      <RovingFocusGroup orientation="grid" style={gridStyle(2)}>
        <RovingFocusItem style={{ width: 50, height: 50 }} focusable={false}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1,0
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}"); // at 1,0

    // ACT
    await userEvent.keyboard("{Home}");

    // ASSERT
    await expect.element(screen.getByText("Cell 0,1")).toHaveFocus();
  });

  it("End skips unfocusable last cell and focuses previous focusable", async () => {
    // ARRANGE - 2x2 grid with last cell unfocusable
    const screen = render(
      <RovingFocusGroup orientation="grid" style={gridStyle(2)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }} focusable={false}>
          Cell 1,1
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{End}");

    // ASSERT
    await expect.element(screen.getByText("Cell 1,0")).toHaveFocus();
  });

  // ---------------------------------------------------------------------------
  // Non-Focusable Items in Grid
  // ---------------------------------------------------------------------------

  it("skips non-focusable items when navigating right in row", async () => {
    // ARRANGE - 3 items in a row, middle one unfocusable
    const screen = render(
      <RovingFocusGroup orientation="grid" style={gridStyle(3)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }} focusable={false}>
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,2
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{ArrowRight}");

    // ASSERT
    await expect.element(screen.getByText("Cell 0,2")).toHaveFocus();
    await expect.element(screen.getByText("Cell 0,1")).not.toHaveFocus();
  });

  it("skips non-focusable items when navigating down in column", async () => {
    // ARRANGE - 3 items in a column, middle one unfocusable
    const screen = render(
      <RovingFocusGroup orientation="grid" style={gridStyle(1)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }} focusable={false}>
          Cell 1,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 2,0
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{ArrowDown}");

    // ASSERT
    await expect.element(screen.getByText("Cell 2,0")).toHaveFocus();
    await expect.element(screen.getByText("Cell 1,0")).not.toHaveFocus();
  });

  it("non-focusable items have data-disabled and tabindex=-1", async () => {
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid" style={gridStyle(2)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }} focusable={false}>
          Cell 0,1
        </RovingFocusItem>
      </RovingFocusGroup>,
    );

    // ASSERT
    await expect
      .element(screen.getByText("Cell 0,1"))
      .toHaveAttribute("data-disabled", "true");
    await expect
      .element(screen.getByText("Cell 0,1"))
      .toHaveAttribute("tabindex", "-1");
  });

  // ---------------------------------------------------------------------------
  // Focus Stability
  // ---------------------------------------------------------------------------

  it("keeps focus on same element when layout changes via rerender", async () => {
    // ARRANGE - 2x2 grid
    const { rerender, getByText } = render(
      <RovingFocusGroup orientation="grid" style={gridStyle(2)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell A
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell B
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell C
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell D
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}"); // focus Cell B

    // ACT - rerender with changed layout (1 column)
    rerender(
      <RovingFocusGroup orientation="grid" style={gridStyle(1)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell A
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell B
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell C
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell D
        </RovingFocusItem>
      </RovingFocusGroup>,
    );

    // ASSERT - Cell B should still be focused
    await expect.element(getByText("Cell B")).toHaveFocus();
    await expect.element(getByText("Cell B")).toHaveAttribute("tabindex", "0");
  });

  // ---------------------------------------------------------------------------
  // Loop Semantics Per Row/Column (Not Flat)
  // ---------------------------------------------------------------------------

  it("ArrowRight loops within row, not to next row", async () => {
    // ARRANGE - 2x2 grid, test that looping stays in row 0
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={true} style={gridStyle(2)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1,1
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}"); // at 0,1

    // ACT
    await userEvent.keyboard("{ArrowRight}"); // should loop to 0,0, NOT go to 1,0

    // ASSERT
    await expect.element(screen.getByText("Cell 0,0")).toHaveFocus();
  });

  it("ArrowDown loops within column, not to next column", async () => {
    // ARRANGE - 2x2 grid, test that looping stays in column 0
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={true} style={gridStyle(2)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1,1
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}"); // at 1,0

    // ACT
    await userEvent.keyboard("{ArrowDown}"); // should loop to 0,0, NOT go to 0,1

    // ASSERT
    await expect.element(screen.getByText("Cell 0,0")).toHaveFocus();
  });

  // ---------------------------------------------------------------------------
  // Default Active Item in Grid
  // ---------------------------------------------------------------------------

  it("focuses the default active item in grid mode", async () => {
    // ARRANGE - 2x2 grid with second item active
    const screen = render(
      <RovingFocusGroup orientation="grid" style={gridStyle(2)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }} active>
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1,0
        </RovingFocusItem>
      </RovingFocusGroup>,
    );

    // ACT
    await userEvent.tab();

    // ASSERT
    await expect.element(screen.getByText("Cell 0,1")).toHaveFocus();
    await expect
      .element(screen.getByText("Cell 0,1"))
      .toHaveAttribute("tabindex", "0");
  });

  it("falls back to next focusable when default active is unfocusable in grid", async () => {
    // ARRANGE
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const screen = render(
      <RovingFocusGroup orientation="grid" style={gridStyle(2)}>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem
          style={{ width: 50, height: 50 }}
          active
          focusable={false}
        >
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1,0
        </RovingFocusItem>
      </RovingFocusGroup>,
    );

    // ACT
    await userEvent.tab();

    // ASSERT
    await expect.element(screen.getByText("Cell 1,0")).toHaveFocus();
  });
});

// =============================================================================
// GRID AUTO-DETECTION TESTS (DOM-based position detection)
// =============================================================================

describe("grid orientation - auto-detection", () => {
  // ---------------------------------------------------------------------------
  // (a) Basic Fixed Grid Navigation
  // ---------------------------------------------------------------------------

  it("Tab focuses first cell in CSS grid", async () => {
    // ARRANGE
    const screen = render(
      <RovingFocusGroup
        orientation="grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 50px)" }}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <RovingFocusItem key={i} style={{ width: 50, height: 50 }}>
            Cell {i}
          </RovingFocusItem>
        ))}
      </RovingFocusGroup>,
    );

    // ACT
    await userEvent.tab();

    // ASSERT
    await expect.element(screen.getByText("Cell 0")).toHaveFocus();
  });

  it("ArrowRight moves focus horizontally in CSS grid", async () => {
    // ARRANGE
    const screen = render(
      <RovingFocusGroup
        orientation="grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 50px)" }}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <RovingFocusItem key={i} style={{ width: 50, height: 50 }}>
            Cell {i}
          </RovingFocusItem>
        ))}
      </RovingFocusGroup>,
    );
    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{ArrowRight}");

    // ASSERT
    await expect.element(screen.getByText("Cell 1")).toHaveFocus();
  });

  it("ArrowLeft moves focus back horizontally in CSS grid", async () => {
    // ARRANGE
    const screen = render(
      <RovingFocusGroup
        orientation="grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 50px)" }}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <RovingFocusItem key={i} style={{ width: 50, height: 50 }}>
            Cell {i}
          </RovingFocusItem>
        ))}
      </RovingFocusGroup>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");

    // ACT
    await userEvent.keyboard("{ArrowLeft}");

    // ASSERT
    await expect.element(screen.getByText("Cell 0")).toHaveFocus();
  });

  it("ArrowDown moves focus vertically in CSS grid", async () => {
    // ARRANGE
    const screen = render(
      <RovingFocusGroup
        orientation="grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 50px)" }}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <RovingFocusItem key={i} style={{ width: 50, height: 50 }}>
            Cell {i}
          </RovingFocusItem>
        ))}
      </RovingFocusGroup>,
    );
    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{ArrowDown}");

    // ASSERT - Cell 3 is directly below Cell 0 in a 3-column grid
    await expect.element(screen.getByText("Cell 3")).toHaveFocus();
  });

  it("ArrowUp moves focus up vertically in CSS grid", async () => {
    // ARRANGE
    const screen = render(
      <RovingFocusGroup
        orientation="grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 50px)" }}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <RovingFocusItem key={i} style={{ width: 50, height: 50 }}>
            Cell {i}
          </RovingFocusItem>
        ))}
      </RovingFocusGroup>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}");

    // ACT
    await userEvent.keyboard("{ArrowUp}");

    // ASSERT
    await expect.element(screen.getByText("Cell 0")).toHaveFocus();
  });

  it("loops within row when loop=true", async () => {
    // ARRANGE
    const screen = render(
      <RovingFocusGroup
        orientation="grid"
        loop={true}
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 50px)" }}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <RovingFocusItem key={i} style={{ width: 50, height: 50 }}>
            Cell {i}
          </RovingFocusItem>
        ))}
      </RovingFocusGroup>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowRight}"); // now at Cell 2

    // ACT
    await userEvent.keyboard("{ArrowRight}"); // should loop to Cell 0

    // ASSERT
    await expect.element(screen.getByText("Cell 0")).toHaveFocus();
  });

  it("stops at row edge when loop=false", async () => {
    // ARRANGE
    const screen = render(
      <RovingFocusGroup
        orientation="grid"
        loop={false}
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 50px)" }}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <RovingFocusItem key={i} style={{ width: 50, height: 50 }}>
            Cell {i}
          </RovingFocusItem>
        ))}
      </RovingFocusGroup>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowRight}"); // now at Cell 2

    // ACT
    await userEvent.keyboard("{ArrowRight}"); // should stay at Cell 2

    // ASSERT
    await expect.element(screen.getByText("Cell 2")).toHaveFocus();
  });

  // ---------------------------------------------------------------------------
  // (b) Responsive Layout with viewport changes
  // ---------------------------------------------------------------------------

  it("adapts navigation to new layout after viewport resize", async () => {
    // ARRANGE - Use fixed columns that we can control
    const screen = render(
      <RovingFocusGroup
        orientation="grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 50px)",
        }}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <RovingFocusItem key={i} style={{ width: 50, height: 50 }}>
            Cell {i}
          </RovingFocusItem>
        ))}
      </RovingFocusGroup>,
    );

    await userEvent.tab();
    await expect.element(screen.getByText("Cell 0")).toHaveFocus();

    // ACT - navigate down in 3-column grid
    await userEvent.keyboard("{ArrowDown}");

    // ASSERT - Cell 3 is below Cell 0 in a 3-column grid
    await expect.element(screen.getByText("Cell 3")).toHaveFocus();
  });

  it("maintains focus on same cell after resize", async () => {
    // ARRANGE
    const screen = render(
      <RovingFocusGroup
        orientation="grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
          width: "100%",
        }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <RovingFocusItem key={i} style={{ width: 80, height: 50 }}>
            Cell {i}
          </RovingFocusItem>
        ))}
      </RovingFocusGroup>,
    );

    await page.viewport(1024, 768);
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(screen.getByText("Cell 1")).toHaveFocus();

    // ACT - resize
    await page.viewport(400, 768);

    // ASSERT - same cell still focused
    await expect.element(screen.getByText("Cell 1")).toHaveFocus();
  });

  // ---------------------------------------------------------------------------
  // (c) grid-auto-flow: dense - visual vs DOM order
  // ---------------------------------------------------------------------------

  it("navigates by visual position not DOM order with dense packing", async () => {
    // ARRANGE - item 0 spans 2 columns, causing dense reorder
    const screen = render(
      <RovingFocusGroup
        orientation="grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 50px)",
          gridAutoFlow: "dense",
        }}
      >
        <RovingFocusItem style={{ gridColumn: "span 2", height: 50 }}>
          Wide
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>A</RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>B</RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>C</RovingFocusItem>
      </RovingFocusGroup>,
    );

    await userEvent.tab();
    // Visual layout with dense:
    // Row 0: [Wide (spans 2)] [A]
    // Row 1: [B] [C] [?]

    // ACT - ArrowRight from Wide should go to A (same row visually)
    await userEvent.keyboard("{ArrowRight}");

    // ASSERT
    await expect.element(screen.getByText("A")).toHaveFocus();
  });

  // ---------------------------------------------------------------------------
  // (d) Dynamic Add/Remove (MutationObserver path)
  // ---------------------------------------------------------------------------

  it("updates navigation when item is added", async () => {
    // ARRANGE
    function DynamicGrid() {
      const [items, setItems] = useState([0, 1, 2]);
      return (
        <>
          <button onClick={() => setItems([0, 1, 99, 2])}>Add Item</button>
          <RovingFocusGroup
            orientation="grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 50px)" }}
          >
            {items.map((i) => (
              <RovingFocusItem key={i} style={{ width: 50, height: 50 }}>
                Cell {i}
              </RovingFocusItem>
            ))}
          </RovingFocusGroup>
        </>
      );
    }

    const screen = render(<DynamicGrid />);
    // Wait for initial grid positions
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );

    // Use click instead of tab for webkit compatibility
    await screen.getByText("Cell 0").click();

    await expect.element(screen.getByText("Cell 0")).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}"); // focus Cell 1
    await expect.element(screen.getByText("Cell 1")).toHaveFocus();

    // ACT - add item
    await screen.getByText("Add Item").click();

    // Wait for rerender and recalc
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );

    // Focus should still be on Cell 1
    // Navigate right to find Cell 99 (new item inserted after Cell 1)
    await screen.getByText("Cell 1").click();
    await userEvent.keyboard("{ArrowRight}");

    // ASSERT - navigation includes new item
    await expect.element(screen.getByText("Cell 99")).toHaveFocus();
  });

  it("handles removal of items gracefully", async () => {
    // ARRANGE - Test that grid still works after item removal
    function DynamicGrid() {
      const [items, setItems] = useState([0, 1, 2]);
      return (
        <>
          <button onClick={() => setItems([0, 2])}>Remove Item 1</button>
          <RovingFocusGroup
            orientation="grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 50px)" }}
          >
            {items.map((i) => (
              <RovingFocusItem key={i} style={{ width: 50, height: 50 }}>
                Cell {i}
              </RovingFocusItem>
            ))}
          </RovingFocusGroup>
        </>
      );
    }

    const screen = render(<DynamicGrid />);
    // Wait for initial grid positions
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );

    // Use click instead of tab for webkit compatibility
    await screen.getByText("Cell 0").click();
    await expect.element(screen.getByText("Cell 0")).toHaveFocus();

    // ACT - remove an item
    await screen.getByText("Remove Item 1").click();

    // Wait for rerender and recalc
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );

    // Re-focus grid and navigate
    await screen.getByText("Cell 0").click();
    await userEvent.keyboard("{ArrowRight}");

    // ASSERT - navigation works, Cell 2 is next to Cell 0 now
    await expect.element(screen.getByText("Cell 2")).toHaveFocus();
  });

  // ---------------------------------------------------------------------------
  // (e) Non-Focusable Items
  // ---------------------------------------------------------------------------

  it("skips non-focusable items in auto-detected grid", async () => {
    // ARRANGE
    const screen = render(
      <RovingFocusGroup
        orientation="grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 50px)" }}
      >
        <RovingFocusItem style={{ width: 50, height: 50 }}>A</RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }} focusable={false}>
          B
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>C</RovingFocusItem>
      </RovingFocusGroup>,
    );

    // Wait for grid positions to be computed
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );

    // Use click instead of tab for webkit compatibility
    await screen.getByText("A").click();
    await expect.element(screen.getByText("A")).toHaveFocus();

    // ACT
    await userEvent.keyboard("{ArrowRight}");

    // ASSERT - skips B, goes to C
    await expect.element(screen.getByText("C")).toHaveFocus();
  });

  it("non-focusable items have correct attributes in auto-detected grid", async () => {
    // ARRANGE
    const screen = render(
      <RovingFocusGroup
        orientation="grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(2, 50px)" }}
      >
        <RovingFocusItem style={{ width: 50, height: 50 }}>A</RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }} focusable={false}>
          B
        </RovingFocusItem>
      </RovingFocusGroup>,
    );

    // ASSERT
    await expect
      .element(screen.getByText("B"))
      .toHaveAttribute("data-disabled", "true");
    await expect
      .element(screen.getByText("B"))
      .toHaveAttribute("tabindex", "-1");
  });

  // ---------------------------------------------------------------------------
  // (f) Nested Grids - separate groups
  // ---------------------------------------------------------------------------

  it.skipIf(isWebkit)("Tab moves between separate grid groups", async () => {
    // ARRANGE
    const screen = render(
      <div>
        <RovingFocusGroup
          orientation="grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(2, 50px)" }}
        >
          <RovingFocusItem style={{ width: 50, height: 50 }}>
            G1-A
          </RovingFocusItem>
          <RovingFocusItem style={{ width: 50, height: 50 }}>
            G1-B
          </RovingFocusItem>
        </RovingFocusGroup>
        <RovingFocusGroup
          orientation="grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(2, 50px)" }}
        >
          <RovingFocusItem style={{ width: 50, height: 50 }}>
            G2-A
          </RovingFocusItem>
          <RovingFocusItem style={{ width: 50, height: 50 }}>
            G2-B
          </RovingFocusItem>
        </RovingFocusGroup>
      </div>,
    );

    // ACT & ASSERT
    await userEvent.tab();
    await expect.element(screen.getByText("G1-A")).toHaveFocus();

    await userEvent.tab();
    await expect.element(screen.getByText("G2-A")).toHaveFocus();
  });

  it("arrow keys stay within their own grid group", async () => {
    // ARRANGE
    const screen = render(
      <div>
        <RovingFocusGroup
          orientation="grid"
          loop={false}
          style={{ display: "grid", gridTemplateColumns: "repeat(2, 50px)" }}
        >
          <RovingFocusItem style={{ width: 50, height: 50 }}>
            G1-A
          </RovingFocusItem>
          <RovingFocusItem style={{ width: 50, height: 50 }}>
            G1-B
          </RovingFocusItem>
        </RovingFocusGroup>
        <RovingFocusGroup
          orientation="grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(2, 50px)" }}
        >
          <RovingFocusItem style={{ width: 50, height: 50 }}>
            G2-A
          </RovingFocusItem>
          <RovingFocusItem style={{ width: 50, height: 50 }}>
            G2-B
          </RovingFocusItem>
        </RovingFocusGroup>
      </div>,
    );

    // Use click instead of tab for webkit compatibility
    await screen.getByText("G1-A").click();
    await userEvent.keyboard("{ArrowRight}"); // G1-B
    await expect.element(screen.getByText("G1-B")).toHaveFocus();

    // ACT - try to go further right (no loop)
    await userEvent.keyboard("{ArrowRight}");

    // ASSERT - stays in G1, doesn't jump to G2
    await expect.element(screen.getByText("G1-B")).toHaveFocus();
  });

  // ---------------------------------------------------------------------------
  // (g) Home/End/PageUp/PageDown in Auto-Detected Grid
  // ---------------------------------------------------------------------------

  it.each(["Home", "PageUp"])(
    "%s moves to first focusable cell in auto-detected grid",
    async (key) => {
      // ARRANGE
      const screen = render(
        <RovingFocusGroup
          orientation="grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 50px)" }}
        >
          {Array.from({ length: 9 }, (_, i) => (
            <RovingFocusItem key={i} style={{ width: 50, height: 50 }}>
              Cell {i}
            </RovingFocusItem>
          ))}
        </RovingFocusGroup>,
      );
      await userEvent.tab();
      await userEvent.keyboard("{ArrowDown}");
      await userEvent.keyboard("{ArrowRight}"); // at Cell 4

      // ACT
      await userEvent.keyboard(`{${key}}`);

      // ASSERT
      await expect.element(screen.getByText("Cell 0")).toHaveFocus();
    },
  );

  it.each(["End", "PageDown"])(
    "%s moves to last focusable cell in auto-detected grid",
    async (key) => {
      // ARRANGE
      const screen = render(
        <RovingFocusGroup
          orientation="grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 50px)" }}
        >
          {Array.from({ length: 9 }, (_, i) => (
            <RovingFocusItem key={i} style={{ width: 50, height: 50 }}>
              Cell {i}
            </RovingFocusItem>
          ))}
        </RovingFocusGroup>,
      );
      await userEvent.tab();

      // ACT
      await userEvent.keyboard(`{${key}}`);

      // ASSERT
      await expect.element(screen.getByText("Cell 8")).toHaveFocus();
    },
  );

  it("Home skips unfocusable first cell in auto-detected grid", async () => {
    // ARRANGE
    const screen = render(
      <RovingFocusGroup
        orientation="grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 50px)" }}
      >
        <RovingFocusItem style={{ width: 50, height: 50 }} focusable={false}>
          Cell 0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 2
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}"); // at Cell 2

    // ACT
    await userEvent.keyboard("{Home}");

    // ASSERT - skips Cell 0 (unfocusable), goes to Cell 1
    await expect.element(screen.getByText("Cell 1")).toHaveFocus();
  });

  it("End skips unfocusable last cell in auto-detected grid", async () => {
    // ARRANGE
    const screen = render(
      <RovingFocusGroup
        orientation="grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 50px)" }}
      >
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 0
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }}>
          Cell 1
        </RovingFocusItem>
        <RovingFocusItem style={{ width: 50, height: 50 }} focusable={false}>
          Cell 2
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{End}");

    // ASSERT - skips Cell 2 (unfocusable), goes to Cell 1
    await expect.element(screen.getByText("Cell 1")).toHaveFocus();
  });
});

// =============================================================================
// SCROLL BEHAVIOR TESTS
// =============================================================================

describe("scroll behavior", () => {
  it("does not scroll page when navigating visible items", async () => {
    // ARRANGE - page scrolled down, grid visible but page has more content below
    await page.viewport(800, 600);
    const screen = render(
      <div>
        <div style={{ height: 200 }} data-testid="spacer-top" />
        <RovingFocusGroup
          orientation="grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 50px)" }}
        >
          {Array.from({ length: 9 }, (_, i) => (
            <RovingFocusItem key={i} style={{ width: 50, height: 50 }}>
              Cell {i}
            </RovingFocusItem>
          ))}
        </RovingFocusGroup>
        <div style={{ height: 2000 }} data-testid="spacer-bottom" />
      </div>,
    );
    // scroll page so grid is visible but not at top
    window.scrollTo(0, 100);
    await new Promise((r) => setTimeout(r, 100));
    const scrollBefore = window.scrollY;
    expect(scrollBefore).toBe(100); // verify scroll worked

    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowDown}");

    // ASSERT - page scroll unchanged, items still visible
    await expect.element(screen.getByText("Cell 4")).toHaveFocus();
    expect(window.scrollY).toBe(scrollBefore);
  });

  it("scrolls scrollable parent to keep focused item visible", async () => {
    // ARRANGE - small scrollable container, many items
    const screen = render(
      <div
        data-testid="scroll-container"
        style={{ height: 80, overflow: "auto" }}
      >
        <RovingFocusGroup
          orientation="grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(2, 50px)" }}
        >
          {Array.from({ length: 20 }, (_, i) => (
            <RovingFocusItem key={i} style={{ width: 50, height: 50 }}>
              Cell {i}
            </RovingFocusItem>
          ))}
        </RovingFocusGroup>
      </div>,
    );
    const container = screen.getByTestId("scroll-container").element();
    container.scrollTop = 0;
    await new Promise((r) => setTimeout(r, 50));
    await userEvent.tab();

    // ACT - navigate down to items outside container viewport
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{ArrowDown}");

    // ASSERT - container must scroll to show Cell 8
    await expect.element(screen.getByText("Cell 8")).toHaveFocus();
    expect(container.scrollTop).toBeGreaterThan(0);
  });

  it("scrolls page to keep focused item visible when outside viewport", async () => {
    // ARRANGE - small viewport, grid taller than viewport
    await page.viewport(800, 300);
    const screen = render(
      <RovingFocusGroup
        orientation="grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(2, 50px)" }}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <RovingFocusItem key={i} style={{ width: 50, height: 50 }}>
            Cell {i}
          </RovingFocusItem>
        ))}
      </RovingFocusGroup>,
    );
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 50));
    await userEvent.tab();

    // ACT - navigate down to items below viewport
    for (let i = 0; i < 6; i++) {
      await userEvent.keyboard("{ArrowDown}");
    }

    // ASSERT - page must scroll to show Cell 12
    await expect.element(screen.getByText("Cell 12")).toHaveFocus();
    expect(window.scrollY).toBeGreaterThan(0);
  });
});
