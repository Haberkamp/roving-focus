import { ComponentPropsWithoutRef, useEffect, useId } from "react";
import { useRovingIndex } from "./RovingIndexGroup";

export type RovingIndexItemProps = {} & ComponentPropsWithoutRef<"span">;

export function RovingIndexItem({ onFocus, ...props }: RovingIndexItemProps) {
  const id = useId();
  const { registerItem, unregisterItem, getTabIndex } = useRovingIndex();

  useEffect(() => {
    registerItem(id);

    return () => {
      unregisterItem(id);
    };
  }, [id, registerItem, unregisterItem]);

  const itemIndex = registerItem(id);
  const tabIndex = getTabIndex(itemIndex);

  return <span tabIndex={tabIndex} {...props} />;
}
