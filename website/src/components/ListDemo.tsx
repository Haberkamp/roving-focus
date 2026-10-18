import { RovingFocusGroup, RovingFocusItem } from "@roving-focus/react";

const items = [
  { title: "w-1/3", subtitle: "w-1/2" },
  { title: "w-1/4", subtitle: "w-2/5" },
  { title: "w-2/5", subtitle: "w-1/3" },
  { title: "w-1/4", subtitle: "w-1/2" },
  { title: "w-1/3", subtitle: "w-2/5" },
];

export function ListDemo() {
  return (
    <RovingFocusGroup
      as="ul"
      orientation="vertical"
      aria-label="Demo list"
      className="flex flex-col gap-1 p-3"
    >
      {items.map((item, index) => (
        <RovingFocusItem
          key={index}
          as="li"
          aria-label={`Item ${index + 1}`}
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 outline-none hover:bg-neutral-50 focus:bg-neutral-100"
        >
          <span className="size-8 shrink-0 rounded-md bg-neutral-200 group-focus:bg-neutral-300" />
          <span className="flex flex-1 flex-col gap-2">
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
