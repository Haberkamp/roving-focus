import { render } from "vitest-browser-react";
import { expect, it } from "vitest";
import { RovingIndexGroup } from "./RovingIndexGroup";
import { RovingIndexItem } from "./RovingIndexItem";
import { userEvent } from "@testing-library/user-event";

it("focuses the first item when pressing tab", async () => {
  // ARRANGE
  const screen = await render(
    <RovingIndexGroup>
      <RovingIndexItem>Item 1</RovingIndexItem>
      <RovingIndexItem>Item 2</RovingIndexItem>
      <RovingIndexItem>Item 3</RovingIndexItem>
    </RovingIndexGroup>,
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
      <RovingIndexGroup>
        <RovingIndexItem>Item 1</RovingIndexItem>
        <RovingIndexItem>Item 2</RovingIndexItem>
        <RovingIndexItem>Item 3</RovingIndexItem>
      </RovingIndexGroup>

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
      <RovingIndexGroup>
        <RovingIndexItem>Item 1</RovingIndexItem>
        <RovingIndexItem>Item 2</RovingIndexItem>
        <RovingIndexItem>Item 3</RovingIndexItem>
      </RovingIndexGroup>
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
    <RovingIndexGroup>
      <RovingIndexItem>Item 1</RovingIndexItem>
      <RovingIndexItem>Item 2</RovingIndexItem>
      <RovingIndexItem>Item 3</RovingIndexItem>
    </RovingIndexGroup>,
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
    <RovingIndexGroup>
      <RovingIndexItem>Item 1</RovingIndexItem>
      <RovingIndexItem>Item 2</RovingIndexItem>
      <RovingIndexItem>Item 3</RovingIndexItem>
    </RovingIndexGroup>,
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
    <RovingIndexGroup>
      <RovingIndexItem>Item 1</RovingIndexItem>
      <RovingIndexItem>Item 2</RovingIndexItem>
    </RovingIndexGroup>,
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
    <RovingIndexGroup>
      <RovingIndexItem>Item 1</RovingIndexItem>
      <RovingIndexItem>Item 2</RovingIndexItem>
      <RovingIndexItem>Item 3</RovingIndexItem>
    </RovingIndexGroup>,
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
    <RovingIndexGroup>
      <RovingIndexItem>Item 1</RovingIndexItem>
      <RovingIndexItem>Item 2</RovingIndexItem>
    </RovingIndexGroup>,
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
      <RovingIndexGroup>
        <RovingIndexItem>Item 1</RovingIndexItem>
        <RovingIndexItem>Item 2</RovingIndexItem>
      </RovingIndexGroup>

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
    <RovingIndexGroup loop={false}>
      <RovingIndexItem>Item 1</RovingIndexItem>
      <RovingIndexItem>Item 2</RovingIndexItem>
    </RovingIndexGroup>,
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
    <RovingIndexGroup loop={false}>
      <RovingIndexItem>Item 1</RovingIndexItem>
      <RovingIndexItem>Item 2</RovingIndexItem>
    </RovingIndexGroup>,
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
      <RovingIndexGroup>
        <RovingIndexItem>Item 1</RovingIndexItem>
        <RovingIndexItem>Item 2</RovingIndexItem>
        <RovingIndexItem>Item 3</RovingIndexItem>
      </RovingIndexGroup>,
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
      <RovingIndexGroup>
        <RovingIndexItem>Item 1</RovingIndexItem>
        <RovingIndexItem>Item 2</RovingIndexItem>
        <RovingIndexItem>Item 3</RovingIndexItem>
      </RovingIndexGroup>,
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
    <RovingIndexGroup>
      <RovingIndexItem>Item 1</RovingIndexItem>

      <RovingIndexItem asChild>
        <button>Item 2</button>
      </RovingIndexItem>
    </RovingIndexGroup>,
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
    <RovingIndexGroup>
      <RovingIndexItem>Item 1</RovingIndexItem>

      <RovingIndexItem as="button">Item 2</RovingIndexItem>
    </RovingIndexGroup>,
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
    <RovingIndexGroup>
      <RovingIndexItem asChild as="button">
        <a href="https://www.google.com">Item 1</a>
      </RovingIndexItem>
    </RovingIndexGroup>,
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
    <RovingIndexGroup
      orientation="vertical"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <RovingIndexItem>Item 1</RovingIndexItem>
      <RovingIndexItem>Item 2</RovingIndexItem>
      <RovingIndexItem>Item 3</RovingIndexItem>
    </RovingIndexGroup>,
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
    <RovingIndexGroup
      orientation="vertical"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <RovingIndexItem>Item 1</RovingIndexItem>
      <RovingIndexItem>Item 2</RovingIndexItem>
      <RovingIndexItem>Item 3</RovingIndexItem>
    </RovingIndexGroup>,
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
    <RovingIndexGroup
      orientation="vertical"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <RovingIndexItem>Item 1</RovingIndexItem>
      <RovingIndexItem>Item 2</RovingIndexItem>
    </RovingIndexGroup>,
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
    <RovingIndexGroup
      orientation="vertical"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <RovingIndexItem>Item 1</RovingIndexItem>
      <RovingIndexItem>Item 2</RovingIndexItem>
    </RovingIndexGroup>,
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
    <RovingIndexGroup
      orientation="vertical"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <RovingIndexItem>Item 1</RovingIndexItem>
      <RovingIndexItem>Item 2</RovingIndexItem>
      <RovingIndexItem>Item 3</RovingIndexItem>
    </RovingIndexGroup>,
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
    <RovingIndexGroup
      orientation="vertical"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <RovingIndexItem>Item 1</RovingIndexItem>
      <RovingIndexItem>Item 2</RovingIndexItem>
      <RovingIndexItem>Item 3</RovingIndexItem>
    </RovingIndexGroup>,
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
      <RovingIndexGroup
        orientation={orientation}
        style={{ display: "flex", flexDirection: "row" }}
      >
        <RovingIndexItem>Item 1</RovingIndexItem>
        <RovingIndexItem>Item 2</RovingIndexItem>
      </RovingIndexGroup>,
    );

    // ASSERT
    await expect(screen.getByTestId("roving-index-group")).toHaveAttribute(
      "data-orientation",
      orientation,
    );
  },
);

