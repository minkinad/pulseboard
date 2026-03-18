"use client";

import { motion } from "framer-motion";
import { GripVertical, Shrink, StretchHorizontal } from "lucide-react";

import { widgetSizeClassNames } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { WidgetLayoutItem } from "@/types/dashboard";

interface WidgetFrameProps {
  widget: WidgetLayoutItem;
  isDragging: boolean;
  style?: React.CSSProperties;
  attributes: object;
  listeners: object | undefined;
  onGrow: () => void;
  onShrink: () => void;
  children: React.ReactNode;
}

export function WidgetFrame({
  widget,
  isDragging,
  style,
  attributes,
  listeners,
  onGrow,
  onShrink,
  children,
}: WidgetFrameProps) {
  return (
    <motion.section
      layout
      style={style}
      className={cn(
        "surface-panel flex flex-col overflow-hidden p-5",
        widgetSizeClassNames[widget.size],
        isDragging && "border-accent/40 shadow-glow",
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xl font-semibold">{widget.title}</p>
          <p className="mt-1 text-sm text-foreground/65">{widget.description}</p>
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
