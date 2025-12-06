import { RovingFocusGroup, RovingFocusItem } from "@roving-focus/react";

export function GridExample() {
  const tiles = Array.from({ length: 49 }, (_, i) => {
    const row = Math.floor(i / 7);
    const col = i % 7;
    const isBlack = (row + col) % 2 === 0;
    return (
      <RovingFocusItem
        key={i}
        position={{ row, column: col }}
        style={{
          width: "50px",
          height: "50px",
          backgroundColor: isBlack ? "#000" : "transparent",
        }}
      />
    );
  });

  return (
    <div className="relative">
      <RovingFocusGroup
        orientation="grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 50px)",
          gap: 0,
        }}
      >
        {tiles}
      </RovingFocusGroup>

      <div className="absolute -bottom-16 left-0 text-[#2D2D2D] leading-[1.3]">
        Press Tab to focus the first item, then use ←, →, ↑ or ↓ to move the
        orange rectangle.
      </div>
    </div>
  );
}
