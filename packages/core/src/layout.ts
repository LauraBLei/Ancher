// Layout and widget types
export type WidgetType =
  | "schedule"
  | "notes"
  | "journal"
  | "tracker"
  | "habits"
  | "mood"
  | "quote"
  | "goals";

export interface Widget {
  id: string;
  type: WidgetType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  visible: boolean;
  settings?: Record<string, any>; // Widget-specific settings
}

export interface UserLayout {
  userId: string;
  widgets: Widget[];
  updatedAt: string;
}

// Default layout for new users
export const getDefaultLayout = (): Widget[] => {
  return [
    {
      id: "widget-1",
      type: "schedule",
      position: { x: 0, y: 0 },
      size: { width: 2, height: 2 },
      visible: true,
    },
    {
      id: "widget-2",
      type: "notes",
      position: { x: 2, y: 0 },
      size: { width: 2, height: 2 },
      visible: true,
    },
    {
      id: "widget-3",
      type: "journal",
      position: { x: 0, y: 2 },
      size: { width: 2, height: 2 },
      visible: true,
    },
    {
      id: "widget-4",
      type: "habits",
      position: { x: 2, y: 2 },
      size: { width: 2, height: 2 },
      visible: true,
    },
  ];
};

// Generate a new widget with default settings
export const createWidget = (type: WidgetType): Widget => {
  return {
    id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    position: { x: 0, y: 0 },
    size: { width: 2, height: 2 },
    visible: true,
  };
};

// Update widget position
export const updateWidgetPosition = (
  widgets: Widget[],
  widgetId: string,
  position: { x: number; y: number }
): Widget[] => {
  return widgets.map((widget) =>
    widget.id === widgetId ? { ...widget, position } : widget
  );
};

// Toggle widget visibility
export const toggleWidgetVisibility = (
  widgets: Widget[],
  widgetId: string
): Widget[] => {
  return widgets.map((widget) =>
    widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
  );
};

// Remove widget
export const removeWidget = (widgets: Widget[], widgetId: string): Widget[] => {
  return widgets.filter((widget) => widget.id !== widgetId);
};

// Add widget
export const addWidget = (widgets: Widget[], widget: Widget): Widget[] => {
  return [...widgets, widget];
};

// Supabase save/load functions (to be used with Supabase client)
export interface LayoutStorage {
  saveLayout: (userId: string, widgets: Widget[]) => Promise<{ error: any }>;
  loadLayout: (userId: string) => Promise<Widget[]>;
}
