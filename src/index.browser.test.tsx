import { render } from "vitest-browser-react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RovingFocusGroup } from "./RovingFocusGroup";
import { RovingFocusItem } from "./RovingFocusItem";
import { userEvent } from "@vitest/browser/context";

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
  await userEvent.tab();

  // ASSERT
  await expect.element(screen.getByText("Item 1")).toHaveFocus();
});

it("focuses the next item outside the group when pressing tab", async () => {
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
  await userEvent.tab();
  await userEvent.tab();

  // ASSERT
  await expect.element(screen.getByText("Outside")).toHaveFocus();
});

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

  await userEvent.tab();
  await userEvent.tab();

  // ACT
  await userEvent.tab({
    shift: true,
  });

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

  await userEvent.tab();

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
// GRID ORIENTATION TESTS
// =============================================================================

describe("grid orientation", () => {
  // ---------------------------------------------------------------------------
  // Orientation & Data Attributes
  // ---------------------------------------------------------------------------

  it('renders group with data-orientation="grid"', async () => {
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid">
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 1 }}>
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
      <RovingFocusGroup orientation="grid">
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 1 }}>
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
  // Position Prop & Error Semantics
  // ---------------------------------------------------------------------------

  it("throws error when item in grid mode is missing position prop", () => {
    // ARRANGE & ACT & ASSERT
    expect(() => {
      render(
        <RovingFocusGroup orientation="grid">
          <RovingFocusItem>Cell without position</RovingFocusItem>
        </RovingFocusGroup>,
      );
    }).toThrow(
      "RovingFocusItem in grid orientation must define a position: { row, column }",
    );
  });

  it("does not throw when position prop is used in horizontal mode", async () => {
    // ARRANGE & ACT & ASSERT
    expect(() => {
      render(
        <RovingFocusGroup orientation="horizontal">
          <RovingFocusItem position={{ row: 0, column: 0 }}>
            Item 1
          </RovingFocusItem>
        </RovingFocusGroup>,
      );
    }).not.toThrow();
  });

  it("does not throw when position prop is used in vertical mode", async () => {
    // ARRANGE & ACT & ASSERT
    expect(() => {
      render(
        <RovingFocusGroup orientation="vertical">
          <RovingFocusItem position={{ row: 0, column: 0 }}>
            Item 1
          </RovingFocusItem>
        </RovingFocusGroup>,
      );
    }).not.toThrow();
  });

  // ---------------------------------------------------------------------------
  // Arrow Key Navigation - Row (ArrowRight / ArrowLeft)
  // ---------------------------------------------------------------------------

  it("focuses next cell in row when pressing ArrowRight", async () => {
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid">
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 1 }}>
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 2 }}>
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
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid">
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 1 }}>
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
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={true}>
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 1 }}>
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
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={false}>
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 1 }}>
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
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={true}>
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 1 }}>
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
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={false}>
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 1 }}>
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
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid">
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 0 }}>
          Cell 1,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 2, column: 0 }}>
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
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid">
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 0 }}>
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
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={true}>
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 0 }}>
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
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={false}>
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 0 }}>
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
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={true}>
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 0 }}>
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
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={false}>
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 0 }}>
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
      <RovingFocusGroup orientation="grid" loop={false}>
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 1 }}>
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 0 }}>
          Cell 1,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 1 }}>
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
      <RovingFocusGroup orientation="grid" loop={false}>
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 1 }}>
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 0 }}>
          Cell 1,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 1 }}>
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
      <RovingFocusGroup orientation="grid">
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 1 }}>
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 0 }}>
          Cell 1,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 1 }}>
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
      // ARRANGE
      const screen = render(
        <RovingFocusGroup orientation="grid">
          <RovingFocusItem position={{ row: 0, column: 0 }}>
            Cell 0,0
          </RovingFocusItem>
          <RovingFocusItem position={{ row: 0, column: 1 }}>
            Cell 0,1
          </RovingFocusItem>
          <RovingFocusItem position={{ row: 1, column: 0 }}>
            Cell 1,0
          </RovingFocusItem>
          <RovingFocusItem position={{ row: 1, column: 1 }}>
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
      // ARRANGE
      const screen = render(
        <RovingFocusGroup orientation="grid">
          <RovingFocusItem position={{ row: 0, column: 0 }}>
            Cell 0,0
          </RovingFocusItem>
          <RovingFocusItem position={{ row: 0, column: 1 }}>
            Cell 0,1
          </RovingFocusItem>
          <RovingFocusItem position={{ row: 1, column: 0 }}>
            Cell 1,0
          </RovingFocusItem>
          <RovingFocusItem position={{ row: 1, column: 1 }}>
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
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid">
        <RovingFocusItem position={{ row: 0, column: 0 }} focusable={false}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 1 }}>
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 0 }}>
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
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid">
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 1 }}>
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 0 }}>
          Cell 1,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 1 }} focusable={false}>
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
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid">
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 1 }} focusable={false}>
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 2 }}>
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
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid">
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 0 }} focusable={false}>
          Cell 1,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 2, column: 0 }}>
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
      <RovingFocusGroup orientation="grid">
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 1 }} focusable={false}>
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
  // Position Changes & Focus Stability
  // ---------------------------------------------------------------------------

  it("keeps focus on same element when position props change", async () => {
    // ARRANGE
    const { rerender, getByText } = render(
      <RovingFocusGroup orientation="grid">
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell A
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 1 }}>
          Cell B
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 0 }}>
          Cell C
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 1 }}>
          Cell D
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}"); // focus Cell B

    // ACT - rerender with changed positions (simulating resize)
    rerender(
      <RovingFocusGroup orientation="grid">
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell A
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 0 }}>
          Cell B
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 2, column: 0 }}>
          Cell C
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 3, column: 0 }}>
          Cell D
        </RovingFocusItem>
      </RovingFocusGroup>,
    );

    // ASSERT - Cell B should still be focused
    await expect.element(getByText("Cell B")).toHaveFocus();
    await expect.element(getByText("Cell B")).toHaveAttribute("tabindex", "0");
  });

  it("uses new positions for navigation after position change", async () => {
    // ARRANGE
    const { rerender, getByText } = render(
      <RovingFocusGroup orientation="grid">
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell A
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 1 }}>
          Cell B
        </RovingFocusItem>
      </RovingFocusGroup>,
    );
    await userEvent.tab(); // focus Cell A

    // ACT - rerender with B now below A instead of to the right
    rerender(
      <RovingFocusGroup orientation="grid">
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell A
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 0 }}>
          Cell B
        </RovingFocusItem>
      </RovingFocusGroup>,
    );

    // ArrowRight should not move to B anymore (different column now)
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(getByText("Cell A")).toHaveFocus();

    // ArrowDown should move to B (same column now)
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(getByText("Cell B")).toHaveFocus();
  });

  // ---------------------------------------------------------------------------
  // Loop Semantics Per Row/Column (Not Flat)
  // ---------------------------------------------------------------------------

  it("ArrowRight loops within row, not to next row", async () => {
    // ARRANGE - 2x2 grid, test that looping stays in row 0
    const screen = render(
      <RovingFocusGroup orientation="grid" loop={true}>
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 1 }}>
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 0 }}>
          Cell 1,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 1 }}>
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
      <RovingFocusGroup orientation="grid" loop={true}>
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 1 }}>
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 0 }}>
          Cell 1,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 1 }}>
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
    // ARRANGE
    const screen = render(
      <RovingFocusGroup orientation="grid">
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 0, column: 1 }} active>
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 0 }}>
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
      <RovingFocusGroup orientation="grid">
        <RovingFocusItem position={{ row: 0, column: 0 }}>
          Cell 0,0
        </RovingFocusItem>
        <RovingFocusItem
          position={{ row: 0, column: 1 }}
          active
          focusable={false}
        >
          Cell 0,1
        </RovingFocusItem>
        <RovingFocusItem position={{ row: 1, column: 0 }}>
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
