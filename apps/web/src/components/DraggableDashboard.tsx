"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Widget, getDefaultLayout, createWidget, WidgetType } from "@repo/core";
import { WidgetCard } from "./WidgetCard";

// Sortable widget wrapper
function SortableWidget({ widget }: { widget: Widget }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Widget content based on type
  const getWidgetContent = (type: WidgetType) => {
    switch (type) {
      case "schedule":
        return (
          <div>
            <p className="text-sm">📅 Today's Schedule</p>
            <p className="text-xs text-gray-500 mt-2">
              Your appointments will appear here
            </p>
          </div>
        );
      case "notes":
        return (
          <div>
            <p className="text-sm">📝 Quick Notes</p>
            <p className="text-xs text-gray-500 mt-2">Jot down your thoughts</p>
          </div>
        );
      case "journal":
        return (
          <div>
            <p className="text-sm">📖 Daily Journal</p>
            <p className="text-xs text-gray-500 mt-2">Write your daily entry</p>
          </div>
        );
      case "habits":
        return (
          <div>
            <p className="text-sm">✅ Habit Tracker</p>
            <p className="text-xs text-gray-500 mt-2">
              Track your daily habits
            </p>
          </div>
        );
      case "tracker":
        return (
          <div>
            <p className="text-sm">📊 Custom Tracker</p>
            <p className="text-xs text-gray-500 mt-2">
              Track anything you want
            </p>
          </div>
        );
      case "mood":
        return (
          <div>
            <p className="text-sm">😊 Mood Tracker</p>
            <p className="text-xs text-gray-500 mt-2">How are you feeling?</p>
          </div>
        );
      case "quote":
        return (
          <div>
            <p className="text-sm">💭 Daily Quote</p>
            <p className="text-xs text-gray-500 mt-2">
              "The journey of a thousand miles begins with one step"
            </p>
          </div>
        );
      case "goals":
        return (
          <div>
            <p className="text-sm">🎯 Goals</p>
            <p className="text-xs text-gray-500 mt-2">
              Your goals for this month
            </p>
          </div>
        );
      default:
        return <p>Widget</p>;
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <WidgetCard widget={widget}>{getWidgetContent(widget.type)}</WidgetCard>
    </div>
  );
}

export function DraggableDashboard() {
  const [widgets, setWidgets] = useState<Widget[]>(getDefaultLayout());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        // This is where you'd save to Supabase
        // saveLayoutToSupabase(arrayMove(items, oldIndex, newIndex));

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const availableWidgets: WidgetType[] = [
    "schedule",
    "notes",
    "journal",
    "habits",
    "tracker",
    "mood",
    "quote",
    "goals",
  ];
  const addedTypes = widgets.map((w) => w.type);
  const remainingWidgets = availableWidgets.filter(
    (type) => !addedTypes.includes(type)
  );

  const handleAddWidget = (type: WidgetType) => {
    const newWidget = createWidget(type);
    setWidgets([...widgets, newWidget]);
    // This is where you'd save to Supabase
    // saveLayoutToSupabase([...widgets, newWidget]);
  };

  const handleRemoveWidget = (widgetId: string) => {
    const updatedWidgets = widgets.filter((w) => w.id !== widgetId);
    setWidgets(updatedWidgets);
    // This is where you'd save to Supabase
    // saveLayoutToSupabase(updatedWidgets);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
        <p className="text-gray-600">Drag widgets to reorder them</p>
      </div>

      {/* Add Widget Buttons */}
      {remainingWidgets.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold mb-3">Add Widgets:</p>
          <div className="flex flex-wrap gap-2">
            {remainingWidgets.map((type) => (
              <button
                key={type}
                onClick={() => handleAddWidget(type)}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors capitalize"
              >
                + {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Draggable Widgets */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={widgets.map((w) => w.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {widgets.map((widget) => (
              <div key={widget.id} className="relative group">
                <SortableWidget widget={widget} />
                <button
                  onClick={() => handleRemoveWidget(widget.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {widgets.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>No widgets added yet. Add some widgets to get started!</p>
        </div>
      )}
    </div>
  );
}
