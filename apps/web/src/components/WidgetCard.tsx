"use client";

import { Widget } from "@repo/core";

interface WidgetCardProps {
  widget: Widget;
  children: React.ReactNode;
}

export function WidgetCard({ widget, children }: WidgetCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 cursor-move hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold capitalize">{widget.type}</h3>
        <span className="text-xs text-gray-500">Drag to move</span>
      </div>
      <div className="text-gray-700">{children}</div>
    </div>
  );
}