it('adds a data-orientation="horizontal" attribute to the group when no orientation is provided', async () => {
  // ARRANGE
  const screen = await render(
    <RovingIndexGroup>
      <RovingIndexItem>Item 1</RovingIndexItem>
      <RovingIndexItem>Item 2</RovingIndexItem>
    </RovingIndexGroup>,
  );

  // ASSERT
  await expect(screen.getByTestId("roving-index-group")).toHaveAttribute(
    "data-orientation",
    "horizontal",
  );
});

it.each([["horizontal", "vertical"] as const])(
  'adds data-orientation="%s" to every single child',
  async (orientation) => {
    // ARRANGE
    const screen = await render(
      <RovingIndexGroup orientation={orientation}>
        <RovingIndexItem>Item 1</RovingIndexItem>
        <RovingIndexItem>Item 2</RovingIndexItem>
      </RovingIndexGroup>,
    );

    // ASSERT
    await expect(screen.getByText("Item 1")).toHaveAttribute(
      "data-orientation",
      orientation,
    );

    await expect(screen.getByText("Item 2")).toHaveAttribute(
      "data-orientation",
      orientation,
    );
  },
);

it("renders the group as a div by default", async () => {
  // ARRANGE
  const screen = await render(
    <RovingIndexGroup>
      <RovingIndexItem>Item 1</RovingIndexItem>
      <RovingIndexItem>Item 2</RovingIndexItem>
    </RovingIndexGroup>,
  );

  // ASSERT
  await expect
    .element(screen.getByTestId("roving-index-group"))
    .toBeInstanceOf(HTMLDivElement);
});

