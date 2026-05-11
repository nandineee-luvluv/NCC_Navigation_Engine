/**
 * NCC 2022 Structural Design Flowchart
 * Comprehensive 12-phase navigation map for structural engineers
 * Based on NCC 2022 Volume 1 & 2, ABCB Housing Provisions
 */

export interface FlowchartNode {
  id: string;
  title: string;
  type: "start" | "end" | "process" | "decision" | "document" | "warning" | "action";
  description: string;
  details?: string[];
  nccReference?: string[];
  standards?: string[];
  parentPhase?: string;
  children?: string[];
  nextNode?: string;
  color?: string;
}

export interface FlowchartPhase {
  id: string;
  title: string;
  description: string;
  nodes: FlowchartNode[];
  order: number;
}

export const comprehensiveFlowchartData: FlowchartPhase[] = [
  {
    id: "phase1",
    title: "① PROJECT SETUP",
    description: "Define project parameters and check state/territory variations",
    order: 1,
    nodes: [
      {
        id: "p1_start",
        title: "Start Project",
        type: "start",
        description: "Begin NCC 2022 structural design process",
        details: [
          "Client brief and site address",
          "Building purpose and occupancy type",
          "Number of storeys and gross floor area",
          "Preliminary structural concept (RC/Steel/Timber/Hybrid)",
        ],
        nccReference: ["NCC Part A1", "NCC Part A3", "NCC Part A6"],
        nextNode: "p1_params",
      },
      {
        id: "p1_params",
        title: "Define Project Parameters",
        type: "process",
        description: "Establish project scope and initial requirements",
        details: [
          "Client brief documentation",
          "Site address and jurisdiction",
          "Building occupancy classification",
          "Structural system concept",
        ],
        nccReference: ["NCC A1G1", "NCC A3G1"],
        nextNode: "p1_variations",
      },
      {
        id: "p1_variations",
        title: "Check State Variations",
        type: "decision",
        description: "Identify jurisdiction-specific NCC amendments",
        details: [
          "NT: B1D4, Cyclone Spec 4 amendments",
          "QLD: B1D3, B1D4, B1D6, B1P4 flood provisions",
          "SA: B1D4, B1D6, C2D2 amendments",
          "VIC: B1D6 variations",
          "WA: B1D3, B1D4, S4C1 amendments",
        ],
        nccReference: ["NCC A3G1", "NCC Volume Two", "Housing Provisions"],
        nextNode: "phase2_start",
      },
    ],
  },

  {
    id: "phase2",
    title: "② BUILDING CLASSIFICATION",
    description: "Determine building class (1-10) per NCC A6G1",
    order: 2,
    nodes: [
      {
        id: "p2_classify",
        title: "Determine Building Class",
        type: "decision",
        description: "Select primary building classification from NCC Table A6G1",
        details: [
          "Class 1a/1b: Single/attached dwellings, boarding houses ≤12 persons",
          "Class 2: Multi-unit residential (apartments/flats)",
          "Class 3: Transient accommodation (hotels, hostels)",
          "Class 4: Caretaker dwelling within Class 5-9",
          "Class 5: Office buildings",
          "Class 6: Retail/shops with public access",
          "Class 7a/7b: Carparks/Warehouses (7b: +0.15 kPa roof PV load)",
          "Class 8: Factory/industrial",
          "Class 9a/9b/9c: Health/Assembly/Aged Care (9a+9c: B1P4 flood applies)",
          "Class 10a/10b/10c: Non-habitable structures",
        ],
        nccReference: ["NCC A6G1", "NCC Table of Classifications"],
        nextNode: "p2_pathway",
      },
      {
        id: "p2_pathway",
        title: "Select Compliance Document",
        type: "decision",
        description: "Route to appropriate NCC volume based on building class",
        details: [
          "Class 1 & 10: NCC Volume Two + ABCB Housing Provisions",
          "Class 2-9: NCC Volume One (BCA)",
          "Multi-class: Apply most fire-resisting type from top-storey",
        ],
        nccReference: ["NCC C2D4(1)", "NCC C2D4(2)"],
        nextNode: "phase3_start",
      },
    ],
  },

  {
    id: "phase3",
    title: "③ COMPLIANCE PATHWAY",
    description: "Select compliance method: DTS, Performance, or Hybrid",
    order: 3,
    nodes: [
      {
        id: "p3_pathway",
        title: "Select Compliance Method",
        type: "decision",
        description: "Choose between Deemed-to-Satisfy, Performance Solution, or Hybrid",
        details: [
          "Deemed-to-Satisfy (DTS): Prescriptive compliance with tables",
          "Performance Solution: Identify performance requirements and assessment methods",
          "Hybrid Solution: DTS for some elements, Performance for others",
        ],
        nccReference: ["NCC A2G2", "NCC A2G3", "NCC A2G4"],
        nextNode: "p3_dts",
      },
      {
        id: "p3_dts",
        title: "DTS Path",
        type: "process",
        description: "Comply with prescriptive provisions B1D1-B1D6, C2D1-C2D15",
        details: [
          "Use standard tables and referenced standards",
          "Structural: B1D2 to B1D6",
          "Fire: C2D2 to C2D15, C3D2-C3D15, C4D2-C4D17",
        ],
        nccReference: ["NCC B1D1", "NCC B1D2-B1D6", "NCC C2D1"],
        nextNode: "phase4_start",
      },
      {
        id: "p3_perf",
        title: "Performance Solution Path",
        type: "process",
        description: "Identify and satisfy Performance Requirements with verification methods",
        details: [
          "Structural: B1P1, B1P2, B1P3, B1P4",
          "Fire: C1P1 to C1P9",
          "Use recognised Assessment Methods",
          "B1V1: Structural Reliability (β targets)",
          "B1V2: Structural Robustness (notional removal)",
        ],
        nccReference: ["NCC A2G4", "NCC B1V1", "NCC B1V2"],
        nextNode: "phase4_start",
      },
    ],
  },

  {
    id: "phase4",
    title: "④ IMPORTANCE LEVEL & DESIGN EVENTS",
    description: "Assign Importance Level (IL 1-4) and determine design events",
    order: 4,
    nodes: [
      {
        id: "p4_il",
        title: "Assign Importance Level",
        type: "decision",
        description: "Select IL from Table B1D3a (Vol 1) or Table 2.2.3a (Housing)",
        details: [
          "IL 1: Low hazard to life (rural outbuildings, minor structures)",
          "IL 2: Standard buildings (most residential + commercial)",
          "IL 3: Large crowd occupancy (stadiums, arenas, theatres)",
          "IL 4: Post-disaster essential (hospitals, emergency services)",
        ],
        nccReference: ["NCC Table B1D3a", "Housing Table 2.2.3a"],
        nextNode: "p4_events",
      },
      {
        id: "p4_events",
        title: "Design Event Probabilities",
        type: "process",
        description: "Annual probability of exceedance for each IL and action type",
        details: [
          "IL 1: Wind 1:100, Cyclone 1:200, Snow 1:100, EQ 1:250",
          "IL 2: Wind 1:500, Cyclone 1:500, Snow 1:150, EQ 1:500",
          "IL 3: Wind 1:1000, Cyclone 1:1000, Snow 1:200, EQ 1:1000",
          "IL 4: Wind 1:2000, Cyclone 1:2000, Snow 1:250, EQ 1:1500",
        ],
        nccReference: ["NCC B1D3a", "NCC B1D3b"],
        nextNode: "phase5_start",
      },
    ],
  },

  {
    id: "phase5",
    title: "⑤ STRUCTURAL ACTIONS (LOADS)",
    description: "Determine all design actions per B1D3 and AS/NZS 1170 series",
    order: 5,
    nodes: [
      {
        id: "p5_loads",
        title: "Determine Design Actions",
        type: "process",
        description: "Calculate all applicable loads and action effects",
        details: [
          "Permanent Actions (G): Self-weight + SDL per AS/NZS 1170.1",
          "Imposed Actions (Q): Live loads per AS/NZS 1170.1",
          "Wind Actions (W): AS/NZS 1170.2 (regions A-D, cyclone C-D)",
          "Earthquake Actions (Eq): AS 1170.4 (site class, hazard factor Z, ductility μ)",
          "Snow & Ice (S): AS/NZS 1170.3 (alpine/sub-alpine only)",
          "Other Actions: Liquid pressure, groundwater, earth pressure, thermal, etc.",
          "Flood Actions (B1P4): Hydrostatic, hydrodynamic, erosion, scour",
        ],
        nccReference: ["NCC B1D3", "NCC B1P1(2)", "AS/NZS 1170.0"],
        standards: [
          "AS/NZS 1170.1 (Permanent & Imposed)",
          "AS/NZS 1170.2 (Wind)",
          "AS/NZS 1170.3 (Snow)",
          "AS 1170.4 (Earthquake)",
          "ABCB Flood Standard",
        ],
        nextNode: "p5_combinations",
      },
      {
        id: "p5_combinations",
        title: "Load Combinations",
        type: "process",
        description: "Apply ULS and SLS load combinations per AS/NZS 1170.0",
        details: [
          "ULS: 1.35G",
          "ULS: 1.2G + 1.5Q",
          "ULS: 1.2G + 1.5ψc·Q",
          "ULS: 1.2G + Wu + ψc·Q",
          "ULS: 0.9G + Wu",
          "ULS: G + Eu (earthquake)",
          "SLS: G + ψs·Q (short-term)",
          "SLS: G + ψl·Q (long-term/quasi-permanent)",
        ],
        nccReference: ["AS/NZS 1170.0"],
        nextNode: "phase6_start",
      },
    ],
  },

  {
    id: "phase6",
    title: "⑥ MATERIAL STANDARDS & SYSTEM",
    description: "Select structural material and design system per B1D4",
    order: 6,
    nodes: [
      {
        id: "p6_material",
        title: "Select Structural Material",
        type: "decision",
        description: "Choose primary structural material(s)",
        details: [
          "Concrete: AS 3600 (reinforced/prestressed), AS 5146 (AAC)",
          "Steel: AS 4100 (hot-rolled), AS/NZS 4600 (cold-formed), NASH (residential)",
          "Timber: AS 1720.1 (general), AS 1684 (residential), AS 1720.5 (trusses)",
          "Masonry: AS 3700 (unreinforced, reinforced, veneer)",
          "Aluminium: AS/NZS 1664.1 (limit states) or 1664.2 (working stress)",
          "Piling: AS 2159 (design & installation)",
          "Composite: AS/NZS 2327 (steel-concrete)",
        ],
        nccReference: ["NCC B1D4"],
        standards: [
          "AS 3600",
          "AS 4100",
          "AS/NZS 4600",
          "AS 1720.1",
          "AS 1684.2/3/4",
          "AS 3700",
          "AS/NZS 1664.1",
          "AS 2159",
          "AS/NZS 2327",
        ],
        nextNode: "p6_system",
      },
      {
        id: "p6_system",
        title: "Select Lateral Resistance System",
        type: "decision",
        description: "Choose structural system for lateral loads",
        details: [
          "Moment Frame: RC/Steel/Composite",
          "Shear Wall: RC/Masonry/CLT",
          "Braced Frame: Steel/Timber",
          "Combined/Dual System: Multiple systems",
        ],
        nccReference: ["NCC B1F1"],
        nextNode: "phase7_start",
      },
    ],
  },

  {
    id: "phase7",
    title: "⑦ STRUCTURAL ANALYSIS",
    description: "Perform ULS and SLS analysis with strength, stability, and robustness checks",
    order: 7,
    nodes: [
      {
        id: "p7_analysis",
        title: "Structural Modelling & Analysis",
        type: "process",
        description: "Model structure and analyze under all load combinations",
        details: [
          "Resistance > most critical action effect (B1D2)",
          "Use 5th-percentile characteristic material properties (B1P2)",
          "All actions and load combinations from Phase 5",
          "Account for construction activity (B1P2(a))",
          "Account for differential settlement (B1P2(e))",
        ],
        nccReference: ["NCC B1D2", "NCC B1P1", "NCC B1P2"],
        nextNode: "p7_uls",
      },
      {
        id: "p7_uls",
        title: "ULS Checks",
        type: "process",
        description: "Verify strength, stability, load path, and robustness",
        details: [
          "Strength: φRn ≥ S* for all members and connections",
          "Stability: Global overturning, sliding, uplift, P-delta, buckling",
          "Load Path: Continuity from application to foundation",
          "Robustness: Notional removal of columns/beams/walls (B1V2)",
        ],
        nccReference: ["NCC B1P1(1)(a)-(d)", "NCC B1V2"],
        nextNode: "p7_sls",
      },
      {
        id: "p7_sls",
        title: "SLS Checks",
        type: "process",
        description: "Verify serviceability limits",
        details: [
          "Deflection: Material standard limits (typical span/300 live, span/500 finishes)",
          "Crack Control: Bar spacing, cover limits per material standard",
          "Vibration: AS/NZS 1170.1 Appendix acceleration limits",
          "Settlement: Differential settlement, creep, shrinkage, thermal, ground movement",
        ],
        nccReference: ["NCC B1P1(1)(b)", "NCC B1P2(e)"],
        nextNode: "p7_check",
      },
      {
        id: "p7_check",
        title: "Design Adequate?",
        type: "decision",
        description: "Verify all ULS and SLS requirements satisfied",
        details: [
          "If NO: Resize members/connections, revise system, return to Phase 6-7",
          "If YES: Proceed to Phase 8 (Fire Resistance)",
        ],
        nccReference: ["NCC B1P1(1)(a)-(d)"],
        nextNode: "phase8_start",
      },
    ],
  },

  {
    id: "phase8",
    title: "⑧ FIRE RESISTANCE DESIGN",
    description: "Determine FRL and design for fire per NCC Section C",
    order: 8,
    nodes: [
      {
        id: "p8_type",
        title: "Determine Construction Type",
        type: "decision",
        description: "Select Construction Type (A/B/C) per Table C2D2/C2D3",
        details: [
          "Type A: 4+ storeys - Highest fire resistance, non-combustible, sprinklers typical",
          "Type B: 2-3 storeys - Intermediate fire resistance",
          "Type C: 1-2 storeys - Lowest fire resistance, not all elements need FRL",
          "Multi-class: Apply most fire-resisting type from top-storey (C2D4(1))",
        ],
        nccReference: ["NCC Table C2D2", "NCC Table C2D3", "NCC C2D4"],
        nextNode: "p8_frl",
      },
      {
        id: "p8_frl",
        title: "Determine Required FRL",
        type: "process",
        description: "Establish Fire Resistance Level for each element",
        details: [
          "Format: Structural Adequacy / Integrity / Insulation (minutes)",
          "Examples: 90/90/90, 120/-/-, -/60/60, 240/240/240",
          "Refer Specification 1 tables and C2D2/C2D3",
          "Account for: fire load, spread potential, height, compartment size, evacuation time",
        ],
        nccReference: ["NCC C1P1", "NCC Specification 1"],
        nextNode: "p8_design",
      },
      {
        id: "p8_design",
        title: "Fire Protection Design",
        type: "process",
        description: "Apply fire protection measures to achieve FRL",
        details: [
          "Intumescent coating (structural steel)",
          "Spray-applied fire protection",
          "Board/encasement protection",
          "Increased concrete cover (AS 3600)",
          "Compartmentation and penetration sealing (Specification 13)",
          "Fire doors/windows/shutters (Specification 12)",
          "Upgrade sprinkler system if required",
        ],
        nccReference: ["NCC C1P1-C1P9", "NCC Specifications 1, 12, 13"],
        nextNode: "p8_check",
      },
      {
        id: "p8_check",
        title: "FRL Compliance Satisfied?",
        type: "decision",
        description: "Verify all fire resistance requirements met",
        details: [
          "If NO: Add/revise fire protection, upgrade construction type, return to Phase 8",
          "If YES: Proceed to Phase 9 (Geotechnical & Foundations)",
        ],
        nccReference: ["NCC C1P1-C1P9"],
        nextNode: "phase9_start",
      },
    ],
  },

  {
    id: "phase9",
    title: "⑨ GEOTECHNICAL & FOUNDATIONS",
    description: "Site investigation, soil classification, and foundation design per B1D4(g) & AS 2159",
    order: 9,
    nodes: [
      {
        id: "p9_investigation",
        title: "Site Investigation",
        type: "process",
        description: "Conduct geotechnical assessment",
        details: [
          "Geotechnical report and borehole logs",
          "Groundwater level and seasonal variation",
          "Contamination assessment where applicable",
          "Reactive soil classification (AS 2870: A-E-P)",
          "Swelling/shrinkage/freezing hazards",
          "Landslip and subsidence risk",
          "Termite risk assessment (AS 3660.1)",
        ],
        nccReference: ["NCC B1P1(2)(m)", "NCC B1P1(2)(o)"],
        standards: ["AS 2870", "AS 3660.1"],
        nextNode: "p9_hazard",
      },
      {
        id: "p9_hazard",
        title: "Hazard Assessment",
        type: "process",
        description: "Identify geotechnical and flood hazards",
        details: [
          "Reactive soil: AS 2870 classification and design approach",
          "Flood hazard (Class 2,3,4,9a,9c only): ABCB Flood Standard",
          "Elevation requirements and foundation flood resistance",
          "State variations: QLD/SA/VIC/WA (B1D6)",
        ],
        nccReference: ["NCC B1P4", "NCC B1D6", "ABCB Flood Standard"],
        nextNode: "p9_foundation",
      },
      {
        id: "p9_foundation",
        title: "Select Foundation Type",
        type: "decision",
        description: "Choose appropriate foundation system",
        details: [
          "Pad/Isolated Footings: Column point loads, bearing capacity, settlement",
          "Strip Footings: Wall loads, reactive soil design per AS 2870",
          "Raft Slab: Uniform loads, waffle/stiffened raft for reactive soil",
          "Pile Foundations: End-bearing/friction, negative skin friction, group effects",
          "Retaining Structures: Earth pressure, groundwater, AS 4678",
        ],
        nccReference: ["NCC B1D4(g)", "AS 2159", "AS 2870", "AS 4678"],
        nextNode: "p9_check",
      },
      {
        id: "p9_check",
        title: "Foundation Adequate?",
        type: "decision",
        description: "Verify bearing capacity, settlement, and stability",
        details: [
          "If NO: Revise type, depth, size; ground improvement; dewatering; preloading",
          "If YES: Proceed to Phase 10 (Connections & Detailing)",
        ],
        nccReference: ["AS 2159", "AS 2870"],
        nextNode: "phase10_start",
      },
    ],
  },

  {
    id: "phase10",
    title: "⑩ CONNECTIONS & DETAILING",
    description: "Design connections, hold-downs, and structural detailing",
    order: 10,
    nodes: [
      {
        id: "p10_connections",
        title: "Design Connections",
        type: "process",
        description: "Detail all structural connections per material standards",
        details: [
          "Steel: AS 4100 Section 9 (bolts), Section 12 (welds)",
          "Concrete: AS 3600 splices, anchorage, development length",
          "Timber: AS 1720.1 joints and connectors",
          "Masonry: AS 3700 ties and fixings",
          "Fastenings: AS 5216 (post-installed and cast-in)",
        ],
        nccReference: ["NCC B1D4"],
        standards: ["AS 4100", "AS 3600", "AS 1720.1", "AS 3700", "AS 5216"],
        nextNode: "p10_holddown",
      },
      {
        id: "p10_holddown",
        title: "Hold-Down & Tie-Down Design",
        type: "process",
        description: "Design for wind uplift and lateral load transfer",
        details: [
          "Wind uplift on roof structure (B1D3(c)(v))",
          "Cyclonic hold-down per Specification 4 (regions C/D)",
          "Roof-to-wall, wall-to-floor, floor-to-foundation load path",
          "Continuous load path for uplift forces",
        ],
        nccReference: ["NCC B1D3(c)(v)", "NCC Specification 4"],
        nextNode: "p10_robustness",
      },
      {
        id: "p10_robustness",
        title: "Robustness Detailing",
        type: "process",
        description: "Provide continuity and progressive collapse prevention",
        details: [
          "Continuity reinforcement and ties (B1V2)",
          "Catenary action provision",
          "Column tie forces",
          "Progressive collapse prevention measures",
        ],
        nccReference: ["NCC B1V2"],
        nextNode: "phase11_start",
      },
    ],
  },

  {
    id: "phase11",
    title: "⑪ VERIFICATION & DOCUMENTATION",
    description: "Design review, compliance check, and documentation package per A5G5/A5G6",
    order: 11,
    nodes: [
      {
        id: "p11_review",
        title: "Internal Design Review",
        type: "process",
        description: "Second engineer verification of design",
        details: [
          "All calculations checked by independent engineer",
          "Drawing/calculation cross-check",
          "Load path trace from roof to foundation",
          "All B1P1-B1P4, C1P1-C1P9 requirements verified",
        ],
        nccReference: ["NCC A5G5", "NCC A5G6"],
        nextNode: "p11_compliance",
      },
      {
        id: "p11_compliance",
        title: "NCC Compliance Check",
        type: "process",
        description: "Verify compliance with all applicable NCC provisions",
        details: [
          "DTS provisions: B1D2-B1D6, C2D2-C2D15",
          "Performance Solution: VM compliance documented",
          "State and Territory schedules checked",
          "Referenced standards edition confirmed",
        ],
        nccReference: ["NCC A5G5", "NCC A5G6"],
        nextNode: "p11_peer",
      },
      {
        id: "p11_peer",
        title: "Peer Review",
        type: "process",
        description: "Independent peer review of design",
        details: [
          "Mandatory for Performance Solutions",
          "Required for complex/high-risk/IL 3-4 buildings",
          "Recommended for post-disaster facilities",
          "B1V2 robustness assessment review",
        ],
        nccReference: ["NCC A5G5"],
        nextNode: "p11_docs",
      },
      {
        id: "p11_docs",
        title: "Prepare Documentation Package",
        type: "process",
        description: "Compile complete design documentation",
        details: [
          "Structural drawings (GA, sections, elevations, details, schedules)",
          "Design calculations (signed, dated, all actions, all checks)",
          "NCC Compliance Statement (Performance Requirements, DTS/PS, standards, state variations)",
          "Material Specifications (concrete, steel, timber, masonry grades)",
          "Engineer Certification (CPEng/NER registration, date)",
          "State/Territory Requirements (local council, development conditions)",
          "Structural Software Compliance (ABCB Protocol, geometric limits, version)",
        ],
        nccReference: ["NCC A5G5", "NCC A5G6"],
        nextNode: "phase12_start",
      },
    ],
  },

  {
    id: "phase12",
    title: "⑫ BUILDING APPROVAL & CONSTRUCTION",
    description: "Submit for approval and conduct construction inspections",
    order: 12,
    nodes: [
      {
        id: "p12_submit",
        title: "Submit to Building Authority",
        type: "process",
        description: "Lodge complete documentation package",
        details: [
          "Full documentation package per A5G5/A5G6",
          "NCC compliance statement",
          "Engineering certification by CPEng/NER",
          "Building Surveyor or Appropriate Authority (A2G1)",
        ],
        nccReference: ["NCC A2G1", "NCC A5G5"],
        nextNode: "p12_permit",
      },
      {
        id: "p12_permit",
        title: "Building Permit Issued",
        type: "process",
        description: "Receive building permit and commence construction",
        details: [
          "Permit conditions and requirements",
          "Construction commencement",
          "Structural inspections scheduled",
        ],
        nccReference: ["NCC A2G1"],
        nextNode: "p12_inspections",
      },
      {
        id: "p12_inspections",
        title: "Construction Inspections",
        type: "process",
        description: "Conduct mandatory structural inspections during construction",
        details: [
          "Foundation/Footing: Prior to concrete pour (dimensions, depth, reinforcement)",
          "Slab & Reinforcement: Mesh/bar layout, cover, PT cables, penetrations",
          "Structural Frame: Steel connections, timber frame, bracing, propping",
          "Connection & Tie-Down: Hold-down bolts, cyclonic ties, wall-to-floor connections",
          "Specialist: Pile testing, weld inspection, bolt pretension, concrete testing",
        ],
        nccReference: ["NCC A5G5"],
        nextNode: "p12_cert",
      },
      {
        id: "p12_cert",
        title: "Final Structural Certification",
        type: "document",
        description: "Confirm construction as designed and file with authority",
        details: [
          "Confirm construction as designed",
          "Note approved variations and RFIs",
          "Signed by Engineer of Record or Inspection Engineer",
          "Filed with building authority",
        ],
        nccReference: ["NCC A5G5"],
        nextNode: "p12_end",
      },
      {
        id: "p12_end",
        title: "NCC Compliance Achieved",
        type: "end",
        description: "Structural design complete and compliant with NCC 2022",
        details: [
          "All B1P1-B1P4 requirements satisfied",
          "All C1P1-C1P9 fire requirements satisfied",
          "Complete documentation and certification",
          "Building ready for occupancy",
        ],
        nccReference: ["NCC B1", "NCC C1"],
      },
    ],
  },
];

export const getPhaseById = (phaseId: string): FlowchartPhase | undefined => {
  return comprehensiveFlowchartData.find((phase) => phase.id === phaseId);
};

export const getNodeById = (nodeId: string): FlowchartNode | undefined => {
  for (const phase of comprehensiveFlowchartData) {
    const node = phase.nodes.find((n) => n.id === nodeId);
    if (node) return node;
  }
  return undefined;
};

export const getAllNodes = (): FlowchartNode[] => {
  return comprehensiveFlowchartData.flatMap((phase) => phase.nodes);
};
