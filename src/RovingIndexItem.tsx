import {
  ComponentPropsWithoutRef,
  useEffect,
  useId,
  KeyboardEvent,
  useRef,
} from "react";
import { useRovingIndex } from "./RovingIndexGroup";
import { Slot } from "@radix-ui/react-slot";

export type RovingIndexItemProps = {
  asChild?: boolean;
  as?: React.ElementType;
} & ComponentPropsWithoutRef<"span">;

export function RovingIndexItem({
  onFocus,
  asChild = false,
  as = "span",
  ...props
}: RovingIndexItemProps) {
  const id = useId();
  const {
    registerItem,
    unregisterItem,
    getTabIndex,
    focusNextItem,
    focusPreviousItem,
    focusLastItem,
    focusFirstItem,
    orientation,
  } = useRovingIndex();

  useEffect(() => {
    registerItem(id);

    return () => {
      unregisterItem(id);
    };
  }, [id, registerItem, unregisterItem]);

  const itemIndex = registerItem(id);
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

  const Component = asChild ? Slot : as;

  return (
    <Component
      ref={ref}
      data-roving-index-item={id}
      data-orientation={orientation}
      tabIndex={tabIndex}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}
