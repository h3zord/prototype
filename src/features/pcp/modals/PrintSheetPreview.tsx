import * as Popover from "@radix-ui/react-popover";
import { RiFileSearchLine } from "react-icons/ri";
import { Loader2 } from "lucide-react";
import { usePrintSheetQuery } from "../../../features/serviceOrder/api/hooks";
import { useRef, useState, useCallback } from "react";

interface Props {
  serviceOrderId: number;
  printSheet?: string | null;
}

export default function PrintSheetPreview({
  serviceOrderId,
  printSheet,
}: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const openTimerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: url, isFetching } = usePrintSheetQuery(serviceOrderId, {
    enabled: !!printSheet && open,
  });

  const clearTimers = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    clearTimers();
    if (!open) {
      openTimerRef.current = setTimeout(() => {
        setOpen(true);
        openTimerRef.current = null;
      }, 500); // 0.5s delay
    }
  }, [open, clearTimers]);

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      clearTimers();

      const next = e.relatedTarget as Node | null;
      if (
        triggerRef.current?.contains(next) ||
        contentRef.current?.contains(next)
      ) {
        return;
      }

      closeTimerRef.current = setTimeout(() => {
        setOpen(false);
        closeTimerRef.current = null;
      }, 100); // Pequeno delay para fechar, evita flickering
    },
    [clearTimers]
  );

  const handleClick = useCallback(() => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }, [url]);

  const handleFocus = useCallback(() => {
    clearTimers();
    setOpen(true);
  }, [clearTimers]);

  const handleBlur = useCallback(() => {
    clearTimers();
    setOpen(false);
  }, [clearTimers]);

  if (!printSheet) return null;

  const isPdf = printSheet.toLowerCase().endsWith(".pdf");

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <div className="flex items-center">
          <button
            ref={triggerRef}
            title="Ficha de impressão"
            className="focus:outline-none transition-colors duration-200"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            <RiFileSearchLine size={16} />
          </button>
        </div>
      </Popover.Trigger>

      <Popover.Content
        ref={contentRef}
        side="right"
        align="start"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="rounded bg-gray-800 border border-gray-700 p-2 shadow-lg w-[360px] z-50
                   data-[state=open]:animate-in data-[state=closed]:animate-out
                   data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
                   data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
                   data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
                   data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
                   duration-200"
        sideOffset={5}
      >
        {isFetching ? (
          <div className="flex items-center justify-center h-[120px]">
            <Loader2 className="animate-spin" />
          </div>
        ) : url ? (
          isPdf ? (
            <embed
              src={url}
              type="application/pdf"
              className="h-[480px] w-full rounded transition-opacity duration-200"
            />
          ) : (
            <img
              src={url}
              alt="Ficha de impressão"
              className="max-h-[480px] mx-auto rounded transition-opacity duration-200"
            />
          )
        ) : (
          <span className="text-sm text-gray-400">Arquivo não encontrado</span>
        )}
        <Popover.Arrow className="fill-gray-800" />
      </Popover.Content>
    </Popover.Root>
  );
}
