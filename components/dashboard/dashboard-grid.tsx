"use client";

import { useEffect, useState } from "react";

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
import { WidgetEmptyState } from "@/components/dashboard/widget-empty-state";
import { BarChartWidget } from "@/components/widgets/bar-chart-widget";
import { LineChartWidget } from "@/components/widgets/line-chart-widget";
import { PieChartWidget } from "@/components/widgets/pie-chart-widget";
import { SummaryWidget } from "@/components/widgets/summary-widget";
import { TransactionsWidget } from "@/components/widgets/transactions-widget";
import { widgetSizeClassNames } from "@/lib/constants";
import { useDashboardStore } from "@/store/dashboard-store";
import type { DashboardComputation, WidgetKind, WidgetLayoutItem } from "@/types/dashboard";

interface DashboardGridProps {
  data: DashboardComputation;
}

const widgetRenderers: Record<WidgetKind, (data: DashboardComputation) => React.ReactNode> = {
  summary: (data) => (
    <SummaryWidget summary={data.summary} insight={data.insight} livePulse={data.livePulse} />
  ),
  line: (data) => <LineChartWidget series={data.lineSeries} />,
  bar: (data) => <BarChartWidget series={data.barSeries} />,
  pie: (data) => <PieChartWidget series={data.pieSeries} />,
  table: (data) => <TransactionsWidget transactions={data.transactions} />,
};

function renderWidgetContent(widget: WidgetLayoutItem, data: DashboardComputation) {
  const renderer = widgetRenderers[widget.kind];

  if (!renderer) {
    return (
      <WidgetEmptyState
        title="Widget unavailable"
        description="This widget type is not registered in the current dashboard build."
      />
    );
  }

  return renderer(data);
}

function StaticWidget({
  widget,
  data,
}: {
  widget: WidgetLayoutItem;
  data: DashboardComputation;
}) {
  return (
    <div className={widgetSizeClassNames[widget.size]}>
      <WidgetFrame
        widget={widget}
        isDragging={false}
        attributes={{}}
        listeners={undefined}
        onGrow={() => undefined}
        onShrink={() => undefined}
      >
        {renderWidgetContent(widget, data)}
      </WidgetFrame>
    </div>
  );
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
        {renderWidgetContent(widget, data)}
      </WidgetFrame>
    </div>
  );
}

export function DashboardGrid({ data }: DashboardGridProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { widgets, reorderWidgets } = useDashboardStore(
    useShallow((state) => ({
      widgets: state.widgets,
      reorderWidgets: state.reorderWidgets,
    })),
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  if (!isMounted) {
    return (
      <section className="grid grid-cols-12 items-stretch gap-4">
        {widgets.map((widget) => (
          <StaticWidget key={widget.id} widget={widget} data={data} />
        ))}
      </section>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={widgets.map((widget) => widget.id)} strategy={rectSortingStrategy}>
        <section className="grid grid-cols-12 items-stretch gap-4">
          {widgets.map((widget) => (
            <SortableWidget key={widget.id} widget={widget} data={data} />
          ))}
        </section>
      </SortableContext>
    </DndContext>
  );
}
