"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useShallow } from "zustand/react/shallow";

import { WidgetFrame } from "@/components/dashboard/widget-frame";
import { BarChartWidget } from "@/components/widgets/bar-chart-widget";
import { LineChartWidget } from "@/components/widgets/line-chart-widget";
import { PieChartWidget } from "@/components/widgets/pie-chart-widget";
import { SummaryWidget } from "@/components/widgets/summary-widget";
import { TransactionsWidget } from "@/components/widgets/transactions-widget";
import { widgetSizeClassNames } from "@/lib/constants";
import { useDashboardStore } from "@/store/dashboard-store";
import type { DashboardComputation, WidgetLayoutItem } from "@/types/dashboard";

interface DashboardGridProps {
  data: DashboardComputation;
}

function SortableWidget({
  widget,
  data,
}: {
  widget: WidgetLayoutItem;
  data: DashboardComputation;
}) {
  const cycleWidgetSize = useDashboardStore((state) => state.cycleWidgetSize);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const content = (() => {
    switch (widget.kind) {
      case "summary":
        return (
          <SummaryWidget
            summary={data.summary}
            insight={data.insight}
            livePulse={data.livePulse}
          />
        );
      case "line":
        return <LineChartWidget series={data.lineSeries} />;
      case "bar":
        return <BarChartWidget series={data.barSeries} />;
      case "pie":
        return <PieChartWidget series={data.pieSeries} />;
      case "table":
        return <TransactionsWidget transactions={data.transactions} />;
      default:
        return null;
    }
  })();

  return (
    <div ref={setNodeRef} style={style} className={widgetSizeClassNames[widget.size]}>
      <WidgetFrame
        widget={widget}
        isDragging={isDragging}
        attributes={attributes}
        listeners={listeners}
        onGrow={() => cycleWidgetSize(widget.id, 1)}
        onShrink={() => cycleWidgetSize(widget.id, -1)}
      >
        {content}
      </WidgetFrame>
    </div>
  );
}

export function DashboardGrid({ data }: DashboardGridProps) {
  const { widgets, reorderWidgets } = useDashboardStore(
    useShallow((state) => ({
      widgets: state.widgets,
      reorderWidgets: state.reorderWidgets,
    })),
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    reorderWidgets(String(active.id), String(over.id));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={widgets.map((widget) => widget.id)} strategy={rectSortingStrategy}>
        <section className="grid grid-cols-12 gap-5">
          {widgets.map((widget) => (
            <SortableWidget key={widget.id} widget={widget} data={data} />
          ))}
        </section>
      </SortableContext>
    </DndContext>
  );
}
