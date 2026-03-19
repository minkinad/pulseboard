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
        "surface-panel flex h-full flex-col overflow-hidden px-5 py-5 sm:px-6 sm:py-6",
        isDragging && "border-slate-300 bg-slate-50",
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-stroke pb-4">
        <div>
          <p className="text-xl font-semibold text-slate-950">{widget.title}</p>
          <p className="mt-1 max-w-[48ch] text-sm leading-6 text-slate-500">
            {widget.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="control-base px-3"
            onClick={onShrink}
            aria-label={`Shrink ${widget.title}`}
          >
            <Shrink className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="control-base px-3"
            onClick={onGrow}
            aria-label={`Resize ${widget.title}`}
          >
            <StretchHorizontal className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="control-base cursor-grab px-3 active:cursor-grabbing"
            aria-label={`Drag ${widget.title}`}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1">{children}</div>
    </motion.section>
  );
}
