## Grid Orientation Implementation Plan for `@roving-focus/react`

### Overview

We want to add a third orientation mode, `"grid"`, to `RovingFocusGroup`/`RovingFocusItem` so that focus navigation works over a 2D grid instead of a flat 1D list. In grid mode, each item must declare a 2D position, navigation loops within rows/columns (when `loop` is enabled), `Home`/`End` jump to the first/last cell in the whole grid, and non-focusable items are always skipped. The first phase of work will be unit tests using a red–green–refactor workflow.

---

## Phase 1: Tests (Red) for Grid Orientation

### Orientation & API Surface

- [x] **Extend orientation union**:
  - In `RovingFocusGroupProps` and the context type, extend:
    - From: `"horizontal" | "vertical"`
    - To: `"horizontal" | "vertical" | "grid"`.
- [x] **Group data attribute tests**:
  - Add tests that when `orientation="grid"`, the group renders with `data-orientation="grid"`.
  - Add tests that every `RovingFocusItem` child inside a grid group gets `data-orientation="grid"`.
  - Ensure the existing default still behaves the same:
    - No orientation prop → `data-orientation="horizontal"`.

### Position Prop & Error Semantics

- [x] **Grid position type**:
  - Introduce a `GridPosition` type:
    - `type GridPosition = { row: number; column: number }`.
- [x] **Item API**:
  - Extend `RovingFocusItemProps`:
    - Add `position?: GridPosition;`
    - Semantics:
      - When the parent `RovingFocusGroup` has `orientation="grid"`, **every** `RovingFocusItem` under that group must define a `position`.
      - When orientation is `"horizontal"` or `"vertical"`, `position` is optional and ignored for behavior (no error).
- [x] **Error behavior tests**:
  - Test that:
    - Rendering a `RovingFocusGroup` with `orientation="grid"` and at least one `RovingFocusItem` missing `position` throws with a clear, descriptive error (e.g. "RovingFocusItem in grid orientation must define a position: { row, column }").
    - Using `position` while orientation is `"horizontal"` or `"vertical"` does **not** error.

### Grid Navigation Semantics – Arrow Keys

We’ll define tests on small grids (e.g. 2×3, 3×3) with various focusable/unfocusable cells.

- **Right Arrow (`ArrowRight`)**:
  - From a cell `(row, col)` where there is a **next focusable** cell in the same row (`(row, col'>col)`):
    - Move to the nearest focusable `(row, col')`.
  - From the **last focusable cell in that row**:
    - If `loop === true`:
      - Move to the **first focusable** cell in the same row.
    - If `loop === false`:
      - Stay on the same cell.
- **Left Arrow (`ArrowLeft`)**:
  - Mirror of `ArrowRight`:
    - From `(row, col)` with a previous focusable cell in the same row:
      - Move to nearest focusable `(row, col'<col)`.
    - From the **first focusable** cell in a row:
      - If `loop === true`: move to last focusable in row.
      - If `loop === false`: stay.
- **Down Arrow (`ArrowDown`)**:
  - From `(row, col)` where there is a **next focusable** cell in the same column (`(row'>row, col)`):
    - Move to nearest focusable `(row', col)`.
  - From the **last focusable** cell in a column:
    - If `loop === true`:
      - Move to the **first focusable** cell in that column.
    - If `loop === false`:
      - Stay.
- **Up Arrow (`ArrowUp`)**:
  - Mirror of `ArrowDown`:
    - From `(row, col)` with a previous focusable cell in the same column:
      - Move to nearest focusable `(row'<row, col)`.
    - From the **first focusable** cell in a column:
      - If `loop === true`: move to last focusable in column.
      - If `loop === false`: stay.

#### Arrow Key Tests

- [x] Grids with **all focusable** items:
  - Verify row/column navigation and looping per row/column exactly matches rules above.
  - Assertions:
    - Only the newly focused item has `tabindex="0"`.
    - The previously focused item has `tabindex="-1"`.
    - The DOM element with focus matches the text/role of the expected cell.
- [x] Grids with **non-focusable** items (`focusable={false}`):
  - Place unfocusable cells inside rows and columns and assert:
    - Navigation skips them (they are never focused).
    - Home/End behavior (below) still computes first/last **focusable** items.

### Home / End for Entire Grid

- **Home / PageUp**:
  - In grid orientation, pressing `{Home}` (and by parity `{PageUp}`) should:
    - Focus the **first focusable cell in the entire grid**, using row-major order (lowest `row`, then lowest `column`).
- **End / PageDown**:
  - Pressing `{End}` (and `{PageDown}`) should:
    - Focus the **last focusable cell in the entire grid**, via row-major order.

