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
  focusPreviousItem: () => void;
  focusLastItem: () => void;
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
} & ComponentPropsWithoutRef<"div">;

export function RovingIndexGroup({
  onKeyDown,
  loop = true,
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
    }
  };

  const getTabIndex = (itemIndex: number): number => {
    return itemIndex === currentIndex ? 0 : -1;
  };

  const focusNextItem = () => {
    const nextIndex = loop
      ? (currentIndex + 1) % registeredItems.current.length
      : Math.min(currentIndex + 1, registeredItems.current.length - 1);
    setCurrentIndex(nextIndex);

    const nextItem = registeredItems.current[nextIndex];
    const nextItemElement = groupRef.current?.querySelector(
      `[data-roving-index-item="${nextItem}"]`,
    );

    if (nextItemElement) {
      (nextItemElement as HTMLElement).focus();
    }
  };

  const focusPreviousItem = () => {
    const previousIndex = loop
      ? (currentIndex - 1 + registeredItems.current.length) %
        registeredItems.current.length
      : Math.max(currentIndex - 1, 0);
    setCurrentIndex(previousIndex);

    const previousItem = registeredItems.current[previousIndex];
    const previousItemElement = groupRef.current?.querySelector(
      `[data-roving-index-item="${previousItem}"]`,
    );

    if (previousItemElement) {
      (previousItemElement as HTMLElement).focus();
    }
  };

  const focusLastItem = () => {
    const newCurrentIndex = registeredItems.current.length - 1;
    setCurrentIndex(newCurrentIndex);

    const lastItem = registeredItems.current[newCurrentIndex];
    const lastItemElement = groupRef.current?.querySelector(
      `[data-roving-index-item="${lastItem}"]`,
    );

    if (lastItemElement) {
      (lastItemElement as HTMLElement).focus();
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
  };

  return (
    <RovingIndexContext.Provider value={contextValue}>
      <div ref={groupRef} {...props} />
    </RovingIndexContext.Provider>
  );
}
