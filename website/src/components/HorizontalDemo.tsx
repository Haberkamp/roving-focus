import { RovingFocusGroup, RovingFocusItem } from "@roving-focus/react";

const items = [
  { title: "w-3/4", subtitle: "w-1/2" },
  { title: "w-2/3", subtitle: "w-3/4" },
  { title: "w-4/5", subtitle: "w-1/2" },
  { title: "w-1/2", subtitle: "w-2/3" },
];

export function HorizontalDemo() {
  return (
    <RovingFocusGroup
      as="ul"
      orientation="horizontal"
      aria-label="Horizontal demo list"
      className="grid h-full grid-cols-4 items-center gap-1 p-3"
    >
      {items.map((item, index) => (
        <RovingFocusItem
          key={index}
          as="li"
          aria-label={`Item ${index + 1}`}
          className="group flex flex-col gap-3 rounded-lg p-2.5 outline-none hover:bg-neutral-50 focus:bg-neutral-100"
        >
          <span className="aspect-[3/4] rounded-md bg-neutral-200 group-focus:bg-neutral-300" />
          <span className="flex flex-col gap-2">
            <span
              className={`h-2 rounded-full bg-neutral-200 group-focus:bg-neutral-300 ${item.title}`}
            />
            <span
              className={`h-2 rounded-full bg-neutral-100 group-focus:bg-neutral-200 ${item.subtitle}`}
            />
          </span>
        </RovingFocusItem>
      ))}
    </RovingFocusGroup>
  );
}