#### Home/End Tests

- Use a grid with some unfocusable cells at beginning/middle/end.
- From various starting cells (top-left, middle, bottom-right):
  - Press `{Home}`:
    - Assert the first focusable cell in the grid is focused and is the only item with `tabindex="0"`.
  - Press `{End}`:
    - Assert the last focusable cell in the grid is focused and is the only item with `tabindex="0"`.

### Looping Semantics – Per Row/Column

Important: in `"grid"` mode, `loop` applies **per row or per column**, not to the flat linear order.

- **Tests**:
  - Create a grid where the last cell in a row is not the last in the flat registration list and vice versa.
  - Assert:
    - `ArrowRight` from the last cell in a row:
      - With `loop={true}`: goes to **first** focusable in that row, not somewhere in another row.
      - With `loop={false}`: stays.
    - `ArrowDown` from the last cell in a column:
      - With `loop={true}`: goes to **first** focusable in that column.
      - With `loop={false}`: stays.

### Position Changes & Focus Stability

Requirement: “If we change the position props (e.g. due to a resize where we adjust the position prop via JS), the current selected item keeps being focused.”

- **Tests**:
  - Render a grid with stable `RovingFocusItem` identities (stable React keys and thus stable `id`s).
  - Focus some internal cell (e.g. middle cell) and assert it has `tabindex="0"`.
  - Re-render with the **same items and ids**, but different `position` values (simulate layout/resize):
    - The **same DOM element** should still be focused.
    - It should still have `tabindex="0"`.
    - Neighbors and navigation should reflect the new grid layout when using arrow keys.

### Non-Focusable Items

- Tests already exist for skipping unfocusable items in 1D.
- For grids, add test cases where rows/columns have gaps:
  - Ensure arrow navigation never lands on an item with `focusable={false}`.
  - Ensure `data-disabled="true"` is still applied and that these items always have `tabindex="-1"`.

### Regression / Compatibility Tests

- All existing horizontal/vertical tests must continue to pass unchanged:
  - Tab behavior.
  - Arrow key navigation for `"horizontal"` and `"vertical"`.
  - `loop={true|false}` semantics in 1D.
  - Default active item logic and warnings.
- Add an orientation test suite that includes `"grid"` but keeps previous expectations for `"horizontal"`/`"vertical"`.

---

## Phase 2: Data Model & Public API for Grid (Design Before Green)

### Orientation Type Changes

- [x] Update types:
  - `RovingFocusContextType["orientation"]` → `"horizontal" | "vertical" | "grid"`.
  - `RovingFocusGroupProps["orientation"]` → same union.
- Documentation:
  - README: add a “Grid navigation” example using explicit `position={{ row, column }}` on each `RovingFocusItem`.

### Grid Position Representation

- [x] Define:
  - `type GridPosition = { row: number; column: number };`
- [x] `RovingFocusItemProps`:
  - Add:
    - `position?: GridPosition;`
  - Semantics:
    - When parent group’s `orientation === "grid"`:
      - `position` is **required** at runtime; missing position is a programmer error and should throw loudly.
    - When orientation is `"horizontal"` or `"vertical"`:
      - `position` is optional and ignored for behavior.

### Context & Registration Shape

- [x] Extend `registeredItems` to hold position information:
  - Current shape:
    - `{ id: string; focusable: boolean }`.
  - New shape:
    - `type RegisteredItem = { id: string; focusable: boolean; position?: GridPosition };`
    - `const registeredItems = useRef<RegisteredItem[]>([]);`
- [x] Evolve `registerItem` signature:
  - From:
    - `(id: string, focusable?: boolean) => number;`
  - To something like:
    - `(id: string, options?: { focusable?: boolean; position?: GridPosition }) => number;`
  - Implementation details:
    - Preserve backward compatibility by treating a boolean second argument as `options.focusable`.
    - Internally:
      - If `id` doesn’t exist yet, push a new `RegisteredItem`.
      - If it exists, **update in place** (mutate `focusable` and `position` but keep array index stable).
    - This in-place update is key for the “position changes do not break current focus” requirement.
- [x] Error enforcement:
  - In `registerItem` (or just before calling it from `RovingFocusItem`), enforce:
    - If `orientation === "grid"` and `position` is `undefined`, `throw` with an explicit error message.

### Grid Navigation Helpers

- [x] Keep existing 1D helper for non-grid orientations:
  - `getNextFocusableIndex(startIndex: number, direction: 1 | -1)` for `"horizontal"`/`"vertical"`.
