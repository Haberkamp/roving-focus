import {
  ComponentPropsWithoutRef,
  FocusEvent,
  MouseEvent,
  forwardRef,
  useId,
  useRef,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  useIsomorphicLayoutEffect,
  useRovingFocus,
} from "./RovingFocusGroup.js";
import { useMergedRefs } from "./mergeRefs.js";

export type RovingFocusItemProps = {
  asChild?: boolean;
  as?: React.ElementType;
  focusable?: boolean;
  active?: boolean;
} & ComponentPropsWithoutRef<"span">;

export const RovingFocusItem = forwardRef<HTMLElement, RovingFocusItemProps>(
  function RovingFocusItem(
    {
      onFocus,
      onClick,
      asChild = false,
      as = "span",
      focusable = true,
      active = false,
      ...props
    },
    forwardedRef,
  ) {
    const id = useId();
    const {
      tabStopId,
      setActiveId,
      registerItem,
      unregisterItem,
      orientation,
      setDefaultActiveItem,
    } = useRovingFocus();

    const ref = useRef<HTMLElement>(null);
    const mergedRef = useMergedRefs(ref, forwardedRef);

    useIsomorphicLayoutEffect(() => {
      if (!ref.current) return;
      registerItem({ id, element: ref.current, focusable });
      return () => unregisterItem(id);
    }, [id, focusable, registerItem, unregisterItem]);

    useIsomorphicLayoutEffect(() => {
      if (active) setDefaultActiveItem(id);
    }, [id, active, setDefaultActiveItem]);

    const handleFocus = (event: FocusEvent<HTMLSpanElement>) => {
      if (focusable) setActiveId(id);
      onFocus?.(event);
    };

    const handleClick = (event: MouseEvent<HTMLSpanElement>) => {
      if (focusable) setActiveId(id);
      onClick?.(event);
    };

    const Component = asChild ? Slot : as;

    return (
      <Component
        data-roving-focus-item={id}
        data-orientation={orientation}
        data-disabled={focusable ? undefined : "true"}
        data-active={active ? "true" : undefined}
        tabIndex={focusable && tabStopId === id ? 0 : -1}
        {...props}
        ref={mergedRef}
        onFocus={handleFocus}
        onClick={handleClick}
      />
    );
  },
);
