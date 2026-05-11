import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { useChecklist } from "@/contexts/ChecklistContext";
import { comprehensiveFlowchartData } from "@/data/comprehensiveFlowchart";

/**
 * Unified View Component
 * Displays flowchart and checklist side-by-side with full interactivity
 * Synchronized progress tracking and bidirectional navigation
 */

export default function UnifiedView() {
  const [, setLocation] = useLocation();
  const {
    completedItems,
    toggleItem,
    isItemCompleted,
    currentPhaseId,
    setCurrentPhaseId,
    setCurrentNodeId,
  } = useChecklist();

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const currentPhase = comprehensiveFlowchartData[currentPhaseIndex];

  const getNodeColor = (type: string): string => {
    switch (type) {
      case "start":
        return "bg-emerald-500";
      case "end":
        return "bg-red-500";
      case "decision":
        return "bg-cyan-500";
      case "process":
        return "bg-purple-500";
      case "document":
        return "bg-blue-500";
      case "warning":
        return "bg-amber-500";
      case "action":
        return "bg-indigo-500";
      default:
        return "bg-slate-500";
    }
  };

  const getNodeIcon = (type: string): string => {
    switch (type) {
      case "start":
        return "◆";
      case "end":
        return "■";
      case "decision":
        return "◇";
      case "process":
        return "▭";
      case "document":
        return "▢";
      case "warning":
        return "⚠";
      case "action":
        return "→";
      default:
        return "•";
    }
  };

  const toggleNodeExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
    setSelectedNode(nodeId);
  };

  const goToPhase = (index: number) => {
    setCurrentPhaseIndex(index);
    setCurrentPhaseId(comprehensiveFlowchartData[index].id);
    setExpandedNodes(new Set());
    setSelectedNode(null);
  };

  const prevPhase = () => {
    if (currentPhaseIndex > 0) {
      goToPhase(currentPhaseIndex - 1);
    }
  };

  const nextPhase = () => {
    if (currentPhaseIndex < comprehensiveFlowchartData.length - 1) {
      goToPhase(currentPhaseIndex + 1);
    }
  };

  const phaseStats = useMemo(() => {
    const stats: Record<string, { total: number; completed: number }> = {};
    comprehensiveFlowchartData.forEach((phase) => {
      const total = phase.nodes.length;
      const completed = phase.nodes.filter((node) => isItemCompleted(node.id))
        .length;
      stats[phase.id] = { total, completed };
    });
    return stats;
  }, [isItemCompleted]);

  const overallStats = useMemo(() => {
    let total = 0;
    let completed = 0;
    Object.values(phaseStats).forEach((stat) => {
      total += stat.total;
      completed += stat.completed;
    });
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [phaseStats]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Unified Design View</h1>
              <p className="text-sm text-slate-600">
                Flowchart & Checklist Synchronized • Phase {currentPhaseIndex + 1} of{" "}
                {comprehensiveFlowchartData.length}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Overall Progress</p>
              <p className="text-2xl font-bold text-cyan-600">
                {overallStats.percentage}%
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Phase Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
              {currentPhaseIndex + 1}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">{currentPhase.title}</h2>
              <p className="text-slate-600 mt-1">{currentPhase.description}</p>
            </div>
          </div>
        </div>

        {/* Phase Navigation Tabs */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-min">
            {comprehensiveFlowchartData.map((phase, index) => {
              const phaseStat = phaseStats[phase.id];
              const isComplete = phaseStat.completed === phaseStat.total && phaseStat.total > 0;
              return (
                <Button
                  key={phase.id}
                  variant={currentPhaseIndex === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPhase(index)}
                  className={`whitespace-nowrap ${
                    currentPhaseIndex === index
                      ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                      : isComplete
                      ? "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                      : "hover:border-cyan-400"
                  }`}
                >
                  {isComplete ? "✓" : index + 1}. {phase.title.split(" ")[1]}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Phase Progress Card */}
        <Card className="mb-8 bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Phase Progress</CardTitle>
              <Badge className="bg-emerald-600">
                {phaseStats[currentPhase.id].completed}/{phaseStats[currentPhase.id].total}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full transition-all duration-300"
                style={{
                  width: `${
                    phaseStats[currentPhase.id].total > 0
                      ? (phaseStats[currentPhase.id].completed /
                          phaseStats[currentPhase.id].total) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Two-Column Layout: Flowchart + Checklist */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column: Flowchart */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                ▶
              </div>
              <h3 className="text-lg font-bold text-slate-900">Workflow Steps</h3>
            </div>

            {currentPhase.nodes.map((node, index) => {
              const isCompleted = isItemCompleted(node.id);
              return (
                <div key={node.id}>
                  {/* Node Card */}
                  <Card
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-l-4 ${
                      selectedNode === node.id
                        ? "border-l-cyan-500 shadow-lg bg-cyan-50"
                        : isCompleted
                        ? "border-l-emerald-500 bg-emerald-50"
                        : "border-l-slate-200 hover:border-l-cyan-300"
                    }`}
                    onClick={() => toggleNodeExpanded(node.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Checkbox
                            checked={isCompleted}
                            onCheckedChange={() => toggleItem(node.id)}
                            className="mt-3 flex-shrink-0"
                          />
                          <div
                            className={`${getNodeColor(
                              node.type
                            )} w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0 mt-1 relative`}
                          >
                            {getNodeIcon(node.type)}
                            {isCompleted && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                ✓
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-base">{node.title}</CardTitle>
                              <Badge variant="outline" className="text-xs">
                                {node.type}
                              </Badge>
                              {isCompleted && (
                                <Badge className="text-xs bg-emerald-500">Done</Badge>
                              )}
                            </div>
                            <CardDescription className="text-sm">
                              {node.description}
                            </CardDescription>
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                            expandedNodes.has(node.id) ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </CardHeader>

                    {expandedNodes.has(node.id) && (
                      <CardContent className="space-y-3 border-t border-slate-200 pt-3">
                        {node.details && (
                          <div>
                            <h4 className="font-semibold text-slate-900 text-sm mb-2">
                              Details:
                            </h4>
                            <ul className="space-y-1">
                              {node.details.map((detail, i) => (
                                <li key={i} className="text-sm text-slate-700 flex gap-2">
                                  <span className="text-cyan-600">▸</span>
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {node.nccReference && node.nccReference.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-slate-900 text-sm mb-2">
                              NCC References:
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {node.nccReference.map((ref, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {ref}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>

                  {/* Connection Line */}
                  {index < currentPhase.nodes.length - 1 && (
                    <div className="flex justify-center py-1">
                      <div className="w-1 h-4 bg-gradient-to-b from-slate-300 to-slate-200 rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Completion Progress (Simplified) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                ✓
              </div>
              <h3 className="text-lg font-bold text-slate-900">Completion Progress</h3>
            </div>

            {/* Overall Progress with Detailed Phase Breakdown */}
            <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Overall Progress</CardTitle>
                  <Badge className="bg-cyan-600">
                    {overallStats.completed}/{overallStats.total}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full transition-all duration-300"
                      style={{
                        width: `${overallStats.percentage}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-2 text-center">{overallStats.percentage}% Complete</p>
                </div>

                {/* Individual Phase Progress */}
                <div className="space-y-3 pt-4 border-t border-cyan-200">
                  {comprehensiveFlowchartData.map((phase, index) => {
                    const stat = phaseStats[phase.id];
                    const percentage = stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0;
                    const isComplete = stat.completed === stat.total && stat.total > 0;
                    return (
                      <div key={phase.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-xs font-bold text-slate-600 w-5">{index + 1}.</span>
                            <span className="text-sm font-medium text-slate-900 truncate">
                              {phase.title}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs ml-2 ${
                              isComplete
                                ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                : "bg-slate-100 text-slate-700 border-slate-300"
                            }`}
                          >
                            {stat.completed}/{stat.total}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                isComplete
                                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                                  : "bg-gradient-to-r from-cyan-500 to-blue-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-600 w-8 text-right">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Phase Navigation Buttons */}
        <div className="flex justify-between items-center gap-4 mb-8 pt-6 border-t border-slate-200">
          <Button
            variant="outline"
            onClick={prevPhase}
            disabled={currentPhaseIndex === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Phase
          </Button>

          <Button
            onClick={nextPhase}
            disabled={currentPhaseIndex === comprehensiveFlowchartData.length - 1}
            className="gap-2 bg-cyan-600 hover:bg-cyan-700"
          >
            Next Phase
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <p className="text-sm text-slate-600 text-center">
            NCC 2022 Unified Design View • Synchronized Flowchart & Checklist
          </p>
        </div>
      </footer>
    </div>
  );
}
