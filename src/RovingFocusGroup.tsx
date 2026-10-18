import { Slot } from "@radix-ui/react-slot";
import {
  ComponentPropsWithoutRef,
  KeyboardEvent,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useMergedRefs } from "./mergeRefs.js";

export type GridPosition = { row: number; column: number };

type RegisteredItem = {
  id: string;
  element: HTMLElement;
  focusable: boolean;
};

type RovingFocusContextType = {
  /** The id of the item that currently has `tabIndex=0`, derived at render. */
  tabStopId: string | null;
  setActiveId: (id: string) => void;
  registerItem: (item: RegisteredItem) => void;
  unregisterItem: (id: string) => void;
  orientation: "horizontal" | "vertical" | "grid";
  loop: boolean;
  setDefaultActiveItem: (id: string) => void;
};

const RovingFocusContext = createContext<RovingFocusContextType | null>(null);

export const useRovingFocus = () => {
  const context = useContext(RovingFocusContext);
  if (!context) {
    throw new Error("useRovingFocus must be used within a RovingFocusGroup");
  }
  return context;
};

export const useIsomorphicLayoutEffect =
  typeof document === "undefined" ? useEffect : useLayoutEffect;

export type RovingFocusGroupProps = {
  loop?: boolean;
  orientation?: "horizontal" | "vertical" | "grid";
  as?: React.ElementType;
  asChild?: boolean;
  /**
   * Let `PageUp` / `PageDown` move focus to the first / last item, like
   * `Home` / `End`. Off by default so they keep scrolling the page.
   */
  pageNavigation?: boolean;
} & ComponentPropsWithoutRef<"div">;

const byDomOrder = (a: RegisteredItem, b: RegisteredItem) =>
  a.element.compareDocumentPosition(b.element) &
  Node.DOCUMENT_POSITION_FOLLOWING
    ? -1
    : 1;

/**
 * Picks the item that should be the tab stop: the active item if it is still
 * registered and focusable, otherwise the closest focusable item after it (or
 * before it), otherwise the first focusable item.
 */
function resolveTabStop(
  items: RegisteredItem[],
  activeId: string | null,
): string | null {
  const activeIndex = items.findIndex((item) => item.id === activeId);
  if (activeIndex !== -1) {
    if (items[activeIndex].focusable) return activeId;
    const after = items.slice(activeIndex + 1).find((item) => item.focusable);
    const before = items
      .slice(0, activeIndex)
      .reverse()
      .find((item) => item.focusable);
    return (after ?? before)?.id ?? null;
  }
  return items.find((item) => item.focusable)?.id ?? null;
}

