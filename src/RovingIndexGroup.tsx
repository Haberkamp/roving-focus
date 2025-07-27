import { Slot } from "@radix-ui/react-slot";
import {
  ComponentPropsWithoutRef,
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

type RovingIndexContextType = {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  registerItem: (id: string, focusable?: boolean) => number;
  unregisterItem: (id: string) => void;
  getTabIndex: (itemIndex: number) => number;
  focusNextItem: () => void;
  focusPreviousItem: () => void;
  focusLastItem: () => void;
  focusFirstItem: () => void;
  orientation: "horizontal" | "vertical";
};

const RovingIndexContext = createContext<RovingIndexContextType | null>(null);

export const useRovingIndex = () => {
  const context = useContext(RovingIndexContext);
  if (!context) {
    throw new Error("useRovingIndex must be used within a RovingIndexGroup");
  }
  return context;
};

export type RovingIndexGroupProps = {
  loop?: boolean;
  orientation?: "horizontal" | "vertical";
  as?: React.ElementType;
  asChild?: boolean;
} & ComponentPropsWithoutRef<"div">;

export function RovingIndexGroup({
  asChild = false,
  onKeyDown,
  loop = true,
  orientation = "horizontal",
  as = "div",
  ...props
}: RovingIndexGroupProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const registeredItems = useRef<Array<{ id: string; focusable: boolean }>>([]);
  const groupRef = useRef<HTMLDivElement>(null);

  const findFirstFocusableIndex = (): number => {
    for (let i = 0; i < registeredItems.current.length; i++) {
      const item = registeredItems.current[i];
      if (item && item.focusable) {
        return i;
      }
    }
    return -1;
  };

  const registerItem = (id: string, focusable: boolean = true): number => {
    const existingIndex = registeredItems.current.findIndex(
      (item) => item.id === id,
    );
    if (existingIndex === -1) {
      registeredItems.current.push({ id, focusable });
    } else {
      registeredItems.current[existingIndex] = { id, focusable };
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
    if (currentIndex === -1 && registeredItems.current.length > 0) {
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
        `[data-roving-index-item="${nextItem.id}"]`,
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
        `[data-roving-index-item="${previousItem.id}"]`,
      );

      if (previousItemElement) {
        (previousItemElement as HTMLElement).focus();
      }
    }
  };

  const focusLastItem = () => {
    // Find the last focusable item
    for (let i = registeredItems.current.length - 1; i >= 0; i--) {
      const item = registeredItems.current[i];
      if (item && item.focusable) {
        setCurrentIndex(i);
        const lastItemElement = groupRef.current?.querySelector(
          `[data-roving-index-item="${item.id}"]`,
        );
        if (lastItemElement) {
          (lastItemElement as HTMLElement).focus();
        }
        return;
      }
    }
  };

  const focusFirstItem = () => {
    // Find the first focusable item
    for (let i = 0; i < registeredItems.current.length; i++) {
      const item = registeredItems.current[i];
      if (item && item.focusable) {
        setCurrentIndex(i);
        const firstItemElement = groupRef.current?.querySelector(
          `[data-roving-index-item="${item.id}"]`,
        );
        if (firstItemElement) {
          (firstItemElement as HTMLElement).focus();
        }
        return;
      }
    }
  };

  const contextValue: RovingIndexContextType = {
    currentIndex,
    setCurrentIndex,
    registerItem,
    unregisterItem,
    getTabIndex,
    focusNextItem,
    focusPreviousItem,
    focusLastItem,
    focusFirstItem,
    orientation,
  };

  const Component = asChild ? Slot : as;

  return (
    <RovingIndexContext.Provider value={contextValue}>
      <Component
        ref={groupRef}
        data-orientation={orientation}
        data-testid="roving-index-group"
        {...props}
      />
    </RovingIndexContext.Provider>
  );
}
