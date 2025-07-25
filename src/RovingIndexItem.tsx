import { ComponentPropsWithoutRef, useEffect, useId, FocusEvent } from "react";
import { useRovingIndex } from "./RovingIndexGroup";

export type RovingIndexItemProps = {} & ComponentPropsWithoutRef<"span">;

export function RovingIndexItem({ onFocus, ...props }: RovingIndexItemProps) {
  const id = useId();
  const { registerItem, unregisterItem, getTabIndex, setCurrentIndex } =
    useRovingIndex();

  useEffect(() => {
    const itemIndex = registerItem(id);
    return () => {
      unregisterItem(id);
    };
  }, [id, registerItem, unregisterItem]);

  const itemIndex = registerItem(id);
  const tabIndex = getTabIndex(itemIndex);

  const handleFocus = (event: FocusEvent<HTMLSpanElement>) => {
    setCurrentIndex(itemIndex);
    onFocus?.(event);
  };

  return <span tabIndex={tabIndex} onFocus={handleFocus} {...props} />;
}