- [x] Add grid-specific helpers:
  - `getRowPeers(row: number): RegisteredItemWithIndex[]`:
    - All items with `item.position?.row === row`, along with their indices in `registeredItems.current`, sorted by `position.column`.
  - `getColumnPeers(column: number): RegisteredItemWithIndex[]`:
    - All items with `item.position?.column === column`, sorted by `position.row`.
  - `findGridNeighbor(currentIndex, direction)`:
    - For `"right"`/`"left"`:
      - Use row peers of `current.position.row`.
      - Walk forwards/backwards within that array, skipping `!focusable` entries.
      - Apply row-level loop semantics using `loop` prop.
    - For `"down"`/`"up"`:
      - Use column peers of `current.position.column`.
      - Same as above but on rows.
  - `findGridFirstFocusable()`:
    - Scan all registered items with a `position` and `focusable === true` and choose the one with minimum `(row, column)` pair.
  - `findGridLastFocusable()`:
    - Same but maximum `(row, column)`.
- [x] Wire these helpers into existing focus functions:
  - `focusNextItem` / `focusPreviousItem`:
    - For `"horizontal"`/`"vertical"`:
      - Keep using `getNextFocusableIndex` as-is.
    - For `"grid"`:
      - Map `focusNextItem` to “move forward in row” or “move down in column” **only via the item’s event handler logic**:
        - Since `RovingFocusItem` currently maps arrow keys → group functions, we may define more granular group-level helpers (e.g. `focusRight`, `focusLeft`, `focusDown`, `focusUp`) instead of reusing existing next/previous semantics.
  - `focusFirstItem` / `focusLastItem` (Home/End):
    - For `"grid"`:
      - `focusFirstItem` should use `findGridFirstFocusable()`.
      - `focusLastItem` should use `findGridLastFocusable()`.

### Keeping Current Focus Stable on Position Changes

- [x] Preserve `currentIndex` as an index into `registeredItems.current`, keyed by stable `id`.
- [x] Ensure `registerItem` **updates existing entries in place** instead of reordering them:
  - First registration decides the “index” (flat order).
  - Later renders update `focusable` and `position` while keeping indices.
- [x] With stable React keys and `useId` output:
  - The item that was focused stays focused across re-renders, even if its `position.row/column` moves.
  - Navigation after the change uses updated `position` data to find new neighbors.

---

## Phase 3: Implementation (Green) & Refactor

Once tests are in place (failing), we can implement and then clean up:

1. [x] **Update types and context**:
   - Add `"grid"` to orientation unions.
   - Extend `RegisteredItem` with `position`.
   - Update `registerItem` to accept options and mutate entries in place.
2. [x] **Enforce grid position requirement**:
   - In `RovingFocusItem` (or group), ensure that when `orientation === "grid"`, `position` is defined and is `{ row, column }`, otherwise throw.
3. [x] **Implement grid navigation helpers**:
   - Introduce helper functions described above inside `RovingFocusGroup`.
   - Add functions like `focusRight`, `focusLeft`, `focusUp`, `focusDown`, wired to grid-specific neighbor discovery.
4. [x] **Wire key handling in `RovingFocusItem`**:
   - Extend `handleKeyDown`:
     - If `orientation === "grid"`:
       - Map `ArrowRight` → `focusRight`, `ArrowLeft` → `focusLeft`, `ArrowDown` → `focusDown`, `ArrowUp` → `focusUp`.
       - Map `Home`/`PageUp` → grid's `focusFirstItem`, `End`/`PageDown` → grid's `focusLastItem`.
     - Keep current behavior for `"horizontal"`/`"vertical"`.
5. [x] **Run tests and refactor**:
   - Make all new and existing tests pass.
   - Refactor duplicated logic between 1D and grid navigation while keeping readability and behavior.
   - Ensure non-focusable items and default active item semantics are preserved in grid mode.

---

## Notes & Edge Cases

- **Non-focusable items**:
  - Must never receive focus in any orientation.
  - In grid, they are still registered (for layout), but navigation/hit testing always filters to `focusable === true`.
- **Default active item (`active`) in a grid**:
  - Semantics should remain: if `active` is set:
    - Use that as starting focus if focusable.
    - If not focusable, use existing strategy (warn, then find next/previous/first focusable).
  - Grid layout should not change how we pick the default active item, only how we move once we’re in the grid.
- **Multiple items per position**:
  - Out-of-scope for now; we can assume each `(row, column)` pair is unique.
  - If needed, we can later enforce uniqueness or define deterministic tie-breaking.

This document is the reference plan for adding `"grid"` orientation to `@roving-focus/react`, starting with tests (red), then implementing (green), and finally refactoring while maintaining backward-compatible behavior for horizontal and vertical orientations.
