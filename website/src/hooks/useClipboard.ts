import { useState, useCallback, useEffect, useMemo } from "react";

interface UseClipboardOptions {
  read?: boolean;
  source?: string;
  copiedDuring?: number;
  legacy?: boolean;
}

interface UseClipboardReturn {
  isSupported: boolean;
  text: string;
  copied: boolean;
  copy: (value?: string) => Promise<void>;
}

export function useClipboard(
  options: UseClipboardOptions = {},
): UseClipboardReturn {
  const { read = false, source, copiedDuring = 1500, legacy = false } = options;

  const isSupported = useMemo(
    () =>
      (typeof navigator !== "undefined" && "clipboard" in navigator) || legacy,
    [legacy],
  );

  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (value = source) => {
      if (!isSupported || value == null) return;

      try {
        await navigator.clipboard.writeText(value);
      } catch {
        if (legacy) {
          const ta = document.createElement("textarea");
          ta.value = value;
          ta.style.position = "absolute";
          ta.style.opacity = "0";
          ta.setAttribute("readonly", "");
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
        }
      }

      setText(value);
      setCopied(true);
    },
    [isSupported, source, legacy],
  );

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), copiedDuring);
    return () => clearTimeout(timeout);
  }, [copied, copiedDuring]);

  useEffect(() => {
    if (!isSupported || !read) return;

    const updateText = async () => {
      try {
        setText(await navigator.clipboard.readText());
      } catch {
        setText(document?.getSelection?.()?.toString() ?? "");
      }
    };

    window.addEventListener("copy", updateText);
    window.addEventListener("cut", updateText);
    return () => {
      window.removeEventListener("copy", updateText);
      window.removeEventListener("cut", updateText);
    };
  }, [isSupported, read]);

  return { isSupported, text, copied, copy };
}
