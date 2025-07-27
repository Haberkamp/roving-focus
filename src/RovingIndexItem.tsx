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
} & ComponentPropsWithoutRef<"span">;

export function RovingIndexItem({
  onFocus,
  onClick,
  asChild = false,
  as = "span",
  focusable = true,
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
  } = useRovingIndex();

  useEffect(() => {
    registerItem(id, focusable);

    return () => {
      unregisterItem(id);
    };
  }, [id, focusable, registerItem, unregisterItem]);

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

    if (event.key === "PageDown" || event.key === "End") {
      focusLastItem();
    }

    if (event.key === "PageUp" || event.key === "Home") {
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
      tabIndex={tabIndex}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      {...props}
    />
  );
}
