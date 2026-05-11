export interface FlowchartNode {
  id: string;
  type: "start" | "end" | "decision" | "process" | "action";
  label: string;
  description: string;
  nccRef?: string;
  asStandard?: string;
  color: string;
  icon?: string;
  children?: string[];
}

export const flowchartNodes: Record<string, FlowchartNode> = {
  start: {
    id: "start",
    type: "start",
    label: "Start",
    description: "Begin NCC structural design process",
    color: "#10b981",
    icon: "▶",
    children: ["building_class"]
  },
  building_class: {
    id: "building_class",
    type: "decision",
    label: "Building Classification",
    description: "Determine building class (1-10) according to Part A6",
    nccRef: "Part A6",
    color: "#06b6d4",
    children: ["importance_level"]
  },
  importance_level: {
    id: "importance_level",
    type: "decision",
    label: "Importance Level",
    description: "Assign importance level (1-4) for design events",
    nccRef: "Table B1D3a",
    color: "#06b6d4",
    children: ["location_hazards"]
  },
  location_hazards: {
    id: "location_hazards",
    type: "decision",
    label: "Identify Hazards",
    description: "Determine applicable environmental hazards (Wind, Earthquake, Snow, Flood)",
    nccRef: "B1D3",
    color: "#06b6d4",
    children: ["site_classification"]
  },
  site_classification: {
    id: "site_classification",
    type: "process",
    label: "Site Classification",
    description: "Determine site classification (A, S, M, H, E)",
    nccRef: "AS 2870",
    asStandard: "AS 2870-2011",
    color: "#8b5cf6",
    children: ["flood_check"]
  },
  flood_check: {
    id: "flood_check",
    type: "decision",
    label: "Flood Risk?",
    description: "Is site in flood hazard area?",
    nccRef: "B1P4, B1D6",
    color: "#06b6d4",
    children: ["termite_check"]
  },
  termite_check: {
    id: "termite_check",
    type: "decision",
    label: "Termite Risk?",
    description: "Assess termite management requirements",
    nccRef: "B1D4(i), AS 3660.1",
    color: "#06b6d4",
    children: ["action_determination"]
  },
  action_determination: {
    id: "action_determination",
    type: "process",
    label: "Design Actions",
    description: "Calculate all applicable design actions (G, Q, W, E, S)",
    nccRef: "B1D3",
    color: "#8b5cf6",
    children: ["material_selection"]
  },
  material_selection: {
    id: "material_selection",
    type: "decision",
    label: "Select Material",
    description: "Choose structural material: Concrete, Steel, Timber, Masonry, or Composite",
    nccRef: "B1D4",
    color: "#06b6d4",
    children: ["structural_design"]
  },
  structural_design: {
    id: "structural_design",
    type: "process",
    label: "Structural Design",
    description: "Design and verify structure according to material standard",
    nccRef: "B1P1-B1P4",
    color: "#8b5cf6",
    children: ["fire_resistance"]
  },
  fire_resistance: {
    id: "fire_resistance",
    type: "process",
    label: "Fire Resistance",
    description: "Design fire resistance rating (FRL) if required",
    nccRef: "Section C",
    color: "#ef4444",
    children: ["verification"]
  },
  verification: {
    id: "verification",
    type: "decision",
    label: "Verification",
    description: "Verify all requirements met: Reliability, Resistance, Robustness",
    nccRef: "B1P1-B1V2",
    color: "#06b6d4",
    children: ["documentation"]
  },
  documentation: {
    id: "documentation",
    type: "process",
    label: "Documentation",
    description: "Prepare design documentation and compliance statement",
    nccRef: "B1D1",
    color: "#8b5cf6",
    children: ["end"]
  },
  end: {
    id: "end",
    type: "end",
    label: "Complete",
    description: "Design process complete",
    color: "#10b981",
    icon: "✓"
  }
};

export const flowchartOrder = [
  "start",
  "building_class",
  "importance_level",
  "location_hazards",
  "site_classification",
  "flood_check",
  "termite_check",
  "action_determination",
  "material_selection",
  "structural_design",
  "fire_resistance",
  "verification",
  "documentation",
  "end"
];
