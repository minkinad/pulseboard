"use client";

import { motion } from "framer-motion";
import { GripVertical, Shrink, StretchHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import type { WidgetLayoutItem } from "@/types/dashboard";

interface WidgetFrameProps {
  widget: WidgetLayoutItem;
  isDragging: boolean;
  attributes: object;
  listeners: object | undefined;
  onGrow: () => void;
  onShrink: () => void;
  children: React.ReactNode;
}

export function WidgetFrame({
  widget,
  isDragging,
  attributes,
  listeners,
  onGrow,
  onShrink,
  children,
}: WidgetFrameProps) {
  return (
    <motion.section
      layout
      className={cn(
        "surface-panel flex h-full min-w-0 flex-col overflow-hidden p-4 sm:p-5",
        isDragging && "border-slate-300 bg-slate-50",
      )}
    >
      <div className="mb-4 flex min-w-0 flex-col gap-3 border-b border-stroke pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-slate-950 sm:text-lg">
            {widget.title}
          </p>
          <p className="mt-1 line-clamp-2 max-w-[56ch] text-sm leading-6 text-slate-500">
            {widget.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2">
          <button
            type="button"
            className="control-base icon-button shrink-0"
            onClick={onShrink}
            aria-label={`Shrink ${widget.title}`}
          >
            <Shrink className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="control-base icon-button shrink-0"
            onClick={onGrow}
            aria-label={`Resize ${widget.title}`}
          >
            <StretchHorizontal className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="control-base icon-button shrink-0 cursor-grab active:cursor-grabbing"
            aria-label={`Drag ${widget.title}`}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </motion.section>
  );
}