export const RovingFocusGroup = forwardRef<HTMLElement, RovingFocusGroupProps>(
  function RovingFocusGroup(
    {
      asChild = false,
      onKeyDown,
      loop = true,
      orientation = "horizontal",
      as = "div",
      pageNavigation = false,
      ...props
    },
    forwardedRef,
  ) {
    const [activeId, setActiveId] = useState<string | null>(null);
    // Bumped whenever the set of registered items changes so the tab stop is
    // re-derived from the registry.
    const [, setRegistryVersion] = useState(0);
    const registry = useRef(new Map<string, RegisteredItem>());
    const groupRef = useRef<HTMLElement>(null);

    const getItems = () => [...registry.current.values()].sort(byDomOrder);

    const tabStopId = resolveTabStop(getItems(), activeId);

    const registerItem = useCallback((item: RegisteredItem) => {
      registry.current.set(item.id, item);
      setRegistryVersion((v) => v + 1);
    }, []);

    const unregisterItem = useCallback((id: string) => {
      registry.current.delete(id);
      setRegistryVersion((v) => v + 1);
    }, []);

    const setDefaultActiveItem = useCallback((id: string) => {
      if (registry.current.get(id)?.focusable === false) {
        console.warn(
          "The default active item is unfocusable. This is not recommended.",
        );
      }
      setActiveId(id);
    }, []);

    // Find nearest scrollable parent (not the page itself)
    const getScrollableParent = (element: HTMLElement): HTMLElement | null => {
      let parent = element.parentElement;
      while (parent && parent !== document.body) {
        const { overflow, overflowY, overflowX } = getComputedStyle(parent);
        if (/(auto|scroll)/.test(overflow + overflowY + overflowX)) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return null;
    };

    // Scroll element into view within scrollable container or page
    const scrollIntoViewIfNeeded = (element: HTMLElement) => {
      const scrollableParent = getScrollableParent(element);
      const padding = 20;

      if (!scrollableParent) {
        // No scrollable parent — scroll the page itself
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        let scrollX = window.scrollX;
        let scrollY = window.scrollY;

        if (rect.bottom + padding > viewportHeight) {
          scrollY += rect.bottom + padding - viewportHeight;
        } else if (rect.top - padding < 0) {
          scrollY += rect.top - padding;
        }

        if (rect.right + padding > viewportWidth) {
          scrollX += rect.right + padding - viewportWidth;
        } else if (rect.left - padding < 0) {
          scrollX += rect.left - padding;
        }

        window.scrollTo(scrollX, scrollY);
        return;
      }

      const parentRect = scrollableParent.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      // Check if element is outside visible area of scrollable parent
      if (elementRect.bottom + padding > parentRect.bottom) {
        scrollableParent.scrollTop +=
          elementRect.bottom + padding - parentRect.bottom;
      } else if (elementRect.top - padding < parentRect.top) {
        scrollableParent.scrollTop -=
          parentRect.top - elementRect.top + padding;
      }

      if (elementRect.right + padding > parentRect.right) {
        scrollableParent.scrollLeft +=
          elementRect.right + padding - parentRect.right;
      } else if (elementRect.left - padding < parentRect.left) {
        scrollableParent.scrollLeft -=
          parentRect.left - elementRect.left + padding;
      }
    };

    const focusItem = (item: RegisteredItem | undefined) => {
      if (!item) return;
      setActiveId(item.id);
      item.element.focus({ preventScroll: true });
      scrollIntoViewIfNeeded(item.element);
    };

    // Moves along `items` from `fromId`, skipping unfocusable items. Returns
    // undefined at an end when looping is disabled.
    const findNext = (
      items: RegisteredItem[],
      fromId: string,
      direction: 1 | -1,
    ): RegisteredItem | undefined => {
      const length = items.length;
      const start = items.findIndex((item) => item.id === fromId);
      if (start === -1) return items.find((item) => item.focusable);

      for (let step = 1; step < length; step++) {
        let index = start + direction * step;
        if (loop) {
          index = (index + length) % length;
        } else if (index < 0 || index >= length) {
          return undefined;
        }
        if (items[index].focusable) return items[index];
      }
      return undefined;
    };

    // Grid positions are computed from the current layout whenever a key is
    // pressed, so they are never stale after resizes or re-renders.
    const computeGridPositions = (items: RegisteredItem[]) => {
      const rects = items.map((item) => ({
        id: item.id,
        rect: item.element.getBoundingClientRect(),
      }));
      const positions = new Map<string, GridPosition>();
      if (rects.length === 0) return positions;

      // Calculate row threshold based on smallest item height
      const minHeight = Math.min(...rects.map(({ rect }) => rect.height));
      const rowThreshold = Math.max(minHeight / 2, 1);

      // Sort by top, then left
      rects.sort((a, b) => {
        const topDiff = a.rect.top - b.rect.top;
        if (Math.abs(topDiff) > rowThreshold) return topDiff;
        return a.rect.left - b.rect.left;
      });

      // Cluster into rows
      let row = 0;
      let column = 0;
      let rowTop = rects[0].rect.top;
      for (const { id, rect } of rects) {
        if (Math.abs(rect.top - rowTop) > rowThreshold) {
          row++;
          column = 0;
          rowTop = rect.top;
        }
        positions.set(id, { row, column });
        column++;
      }
      return positions;
    };

    const handleGridKey = (key: string, fromId: string) => {
      const items = getItems();
      const positions = computeGridPositions(items);
      const visual = items
        .filter((item) => positions.has(item.id))
        .sort((a, b) => {
          const pa = positions.get(a.id)!;
          const pb = positions.get(b.id)!;
          return pa.row - pb.row || pa.column - pb.column;
        });

      if (key === "Home") return focusItem(visual.find((i) => i.focusable));
      if (key === "End") {
        return focusItem([...visual].reverse().find((i) => i.focusable));
      }

      const current = positions.get(fromId);
      if (!current) return;
      const horizontal = key === "ArrowRight" || key === "ArrowLeft";
      const direction = key === "ArrowRight" || key === "ArrowDown" ? 1 : -1;
      const line = visual
        .filter((item) => {
          const position = positions.get(item.id)!;
          return horizontal
            ? position.row === current.row
            : position.column === current.column;
        })
        .sort((a, b) => {
          const pa = positions.get(a.id)!;
          const pb = positions.get(b.id)!;
          return horizontal ? pa.column - pb.column : pa.row - pb.row;
        });
      focusItem(findNext(line, fromId, direction));
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event as KeyboardEvent<HTMLDivElement>);
      if (event.defaultPrevented) return;

      const itemElement = (event.target as HTMLElement).closest?.(
        "[data-roving-focus-item]",
      );
      const fromId = itemElement?.getAttribute("data-roving-focus-item");
      // Ignore keys from outside our items, e.g. from a nested group.
      if (!fromId || registry.current.get(fromId)?.element !== itemElement) {
        return;
      }

      let key = event.key;
      if (pageNavigation && key === "PageUp") key = "Home";
      if (pageNavigation && key === "PageDown") key = "End";

      const keys =
        orientation === "grid"
          ? ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"]
          : orientation === "horizontal"
            ? ["ArrowRight", "ArrowLeft"]
            : ["ArrowDown", "ArrowUp"];
      if (![...keys, "Home", "End"].includes(key)) return;

      event.preventDefault();

      if (orientation === "grid") return handleGridKey(key, fromId);

      const items = getItems();
      if (key === "Home") return focusItem(items.find((i) => i.focusable));
      if (key === "End") {
        return focusItem([...items].reverse().find((i) => i.focusable));
      }
      const direction = key === "ArrowRight" || key === "ArrowDown" ? 1 : -1;
      focusItem(findNext(items, fromId, direction));
    };

    // Ensure focus moves from a scrollable parent into the roving items.
    // Firefox can give focus to the scrollable container (e.g. a div with
    // overflow:auto) instead of the first focusable item inside the group.
    // When that happens, we immediately redirect focus to the tab stop so
    // keyboard navigation works consistently.
    useEffect(() => {
      const handleFocusIn = (event: FocusEvent) => {
        const group = groupRef.current;
        if (!group) return;

        const scrollableParent = getScrollableParent(group);
        if (!scrollableParent || event.target !== scrollableParent) return;

        const target = registry.current.get(tabStopId ?? "");
        if (target && document.activeElement !== target.element) {
          target.element.focus({ preventScroll: true });
          scrollIntoViewIfNeeded(target.element);
        }
      };

      document.addEventListener("focusin", handleFocusIn);
      return () => {
        document.removeEventListener("focusin", handleFocusIn);
      };
    }, [tabStopId]);

    const contextValue: RovingFocusContextType = {
      tabStopId,
      setActiveId,
      registerItem,
      unregisterItem,
      orientation,
      loop,
      setDefaultActiveItem,
    };

    const mergedRef = useMergedRefs(groupRef, forwardedRef);
    const Component = asChild ? Slot : as;

    return (
      <RovingFocusContext.Provider value={contextValue}>
        <Component
          data-orientation={orientation}
          {...props}
          ref={mergedRef}
          onKeyDown={handleKeyDown}
        />
      </RovingFocusContext.Provider>
    );
  },
);
