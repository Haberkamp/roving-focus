import {
  ComponentPropsWithoutRef,
  useEffect,
  useId,
  KeyboardEvent,
  useRef,
} from "react";
import { useRovingIndex } from "./RovingIndexGroup";

export type RovingIndexItemProps = {} & ComponentPropsWithoutRef<"span">;

export function RovingIndexItem({ onFocus, ...props }: RovingIndexItemProps) {
  const id = useId();
  const { registerItem, unregisterItem, getTabIndex, focusNextItem } =
    useRovingIndex();

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
    if (event.key === "ArrowRight") {
      focusNextItem();
    }
  };

  return (
    <span
      ref={ref}
      data-roving-index-item={id}
      tabIndex={tabIndex}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}
