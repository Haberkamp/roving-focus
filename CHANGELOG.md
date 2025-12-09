# @roving-focus/react

## 2.0.0

### Breaking Changes

- Removed `GridPosition` export from public API
- Removed `position` prop from `RovingFocusItem`

Grid navigation now auto-detects item positions from the DOM layout using `getBoundingClientRect()`.

**Migration:** Remove all `position={{ row, column }}` props from `RovingFocusItem` components. Ensure your grid container uses CSS Grid (`display: grid`) — the component will derive positions automatically.

### Patch Changes

- Fix Firefox-specific focus/scroll behavior for grid orientation inside scrollable parents so the focused cell, not the container, receives focus while the parent scrolls to reveal it

## 1.1.1

### Patch Changes

- [b636a87](https://github.com/Haberkamp/roving-focus/commit/b636a87): Document grid feature

## 1.1.0

### Minor Changes

- [cfd2c0b](https://github.com/Haberkamp/roving-focus/commit/cfd2c0b): Add grid support

## 1.0.0

### Minor Changes

- [b713a8e](https://github.com/Haberkamp/roving-focus/commit/b713a8e): Export RovingFocusItemProps and RovingFocusGroupProps

- [5429741](https://github.com/Haberkamp/roving-focus/commit/5429741): Allow setting a default active item

- [318a21a](https://github.com/Haberkamp/roving-focus/commit/318a21a): Make items unfocusable

- [cb4a321](https://github.com/Haberkamp/roving-focus/commit/cb4a321): Add the asChild prop to the RovingIndexGroup component

- [703f622](https://github.com/Haberkamp/roving-focus/commit/703f622): Add as prop to group

- [a0833d3](https://github.com/Haberkamp/roving-focus/commit/a0833d3): Add data orientation attribute to roving focus group

- [14d7616](https://github.com/Haberkamp/roving-focus/commit/14d7616): Add vertical direction

- [1ec03fc](https://github.com/Haberkamp/roving-focus/commit/1ec03fc): Add prop to enable or disable looping feature

- [f8f1712](https://github.com/Haberkamp/roving-focus/commit/f8f1712): Focus last item when pressing PageDown key

- [ca7e0f9](https://github.com/Haberkamp/roving-focus/commit/ca7e0f9): Focus last item when pressing the home key

- [0a1486c](https://github.com/Haberkamp/roving-focus/commit/0a1486c): Focus first item when pressing the PageUp key

- [e20ea71](https://github.com/Haberkamp/roving-focus/commit/e20ea71): Render RovingFocusItem as custom child if wanted

- [857ac6f](https://github.com/Haberkamp/roving-focus/commit/857ac6f): Allow rendering RovingIndexItem as custom element using as prop

- [d6573f8](https://github.com/Haberkamp/roving-focus/commit/d6573f8): Focus previous item when pressing the left arrow key

- [ba02ba2](https://github.com/Haberkamp/roving-focus/commit/ba02ba2): Focus next item when pressing the right arrow key

- [bcf60f9](https://github.com/Haberkamp/roving-focus/commit/bcf60f9): Focus first item outside the group when pressing tab

- [1e93ff7](https://github.com/Haberkamp/roving-focus/commit/1e93ff7): Focus last selected item when pressing Shift + Tab

- [0d6f14f](https://github.com/Haberkamp/roving-focus/commit/0d6f14f): Focus the first item

### Patch Changes

- [354ef41](https://github.com/Haberkamp/roving-focus/commit/354ef41): Handle edge-case where default active item is unfocusable

- [3376cf4](https://github.com/Haberkamp/roving-focus/commit/3376cf4): Focus the first focusable element when rendering the component

- [e92da10](https://github.com/Haberkamp/roving-focus/commit/e92da10): Allow user to navigate elements after they clicked on an item

- [5b23eee](https://github.com/Haberkamp/roving-focus/commit/5b23eee): Add data-orientation attribute to every child

- [2d78d18](https://github.com/Haberkamp/roving-focus/commit/2d78d18): Only allow left and right arrow keys in horizontal direction

- [810f460](https://github.com/Haberkamp/roving-focus/commit/810f460): Allow focusing the next item multiple times
