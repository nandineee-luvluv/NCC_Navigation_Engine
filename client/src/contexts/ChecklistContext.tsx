import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

/**
 * Shared state management for flowchart and checklist
 * Enables bidirectional synchronization and navigation
 */

export interface ChecklistItemState {
  id: string;
  phaseId: string;
  completed: boolean;
}

interface ChecklistContextType {
  // Checklist state
  completedItems: Set<string>;
  toggleItem: (itemId: string) => void;
  isItemCompleted: (itemId: string) => boolean;
  getPhaseProgress: (phaseId: string) => { completed: number; total: number };
  
  // Navigation
  currentPhaseId: string;
  setCurrentPhaseId: (phaseId: string) => void;
  currentNodeId: string | null;
  setCurrentNodeId: (nodeId: string | null) => void;
  
  // Sync between pages
  jumpToChecklist: (nodeId: string) => void;
  jumpToFlowchart: (itemId: string) => void;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

export const ChecklistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [currentPhaseId, setCurrentPhaseId] = useState("phase1");
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);

  const toggleItem = useCallback((itemId: string) => {
    setCompletedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const isItemCompleted = useCallback(
    (itemId: string) => completedItems.has(itemId),
    [completedItems]
  );

  const getPhaseProgress = useCallback(
    (phaseId: string) => {
      // This will be populated by the component that knows the total count
      // For now, return a placeholder
      return { completed: 0, total: 0 };
    },
    []
  );

  const jumpToChecklist = useCallback((nodeId: string) => {
    setCurrentNodeId(nodeId);
    // Navigate to checklist page
    window.location.hash = `/checklist?node=${nodeId}`;
  }, []);

  const jumpToFlowchart = useCallback((itemId: string) => {
    setCurrentNodeId(itemId);
    // Navigate to flowchart page
    window.location.hash = `/enhanced-flowchart?node=${itemId}`;
  }, []);

  const value: ChecklistContextType = {
    completedItems,
    toggleItem,
    isItemCompleted,
    getPhaseProgress,
    currentPhaseId,
    setCurrentPhaseId,
    currentNodeId,
    setCurrentNodeId,
    jumpToChecklist,
    jumpToFlowchart,
  };

  return (
    <ChecklistContext.Provider value={value}>
      {children}
    </ChecklistContext.Provider>
  );
};

export const useChecklist = () => {
  const context = useContext(ChecklistContext);
  if (!context) {
    throw new Error("useChecklist must be used within ChecklistProvider");
  }
  return context;
};
