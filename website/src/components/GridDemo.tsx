import { RovingFocusGroup, RovingFocusItem } from "@roving-focus/react";

const columns = ["A", "B", "C", "D", "E"];

// Placeholder bars that mimic cell values: labels in the first column,
// right-aligned numbers in the middle and a sparse last column.
const rows = [
  ["w-3/4", "w-1/3", "w-2/5", "w-1/3", ""],
  ["w-1/2", "w-2/5", "w-1/3", "w-1/2", "w-1/4"],
  ["w-2/3", "w-1/4", "w-1/2", "w-1/3", ""],
  ["w-3/5", "w-1/3", "w-2/5", "w-1/4", ""],
  ["w-1/2", "w-1/2", "w-1/3", "w-2/5", "w-1/3"],
  ["w-4/5", "w-1/3", "w-1/4", "w-1/3", ""],
  ["", "", "", "", ""],
];

export function GridDemo() {
  return (
    <div className="flex h-full flex-col">
      <div
        className="flex h-8 shrink-0 items-center gap-2 border-b border-neutral-200 px-2"
        aria-hidden="true"
      >
        <span className="h-4 w-10 rounded-sm border border-neutral-200" />
        <span className="h-4 flex-1 rounded-sm border border-neutral-200" />
      </div>
      <RovingFocusGroup
        orientation="grid"
        aria-label="Spreadsheet demo"
        className="grid min-h-0 flex-1 grid-cols-[1.75rem_repeat(5,minmax(0,1fr))] grid-rows-[1.25rem_repeat(7,minmax(0,1fr))]"
      >
        <span
          className="border-r border-b border-neutral-200 bg-neutral-100"
          aria-hidden="true"
        />
        {columns.map((column, index) => (
          <span
            key={column}
            className={`flex items-center justify-center border-b border-neutral-200 bg-neutral-100 ${
              index < columns.length - 1 ? "border-r" : ""
            }`}
            aria-hidden="true"
          >
            <span className="h-1.5 w-2 rounded-full bg-neutral-300" />
          </span>
        ))}
        {rows.map((cells, row) => [
          <span
            key={`row-${row}`}
            className={`flex items-center justify-center border-r border-neutral-200 bg-neutral-100 ${
              row < rows.length - 1 ? "border-b" : ""
            }`}
            aria-hidden="true"
          >
            <span className="h-1.5 w-2 rounded-full bg-neutral-300" />
          </span>,
          ...cells.map((width, column) => (
            <RovingFocusItem
              key={`${row}-${column}`}
              aria-label={`${columns[column]}${row + 1}`}
              className={`flex cursor-cell items-center border-neutral-200 px-1.5 outline-hidden hover:bg-neutral-50 focus:relative focus:z-10 focus:outline-2 focus:outline-solid focus:-outline-offset-1 focus:outline-neutral-500 ${
                column < columns.length - 1 ? "border-r" : ""
              } ${row < rows.length - 1 ? "border-b" : ""} ${
                column === 0 ? "justify-start" : "justify-end"
              } ${
                // Follow the browser window's rounded corner (rounded-xl minus its 1px border).
                column === columns.length - 1 && row === rows.length - 1
                  ? "rounded-br-[calc(var(--radius-xl)-1px)]"
                  : ""
              }`}
            >
              {width && (
                <span
                  className={`h-1.5 rounded-full bg-neutral-200 ${width}`}
                />
              )}
            </RovingFocusItem>
          )),
        ])}
      </RovingFocusGroup>
    </div>
  );
}
