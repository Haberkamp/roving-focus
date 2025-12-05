import type { ComponentPropsWithoutRef } from "react";
import { useClipboard } from "../hooks/useClipboard";
import { cn } from "../utils";

interface Props {
  className?: string;
}

export function InstallSnippet({ className }: Props) {
  const { copy, copied } = useClipboard();

  return (
    <div
      className={cn(
        "font-mono bg-black text-white inline-flex items-center px-4 min-h-13",
        className,
      )}
    >
      <span className="select-none pointer-events-none" aria-hidden="true">
        ~
      </span>
      <div className="pr-3" />
      <span>pnpm add @roving-focus/react</span>

      <button
        className="size-8 grid place-items-center ml-auto hover:bg-white hover:text-black cursor-pointer -mr-1.5 outline-none focus-visible:ring-2"
        onClick={() => copy("pnpm add @roving-focus/react")}
        aria-label={copied ? "Copied" : "Copy"}
      >
        {copied ? (
          <CheckmarkIcon className="size-4" />
        ) : (
          <ClipboardIcon className="size-4" />
        )}
      </button>
    </div>
  );
}

function CheckmarkIcon(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

function ClipboardIcon(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...props}
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    </svg>
  );
}
