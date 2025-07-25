import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { it, expect } from "vitest";
import { RovingIndexGroup } from "./RovingIndexGroup";
import { RovingIndexItem } from "./RovingIndexItem";

it("focuses the first item when pressing tab", async () => {
  // ARRANGE
  render(
    <RovingIndexGroup>
      <RovingIndexItem>Item 1</RovingIndexItem>
      <RovingIndexItem>Item 2</RovingIndexItem>
      <RovingIndexItem>Item 3</RovingIndexItem>
    </RovingIndexGroup>,
  );

  // ACT
  await userEvent.tab();

  // ASSERT
  expect(screen.getByText("Item 1")).toHaveFocus();
});

it("focuses the next item outside the group when pressing tab", async () => {
  // ARRANGE
  render(
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
  expect(screen.getByText("Outside")).toHaveFocus();
});

it("re-focuses the first item when pressing Shift + Tab", async () => {
  // ARRANGE
  render(
    <div>
      <RovingIndexGroup>
        <RovingIndexItem>Item 1</RovingIndexItem>
        <RovingIndexItem>Item 2</RovingIndexItem>
        <RovingIndexItem>Item 3</RovingIndexItem>
      </RovingIndexGroup>
      ,<button>Outside</button>
    </div>,
  );

  await userEvent.tab();
  await userEvent.tab();

  // ACT
  await userEvent.tab({
    shift: true,
  });

  // ASSERT
  expect(screen.getByText("Item 1")).toHaveFocus();
});
