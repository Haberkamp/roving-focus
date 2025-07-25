import { ComponentPropsWithoutRef } from "react";

export type RovingIndexItemProps = {} & ComponentPropsWithoutRef<"span">;

export function RovingIndexItem({ ...props }: RovingIndexItemProps) {
  return <span tabIndex={0} {...props} />;
}
