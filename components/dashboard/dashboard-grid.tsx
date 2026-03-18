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

import { WidgetFrame } from "@/components/dashboard/widget-frame";
import { BarChartWidget } from "@/components/widgets/bar-chart-widget";
import { LineChartWidget } from "@/components/widgets/line-chart-widget";
import { PieChartWidget } from "@/components/widgets/pie-chart-widget";
import { SummaryWidget } from "@/components/widgets/summary-widget";
import { TransactionsWidget } from "@/components/widgets/transactions-widget";
import { widgetSizeClassNames } from "@/lib/constants";
import { useDashboardStore } from "@/store/dashboard-store";
import type { DashboardComputation, ThemeMode, WidgetLayoutItem } from "@/types/dashboard";

interface DashboardGridProps {
  theme: ThemeMode;
  data: DashboardComputation;
}

function SortableWidget({
  widget,
  theme,
  data,
}: {
  widget: WidgetLayoutItem;
  theme: ThemeMode;
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
        return <LineChartWidget series={data.lineSeries} theme={theme} />;
      case "bar":
        return <BarChartWidget series={data.barSeries} theme={theme} />;
      case "pie":
        return <PieChartWidget series={data.pieSeries} theme={theme} />;
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

export function DashboardGrid({ theme, data }: DashboardGridProps) {
  const widgets = useDashboardStore((state) => state.widgets);
  const reorderWidgets = useDashboardStore((state) => state.reorderWidgets);

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
            <SortableWidget key={widget.id} widget={widget} theme={theme} data={data} />
          ))}
        </section>
      </SortableContext>
    </DndContext>
  );
}
