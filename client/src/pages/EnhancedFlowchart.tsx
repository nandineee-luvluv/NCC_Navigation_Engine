import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Home, Download, CheckCircle2, Circle } from "lucide-react";
import { useLocation } from "wouter";
import { comprehensiveFlowchartData, getPhaseById, getNodeById } from "@/data/comprehensiveFlowchart";

/**
 * Enhanced Interactive Flowchart Component
 * Design Philosophy: Modern Minimalist Flow
 * - Clean hierarchical phase-based navigation
 * - Expandable sub-nodes with detailed information
 * - Professional color coding by node type
 * - Smooth transitions and responsive design
 */

export default function EnhancedFlowchart() {
  const [, setLocation] = useLocation();
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
        return "📄";
      default:
        return "●";
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

  const nextPhase = () => {
    if (currentPhaseIndex < comprehensiveFlowchartData.length - 1) {
      setCurrentPhaseIndex(currentPhaseIndex + 1);
      setSelectedNode(null);
      setExpandedNodes(new Set());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevPhase = () => {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex(currentPhaseIndex - 1);
      setSelectedNode(null);
      setExpandedNodes(new Set());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPhase = (index: number) => {
    setCurrentPhaseIndex(index);
    setSelectedNode(null);
    setExpandedNodes(new Set());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/")}
                className="hover:bg-slate-100"
              >
                <Home className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">NCC 2022 Structural Design</h1>
                <p className="text-sm text-slate-600">Phase {currentPhaseIndex + 1} of {comprehensiveFlowchartData.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
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
            {comprehensiveFlowchartData.map((phase, index) => (
              <Button
                key={phase.id}
                variant={currentPhaseIndex === index ? "default" : "outline"}
                size="sm"
                onClick={() => goToPhase(index)}
                className={`whitespace-nowrap ${
                  currentPhaseIndex === index
                    ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                    : "hover:border-cyan-400"
                }`}
              >
                {index + 1}. {phase.title.split(" ")[1]}
              </Button>
            ))}
          </div>
        </div>

        {/* Nodes Display */}
        <div className="space-y-4 mb-8">
          {currentPhase.nodes.map((node, index) => (
            <div key={node.id}>
              {/* Node Card */}
              <Card
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-l-4 ${
                  selectedNode === node.id
                    ? "border-l-cyan-500 shadow-lg bg-cyan-50"
                    : "border-l-slate-200 hover:border-l-cyan-300"
                }`}
                onClick={() => toggleNodeExpanded(node.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`${getNodeColor(
                          node.type
                        )} w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0 mt-1`}
                      >
                        {getNodeIcon(node.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{node.title}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {node.type}
                          </Badge>
                        </div>
                        <CardDescription>{node.description}</CardDescription>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${
                        expandedNodes.has(node.id) ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </CardHeader>

                {/* Expanded Content */}
                {expandedNodes.has(node.id) && (
                  <CardContent className="space-y-4 border-t border-slate-200 pt-4">
                    {/* Details */}
                    {node.details && node.details.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Details:</h4>
                        <ul className="space-y-1">
                          {node.details.map((detail, i) => (
                            <li key={i} className="text-sm text-slate-700 flex gap-2">
                              <span className="text-cyan-600 font-bold">▸</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* NCC References */}
                    {node.nccReference && node.nccReference.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">NCC References:</h4>
                        <div className="flex flex-wrap gap-2">
                          {node.nccReference.map((ref, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {ref}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Standards */}
                    {node.standards && node.standards.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Standards:</h4>
                        <div className="flex flex-wrap gap-2">
                          {node.standards.map((std, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {std}
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
                <div className="flex justify-center py-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-slate-300 to-slate-200 rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Phase Navigation Buttons */}
        <div className="flex justify-between items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={prevPhase}
            disabled={currentPhaseIndex === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Phase
          </Button>

          <div className="text-sm text-slate-600">
            Phase {currentPhaseIndex + 1} of {comprehensiveFlowchartData.length}
          </div>

          <Button
            onClick={nextPhase}
            disabled={currentPhaseIndex === comprehensiveFlowchartData.length - 1}
            className="gap-2 bg-cyan-600 hover:bg-cyan-700"
          >
            Next Phase
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Overall Progress</h3>
          <div className="space-y-3">
            {comprehensiveFlowchartData.map((phase, index) => (
              <div key={phase.id} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-all ${
                    index < currentPhaseIndex
                      ? "bg-emerald-500 text-white"
                      : index === currentPhaseIndex
                      ? "bg-cyan-500 text-white ring-2 ring-cyan-300"
                      : "bg-slate-200 text-slate-600"
                  }`}
                  onClick={() => goToPhase(index)}
                >
                  {index < currentPhaseIndex ? "✓" : index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{phase.title}</p>
                  <p className="text-xs text-slate-500">{phase.nodes.length} steps</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <p className="text-sm text-slate-600 text-center">
            NCC 2022 Structural Design Navigation • Based on NCC 2022 Volume 1 & 2 • Australian Standards Referenced
          </p>
        </div>
      </footer>
    </div>
  );
}
