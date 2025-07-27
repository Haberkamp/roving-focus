# @roving-focus/react

<!-- ![CI passing](https://github.com/Haberkamp/roving-focus/actions/workflows/ci.yml/badge.svg?event=push&branch=main) -->

![Created by](https://img.shields.io/badge/created%20by-@n__haberkamp-065afa.svg)
![NPM License](https://img.shields.io/npm/l/%40roving-focus%2Freact)

## Highlights

- Easy to use API
- Vertical and horizontal navigation
- Radix-UI like `asChild` prop
- 100% TypeScript

## Overview

A roving focus improves the accessbility of your application. It allows users to navigate between items using Arrow keys.

Let's say you have a list of 10 items and then a button. Without a roving focus, the user needs to press the Tab key 10 times to focus the button.

With a roving focus, the user only needs press the Tab key twice. On the first press they focus the first item, on the second press they focus the button. Now, if the user want to focus the third item in the list, they first need to focus the first item and then can press the right arrow key twice.

### Author

Hey, I'm Nils. In my spare time [I write about things I learned](https://www.haberkamp.dev/) or I [create open source packages](https://github.com/Haberkamp), that help me (and hopefully you) to build better apps.

## Installation

You can install this package with any package manager you like.

```bash
pnpm add @roving-focus/react
```

## Usage

You need two components:

- `RovingIndexGroup`
- `RovingIndexItem`

```tsx
<RovingIndexGroup>
  <RovingIndexItem>Item 1</RovingIndexItem>
  <RovingIndexItem>Item 2</RovingIndexItem>
  <RovingIndexItem>Item 3</RovingIndexItem>
</RovingIndexGroup>
```

### Examples

#### Vertical navigation

```tsx
<RovingIndexGroup orientation="vertical">
  <RovingIndexItem>Item 1</RovingIndexItem>
  <RovingIndexItem>Item 2</RovingIndexItem>
  <RovingIndexItem>Item 3</RovingIndexItem>
</RovingIndexGroup>
```

Press `ArrowUp` or `ArrowDown` to navigate between items.

#### Horizontal navigation

```tsx
<RovingIndexGroup orientation="horizontal">
  <RovingIndexItem>Item 1</RovingIndexItem>
  <RovingIndexItem>Item 2</RovingIndexItem>
  <RovingIndexItem>Item 3</RovingIndexItem>
</RovingIndexGroup>
```

Press `ArrowLeft` or `ArrowRight` to navigate between items.

#### Disabled items

To make any item unfocusable, set the `focusable` prop to `false`.

```tsx
<RovingIndexGroup>
  <RovingIndexItem focusable={false}>Item 1</RovingIndexItem>
  <RovingIndexItem>Item 2</RovingIndexItem>
  <RovingIndexItem>Item 3</RovingIndexItem>
</RovingIndexGroup>
```

Now you can only focus item 2 and 3.

#### Default active item

By default the first item is focused. To change this, set the `active` prop to `true` on the item you want to be focused by default.

```tsx
<RovingIndexGroup>
  <RovingIndexItem>Item 1</RovingIndexItem>
  <RovingIndexItem active>Item 2</RovingIndexItem>
</RovingIndexGroup>
```

#### Looping

When looping is enabled and the user focuses the last item, if they then focus the next item, they will actually focus the first item. The same is true for the first item, it then focuses the last item.

By default looping is enabled. To disable it, set the `loop` prop to `false`.

```tsx
<RovingIndexGroup loop={false}>
  <RovingIndexItem>Item 1</RovingIndexItem>
  <RovingIndexItem>Item 2</RovingIndexItem>
  <RovingIndexItem>Item 3</RovingIndexItem>
</RovingIndexGroup>
```

### Anatomy

#### RovingIndexGroup

Props:

- `orientation`: `"vertical" | "horizontal"` - The orientation of the group.
- `loop`: `boolean` - Whether the group should loop when the end or start of the group is reached.
- `asChild`: `boolean` - Uses the child element as the root element.
- `as`: `React.ElementType` - Allows you to pass a custom element as the root element.

Data attributes:

- `data-orientation`: `"vertical" | "horizontal"` - The orientation of the group.

#### RovingIndexItem

Props:

- `focusable`: `boolean`
- `active`: `boolean`
- `asChild`: `boolean` - Uses the child element as the root element.
- `as`: `React.ElementType` - Allows you to pass a custom element as the root element.

Data attributes:

- `data-active`: `"true"` - The item is the active item.
- `data-disabled`: `"true"` - The item is unfocusable.

## Feedback and Contributing

I highly appreceate your feedback! Please create an [issue](https://github.com/Haberkamp/typed-storage/issues/new), if you've found any bugs or want to request a feature.
