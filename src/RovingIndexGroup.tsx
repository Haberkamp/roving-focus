import { ComponentPropsWithoutRef } from "react";

export type RovingIndexGroupProps = {} & ComponentPropsWithoutRef<"div">;

export function RovingIndexGroup({ ...props }: RovingIndexGroupProps) {
  return <div {...props} />;
}
