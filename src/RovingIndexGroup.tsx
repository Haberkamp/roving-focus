import {
  ComponentPropsWithoutRef,
  createContext,
  useContext,
  useState,
  useRef,
} from "react";

type RovingIndexContextType = {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  registerItem: (id: string) => number;
  unregisterItem: (id: string) => void;
  getTabIndex: (itemIndex: number) => number;
  focusNextItem: () => void;
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

  const focusNextItem = () => {
    const nextIndex = (currentIndex + 1) % registeredItems.current.length;
    setCurrentIndex(nextIndex);

    const nextItem = registeredItems.current[nextIndex];
    const nextItemElement = groupRef.current?.querySelector(
      `[data-roving-index-item="${nextItem}"]`,
    );

    if (nextItemElement) {
      (nextItemElement as HTMLElement).focus();
    }
  };

  const contextValue: RovingIndexContextType = {
    currentIndex,
    setCurrentIndex,
    registerItem,
    unregisterItem,
    getTabIndex,
    focusNextItem,
  };

  return (
    <RovingIndexContext.Provider value={contextValue}>
      <div ref={groupRef} {...props} />
    </RovingIndexContext.Provider>
  );
}
