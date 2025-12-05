import {
  ComponentPropsWithoutRef,
  useEffect,
  useId,
  KeyboardEvent,
  useRef,
  MouseEvent,
} from "react";
import { useRovingFocus, GridPosition } from "./RovingFocusGroup";
import { Slot } from "@radix-ui/react-slot";

export type RovingFocusItemProps = {
  asChild?: boolean;
  as?: React.ElementType;
  focusable?: boolean;
  active?: boolean;
  position?: GridPosition;
} & ComponentPropsWithoutRef<"span">;

export function RovingFocusItem({
  onFocus,
  onClick,
  asChild = false,
  as = "span",
  focusable = true,
  active = false,
  position,
  ...props
}: RovingFocusItemProps) {
  const id = useId();
  const {
    registerItem,
    unregisterItem,
    getTabIndex,
    setCurrentIndex,
    focusNextItem,
    focusPreviousItem,
    focusLastItem,
    focusFirstItem,
    focusRight,
    focusLeft,
    focusDown,
    focusUp,
    orientation,
    setDefaultActiveItem,
  } = useRovingFocus();

  // Validate grid position requirement
  if (orientation === "grid" && !position) {
    throw new Error(
      "RovingFocusItem in grid orientation must define a position: { row, column }",
    );
  }

  useEffect(() => {
    const itemIndex = registerItem(id, { focusable, position });

    if (active) {
      setDefaultActiveItem(itemIndex);
    }

    return () => {
      unregisterItem(id);
    };
  }, [id, focusable, active, position?.row, position?.column]);

  const tabIndex = getTabIndex(registerItem(id, { focusable, position }));

  const ref = useRef<HTMLSpanElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (orientation === "grid") {
      if (event.key === "ArrowRight") focusRight();
      if (event.key === "ArrowLeft") focusLeft();
      if (event.key === "ArrowDown") focusDown();
      if (event.key === "ArrowUp") focusUp();
    } else if (orientation === "horizontal") {
      if (event.key === "ArrowRight") focusNextItem();
      if (event.key === "ArrowLeft") focusPreviousItem();
    } else {
      if (event.key === "ArrowDown") focusNextItem();
      if (event.key === "ArrowUp") focusPreviousItem();
    }

    if (["PageDown", "End"].includes(event.key)) {
      focusLastItem();
    }

    if (["PageUp", "Home"].includes(event.key)) {
      focusFirstItem();
    }
  };

  const handleClick = (event: MouseEvent<HTMLSpanElement>) => {
    if (focusable) setCurrentIndex(registerItem(id, { focusable, position }));

    onClick?.(event);
  };

  const Component = asChild ? Slot : as;

  return (
    <Component
      ref={ref}
      data-roving-focus-item={id}
      data-orientation={orientation}
      data-disabled={focusable ? undefined : "true"}
      data-active={active ? "true" : undefined}
      tabIndex={tabIndex}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      {...props}
    />
  );
}