it("renders the group as a span when using the as prop", async () => {
  // ARRANGE
  const screen = await render(
    <RovingIndexGroup as="span">
      <RovingIndexItem>Item 1</RovingIndexItem>
      <RovingIndexItem>Item 2</RovingIndexItem>
    </RovingIndexGroup>,
  );

  // ASSERT
  await expect
    .element(screen.getByTestId("roving-index-group"))
    .toBeInstanceOf(HTMLSpanElement);
});

it("renders the group as a span when using the asChild prop", async () => {
  // ARRANGE
  const screen = await render(
    <RovingIndexGroup asChild>
      <span>
        <RovingIndexItem>Item 1</RovingIndexItem>
        <RovingIndexItem>Item 2</RovingIndexItem>
      </span>
    </RovingIndexGroup>,
  );

  // ASSERT
  await expect
    .element(screen.getByTestId("roving-index-group"))
    .toBeInstanceOf(HTMLSpanElement);
});

it("prefers the asChild prop over the as prop for the group component", async () => {
  // ARRANGE
  const screen = await render(
    <RovingIndexGroup as="span" asChild>
      <div>
        <RovingIndexItem>Item 1</RovingIndexItem>
        <RovingIndexItem>Item 2</RovingIndexItem>
      </div>
    </RovingIndexGroup>,
  );

  // ASSERT
  await expect
    .element(screen.getByTestId("roving-index-group"))
    .toBeInstanceOf(HTMLDivElement);
});

it("skips the unfocusable items until it reaches the next focusable item", async () => {
  // ARRANGE
  const screen = await render(
    <RovingIndexGroup>
      <RovingIndexItem>Item 1</RovingIndexItem>
      <RovingIndexItem focusable={false}>Item 2</RovingIndexItem>
      <RovingIndexItem>Item 3</RovingIndexItem>
    </RovingIndexGroup>,
  );

  await userEvent.tab();

  // ACT
  await userEvent.keyboard("{ArrowRight}");

  // ASSERT
  await expect(screen.getByText("Item 3")).toHaveFocus();

  await expect(screen.getByText("Item 2")).not.toHaveFocus();
  await expect(screen.getByText("Item 1")).not.toHaveFocus();
});

it('adds a data-disabled="true" attribute the unfocusable items', async () => {
  // ARRANGE
  const screen = await render(
    <RovingIndexGroup>
      <RovingIndexItem focusable={false}>Item 1</RovingIndexItem>
    </RovingIndexGroup>,
  );

  // ASSERT
  await expect(screen.getByText("Item 1")).toHaveAttribute(
    "data-disabled",
    "true",
  );
});

it("does not add a data-disabled attribute to focusable items", async () => {
  // ARRANGE
  const screen = await render(
    <RovingIndexGroup>
      <RovingIndexItem focusable={true}>Item 1</RovingIndexItem>
    </RovingIndexGroup>,
  );

  // ASSERT
  await expect(screen.getByText("Item 1")).not.toHaveAttribute("data-disabled");
});

it("focuses the last focusable item when pressing the End key", async () => {
  // ARRANGE
  const screen = await render(
    <RovingIndexGroup>
      <RovingIndexItem>Item 1</RovingIndexItem>
      <RovingIndexItem>Item 2</RovingIndexItem>
      <RovingIndexItem focusable={false}>Item 3</RovingIndexItem>
    </RovingIndexGroup>,
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
    <RovingIndexGroup>
      <RovingIndexItem focusable={false}>Item 1</RovingIndexItem>
      <RovingIndexItem>Item 2</RovingIndexItem>
      <RovingIndexItem>Item 3</RovingIndexItem>
    </RovingIndexGroup>,
  );

  await userEvent.tab();

  // ACT
  await userEvent.keyboard("{Home}");

  // ASSERT
  await expect.element(screen.getByText("Item 2")).toHaveFocus();

  await expect.element(screen.getByText("Item 1")).not.toHaveFocus();
  await expect.element(screen.getByText("Item 3")).not.toHaveFocus();
});
