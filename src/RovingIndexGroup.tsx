import {
  ComponentPropsWithoutRef,
  createContext,
  useContext,
  useState,
  useRef,
  KeyboardEvent,
} from "react";

type RovingIndexContextType = {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  registerItem: (id: string) => number;
  unregisterItem: (id: string) => void;
  getTabIndex: (itemIndex: number) => number;
};

const RovingIndexContext = createContext<RovingIndexContextType | null>(null);

export const useRovingIndex = () => {
  const context = useContext(RovingIndexContext);
  if (!context) {
    throw new Error("useRovingIndex must be used within a RovingIndexGroup");
  }
  return context;
};

export type RovingIndexGroupProps = {} & ComponentPropsWithoutRef<"div">;

export function RovingIndexGroup({
  onKeyDown,
  ...props
}: RovingIndexGroupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const registeredItems = useRef<string[]>([]);
  const groupRef = useRef<HTMLDivElement>(null);

  const registerItem = (id: string): number => {
    if (!registeredItems.current.includes(id)) {
      registeredItems.current.push(id);
    }
    return registeredItems.current.indexOf(id);
  };

  const unregisterItem = (id: string): void => {
    const index = registeredItems.current.indexOf(id);
    if (index > -1) {
      registeredItems.current.splice(index, 1);
      // Adjust current index if needed
      if (currentIndex >= registeredItems.current.length) {
        setCurrentIndex(Math.max(0, registeredItems.current.length - 1));
      }
    }
  };

  const getTabIndex = (itemIndex: number): number => {
    return itemIndex === currentIndex ? 0 : -1;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab" && !event.shiftKey) {
      // If we're focused on an item in this group, let the tab move to next element outside
      const activeElement = document.activeElement;
      const groupElement = groupRef.current;

      if (groupElement && groupElement.contains(activeElement)) {
        // We're already focused on an item, let tab move outside the group
        return;
      }
    }

    onKeyDown?.(event);
  };

  const contextValue: RovingIndexContextType = {
    currentIndex,
    setCurrentIndex,
    registerItem,
    unregisterItem,
    getTabIndex,
  };

  return (
    <RovingIndexContext.Provider value={contextValue}>
      <div ref={groupRef} onKeyDown={handleKeyDown} {...props} />
    </RovingIndexContext.Provider>
  );
}
