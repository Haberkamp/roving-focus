import {
  ComponentPropsWithoutRef,
  useEffect,
  useId,
  KeyboardEvent,
  useRef,
  MouseEvent,
} from "react";
import { useRovingIndex } from "./RovingIndexGroup";
import { Slot } from "@radix-ui/react-slot";

export type RovingIndexItemProps = {
  asChild?: boolean;
  as?: React.ElementType;
  focusable?: boolean;
  active?: boolean;
} & ComponentPropsWithoutRef<"span">;

export function RovingIndexItem({
  onFocus,
  onClick,
  asChild = false,
  as = "span",
  focusable = true,
  active = false,
  ...props
}: RovingIndexItemProps) {
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
    orientation,
    setDefaultActiveItem,
  } = useRovingIndex();

  useEffect(() => {
    const itemIndex = registerItem(id, focusable);

    if (active) {
      setDefaultActiveItem(itemIndex);
    }

    return () => {
      unregisterItem(id);
    };
  }, [
    id,
    focusable,
    active,
    registerItem,
    unregisterItem,
    setDefaultActiveItem,
  ]);

  const itemIndex = registerItem(id, focusable);
  const tabIndex = getTabIndex(itemIndex);

  const ref = useRef<HTMLSpanElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (orientation === "horizontal") {
      if (event.key === "ArrowRight") {
        focusNextItem();
      }

      if (event.key === "ArrowLeft") {
        focusPreviousItem();
      }
    } else {
      if (event.key === "ArrowDown") {
        focusNextItem();
      }

      if (event.key === "ArrowUp") {
        focusPreviousItem();
      }
    }

    if (["PageDown", "End"].includes(event.key)) {
      focusLastItem();
    }

    if (["PageUp", "Home"].includes(event.key)) {
      focusFirstItem();
    }
  };

  const handleClick = (event: MouseEvent<HTMLSpanElement>) => {
    if (focusable) setCurrentIndex(itemIndex);

    onClick?.(event);
  };

  const Component = asChild ? Slot : as;

  return (
    <Component
      ref={ref}
      data-roving-index-item={id}
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
