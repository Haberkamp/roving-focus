import { Slot } from "@radix-ui/react-slot";
import {
  ComponentPropsWithoutRef,
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

export type GridPosition = { row: number; column: number };

type RegisterItemOptions = {
  focusable?: boolean;
  position?: GridPosition;
};

type RegisteredItem = {
  id: string;
  focusable: boolean;
  position?: GridPosition;
};

type RovingFocusContextType = {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  registerItem: (id: string, options?: RegisterItemOptions) => number;
  unregisterItem: (id: string) => void;
  getTabIndex: (itemIndex: number) => number;
  focusNextItem: () => void;
  focusPreviousItem: () => void;
  focusLastItem: () => void;
  focusFirstItem: () => void;
  focusRight: () => void;
  focusLeft: () => void;
  focusDown: () => void;
  focusUp: () => void;
  orientation: "horizontal" | "vertical" | "grid";
  loop: boolean;
  setDefaultActiveItem: (index: number) => void;
};

const RovingFocusContext = createContext<RovingFocusContextType | null>(null);

export const useRovingFocus = () => {
  const context = useContext(RovingFocusContext);
  if (!context) {
    throw new Error("useRovingFocus must be used within a RovingFocusGroup");
  }
  return context;
};

export type RovingFocusGroupProps = {
  loop?: boolean;
  orientation?: "horizontal" | "vertical" | "grid";
  as?: React.ElementType;
  asChild?: boolean;
} & ComponentPropsWithoutRef<"div">;

export function RovingFocusGroup({
  asChild = false,
  onKeyDown,
  loop = true,
  orientation = "horizontal",
  as = "div",
  ...props
}: RovingFocusGroupProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const registeredItems = useRef<RegisteredItem[]>([]);
  const groupRef = useRef<HTMLDivElement>(null);
  const hasDefaultActiveItem = useRef(false);

  const findFirstFocusableIndex = (): number => {
    for (let i = 0; i < registeredItems.current.length; i++) {
      const item = registeredItems.current[i];
      if (item && item.focusable) {
        return i;
      }
    }
    return -1;
  };

  const registerItem = (id: string, options?: RegisterItemOptions): number => {
    const focusable = options?.focusable ?? true;
    const position = options?.position;

    const existingIndex = registeredItems.current.findIndex(
      (item) => item.id === id,
    );
    if (existingIndex === -1) {
      registeredItems.current.push({ id, focusable, position });
    } else {
      // Update in place to maintain stable index for focus stability
      registeredItems.current[existingIndex] = { id, focusable, position };
    }
    return registeredItems.current.findIndex((item) => item.id === id);
  };

  const unregisterItem = (id: string): void => {
    const index = registeredItems.current.findIndex((item) => item.id === id);
    if (index > -1) {
      registeredItems.current.splice(index, 1);
    }
  };

  const getTabIndex = (itemIndex: number): number => {
    const item = registeredItems.current[itemIndex];
    if (!item || !item.focusable) {
      return -1;
    }
    return itemIndex === currentIndex ? 0 : -1;
  };

  // Update currentIndex when items are registered and currentIndex is -1
  useEffect(() => {
    if (
      currentIndex === -1 &&
      registeredItems.current.length > 0 &&
      !hasDefaultActiveItem.current
    ) {
      const firstFocusableIndex = findFirstFocusableIndex();
      if (firstFocusableIndex !== -1) {
        setCurrentIndex(firstFocusableIndex);
      }
    }
  }, [currentIndex]);

  const getNextFocusableIndex = (
    startIndex: number,
    direction: 1 | -1,
  ): number => {
    const length = registeredItems.current.length;
    if (length === 0) return startIndex;

    // If startIndex is -1, find the first focusable item
    if (startIndex === -1) {
      return findFirstFocusableIndex();
    }

    let index = startIndex;
    let attempts = 0;

    do {
      index = loop
        ? (index + direction + length) % length
        : Math.max(0, Math.min(index + direction, length - 1));

      attempts++;
      if (attempts > length) break; // Prevent infinite loop

      const item = registeredItems.current[index];
      if (item && item.focusable) {
        return index;
      }
    } while (index !== startIndex || loop);

    return startIndex;
  };

  const focusNextItem = () => {
    const nextIndex = getNextFocusableIndex(currentIndex, 1);
    setCurrentIndex(nextIndex);

    const nextItem = registeredItems.current[nextIndex];
    if (nextItem) {
      const nextItemElement = groupRef.current?.querySelector(
        `[data-roving-focus-item="${nextItem.id}"]`,
      );

      if (nextItemElement) {
        (nextItemElement as HTMLElement).focus();
      }
    }
  };

  const focusPreviousItem = () => {
    const previousIndex = getNextFocusableIndex(currentIndex, -1);
    setCurrentIndex(previousIndex);

    const previousItem = registeredItems.current[previousIndex];
    if (previousItem) {
      const previousItemElement = groupRef.current?.querySelector(
        `[data-roving-focus-item="${previousItem.id}"]`,
      );

      if (previousItemElement) {
        (previousItemElement as HTMLElement).focus();
      }
    }
  };

  const focusFirstItem = () => {
    if (orientation === "grid") {
      const idx = findGridFirstFocusable();
      if (idx !== -1) {
        focusItemAtIndex(idx);
      }
      return;
    }
    // Find the first focusable item
    for (let i = 0; i < registeredItems.current.length; i++) {
      const item = registeredItems.current[i];
      if (item && item.focusable) {
        setCurrentIndex(i);
        const firstItemElement = groupRef.current?.querySelector(
          `[data-roving-focus-item="${item.id}"]`,
        );
        if (firstItemElement) {
          (firstItemElement as HTMLElement).focus();
        }
        return;
      }
    }
  };

  const focusLastItem = () => {
    if (orientation === "grid") {
      const idx = findGridLastFocusable();
      if (idx !== -1) {
        focusItemAtIndex(idx);
      }
      return;
    }
    // Find the last focusable item
    for (let i = registeredItems.current.length - 1; i >= 0; i--) {
      const item = registeredItems.current[i];
      if (item && item.focusable) {
        setCurrentIndex(i);
        const lastItemElement = groupRef.current?.querySelector(
          `[data-roving-focus-item="${item.id}"]`,
        );
        if (lastItemElement) {
          (lastItemElement as HTMLElement).focus();
        }
        return;
      }
    }
  };

  // Grid navigation helpers
  const focusItemAtIndex = (index: number) => {
    setCurrentIndex(index);
    const item = registeredItems.current[index];
    if (item) {
      const element = groupRef.current?.querySelector(
        `[data-roving-focus-item="${item.id}"]`,
      );
      if (element) {
        (element as HTMLElement).focus();
      }
    }
  };

  const getRowPeers = (row: number) => {
    return registeredItems.current
      .map((item, index) => ({ ...item, index }))
      .filter((item) => item.position?.row === row)
      .sort((a, b) => (a.position?.column ?? 0) - (b.position?.column ?? 0));
  };

  const getColumnPeers = (column: number) => {
    return registeredItems.current
      .map((item, index) => ({ ...item, index }))
      .filter((item) => item.position?.column === column)
      .sort((a, b) => (a.position?.row ?? 0) - (b.position?.row ?? 0));
  };

  const findGridFirstFocusable = (): number => {
    const focusableItems = registeredItems.current
      .map((item, index) => ({ ...item, index }))
      .filter((item) => item.focusable && item.position);

    if (focusableItems.length === 0) return -1;

    focusableItems.sort((a, b) => {
      const rowDiff = (a.position?.row ?? 0) - (b.position?.row ?? 0);
      if (rowDiff !== 0) return rowDiff;
      return (a.position?.column ?? 0) - (b.position?.column ?? 0);
    });

    return focusableItems[0]?.index ?? -1;
  };

  const findGridLastFocusable = (): number => {
    const focusableItems = registeredItems.current
      .map((item, index) => ({ ...item, index }))
      .filter((item) => item.focusable && item.position);

    if (focusableItems.length === 0) return -1;

    focusableItems.sort((a, b) => {
      const rowDiff = (b.position?.row ?? 0) - (a.position?.row ?? 0);
      if (rowDiff !== 0) return rowDiff;
      return (b.position?.column ?? 0) - (a.position?.column ?? 0);
    });

    return focusableItems[0]?.index ?? -1;
  };

  const focusRight = () => {
    const current = registeredItems.current[currentIndex];
    if (!current?.position) return;

    const rowPeers = getRowPeers(current.position.row);
    const currentPeerIdx = rowPeers.findIndex((p) => p.index === currentIndex);

    // Find next focusable in row
    for (let i = currentPeerIdx + 1; i < rowPeers.length; i++) {
      if (rowPeers[i]?.focusable) {
        focusItemAtIndex(rowPeers[i].index);
        return;
      }
    }

    // At end of row
    if (loop) {
      // Loop to first focusable in row
      for (let i = 0; i < currentPeerIdx; i++) {
        if (rowPeers[i]?.focusable) {
          focusItemAtIndex(rowPeers[i].index);
          return;
        }
      }
    }
  };

  const focusLeft = () => {
    const current = registeredItems.current[currentIndex];
    if (!current?.position) return;

    const rowPeers = getRowPeers(current.position.row);
    const currentPeerIdx = rowPeers.findIndex((p) => p.index === currentIndex);

    // Find previous focusable in row
    for (let i = currentPeerIdx - 1; i >= 0; i--) {
      if (rowPeers[i]?.focusable) {
        focusItemAtIndex(rowPeers[i].index);
        return;
      }
    }

    // At start of row
    if (loop) {
      // Loop to last focusable in row
      for (let i = rowPeers.length - 1; i > currentPeerIdx; i--) {
        if (rowPeers[i]?.focusable) {
          focusItemAtIndex(rowPeers[i].index);
          return;
        }
      }
    }
  };

  const focusDown = () => {
    const current = registeredItems.current[currentIndex];
    if (!current?.position) return;

    const colPeers = getColumnPeers(current.position.column);
    const currentPeerIdx = colPeers.findIndex((p) => p.index === currentIndex);

    // Find next focusable in column
    for (let i = currentPeerIdx + 1; i < colPeers.length; i++) {
      if (colPeers[i]?.focusable) {
        focusItemAtIndex(colPeers[i].index);
        return;
      }
    }

    // At end of column
    if (loop) {
      // Loop to first focusable in column
      for (let i = 0; i < currentPeerIdx; i++) {
        if (colPeers[i]?.focusable) {
          focusItemAtIndex(colPeers[i].index);
          return;
        }
      }
    }
  };

  const focusUp = () => {
    const current = registeredItems.current[currentIndex];
    if (!current?.position) return;

    const colPeers = getColumnPeers(current.position.column);
    const currentPeerIdx = colPeers.findIndex((p) => p.index === currentIndex);

    // Find previous focusable in column
    for (let i = currentPeerIdx - 1; i >= 0; i--) {
      if (colPeers[i]?.focusable) {
        focusItemAtIndex(colPeers[i].index);
        return;
      }
    }

    // At start of column
    if (loop) {
      // Loop to last focusable in column
      for (let i = colPeers.length - 1; i > currentPeerIdx; i--) {
        if (colPeers[i]?.focusable) {
          focusItemAtIndex(colPeers[i].index);
          return;
        }
      }
    }
  };

  const setDefaultActiveItem = (index: number) => {
    hasDefaultActiveItem.current = true;
    const item = registeredItems.current[index];

    if (item && !item.focusable) {
      console.warn(
        "The default active item is unfocusable. This is not recommended.",
      );

      // Find the next focusable item after the given index
      for (let i = index + 1; i < registeredItems.current.length; i++) {
        const nextItem = registeredItems.current[i];
        if (nextItem && nextItem.focusable) {
          setCurrentIndex(i);
          return;
        }
      }

      // If no focusable item found after, look before the given index
      for (let i = index - 1; i >= 0; i--) {
        const prevItem = registeredItems.current[i];
        if (prevItem && prevItem.focusable) {
          setCurrentIndex(i);
          return;
        }
      }

      // If still no focusable item found, find the first focusable item
      const firstFocusableIndex = findFirstFocusableIndex();
      if (firstFocusableIndex !== -1) {
        setCurrentIndex(firstFocusableIndex);
        return;
      }
    }

    setCurrentIndex(index);
  };

  const contextValue: RovingFocusContextType = {
    currentIndex,
    setCurrentIndex,
    registerItem,
    unregisterItem,
    getTabIndex,
    focusNextItem,
    focusPreviousItem,
    focusLastItem,
    focusFirstItem,
    focusRight,
    focusLeft,
    focusDown,
    focusUp,
    orientation,
    loop,
    setDefaultActiveItem,
  };

  const Component = asChild ? Slot : as;

  return (
    <RovingFocusContext.Provider value={contextValue}>
      <Component
        ref={groupRef}
        data-orientation={orientation}
        data-testid="roving-focus-group"
        {...props}
      />
    </RovingFocusContext.Provider>
  );
}
