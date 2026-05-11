import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Download, CheckCircle2, Circle, FileText } from "lucide-react";
import { useLocation } from "wouter";
import { comprehensiveFlowchartData } from "@/data/comprehensiveFlowchart";

/**
 * Interactive Design Checklist Component
 * Allows engineers to track completion of all NCC requirements
 * Includes export to PDF functionality
 */

interface ChecklistItem {
  id: string;
  phaseId: string;
  nodeId: string;
  title: string;
  description: string;
  completed: boolean;
  nccReferences: string[];
}

export default function DesignChecklist() {
  const [, setLocation] = useLocation();
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const items: ChecklistItem[] = [];
    comprehensiveFlowchartData.forEach((phase) => {
      phase.nodes.forEach((node) => {
        items.push({
          id: node.id,
          phaseId: phase.id,
          nodeId: node.id,
          title: node.title,
          description: node.description,
          completed: false,
          nccReferences: node.nccReference || [],
        });
      });
    });
    return items;
  });

  const [filterPhase, setFilterPhase] = useState<string>("all");

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const togglePhase = (phaseId: string) => {
    const phaseItems = checklist.filter((item) => item.phaseId === phaseId);
    const allCompleted = phaseItems.every((item) => item.completed);

    setChecklist((prev) =>
      prev.map((item) =>
        item.phaseId === phaseId ? { ...item, completed: !allCompleted } : item
      )
    );
  };

  const filteredItems = useMemo(() => {
    if (filterPhase === "all") return checklist;
    return checklist.filter((item) => item.phaseId === filterPhase);
  }, [checklist, filterPhase]);

  const stats = useMemo(() => {
    const total = checklist.length;
    const completed = checklist.filter((item) => item.completed).length;
    const percentage = Math.round((completed / total) * 100);
    return { total, completed, percentage };
  }, [checklist]);

  const phaseStats = useMemo(() => {
    const stats: Record<string, { total: number; completed: number }> = {};
    comprehensiveFlowchartData.forEach((phase) => {
      const phaseItems = checklist.filter((item) => item.phaseId === phase.id);
      stats[phase.id] = {
        total: phaseItems.length,
        completed: phaseItems.filter((item) => item.completed).length,
      };
    });
    return stats;
  }, [checklist]);

  const exportToPDF = () => {
    const content = generatePDFContent();
    const element = document.createElement("div");
    element.innerHTML = content;
    element.style.display = "none";
    document.body.appendChild(element);

    window.print();
    document.body.removeChild(element);
  };

  const generatePDFContent = (): string => {
    const completedItems = checklist.filter((item) => item.completed);
    const incompletedItems = checklist.filter((item) => !item.completed);

    let html = `
      <html>
        <head>
          <title>NCC 2022 Design Checklist</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1a3a5c; border-bottom: 3px solid #0d9488; padding-bottom: 10px; }
            h2 { color: #0d9488; margin-top: 20px; }
            .summary { background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .phase-section { page-break-inside: avoid; margin: 20px 0; }
            .checklist-item { margin: 10px 0; padding: 10px; border-left: 4px solid #0d9488; }
            .completed { background: #f0fdf4; }
            .incomplete { background: #fef3c7; }
            .checkbox { display: inline-block; width: 20px; height: 20px; margin-right: 10px; }
            .reference { font-size: 0.9em; color: #666; margin-top: 5px; }
          </style>
        </head>
        <body>
          <h1>NCC 2022 Structural Design Checklist</h1>
          <div class="summary">
            <p><strong>Total Tasks:</strong> ${stats.total}</p>
            <p><strong>Completed:</strong> ${stats.completed} (${stats.percentage}%)</p>
            <p><strong>Remaining:</strong> ${stats.total - stats.completed}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
    `;

    comprehensiveFlowchartData.forEach((phase) => {
      const phaseItems = checklist.filter((item) => item.phaseId === phase.id);
      const phaseStat = phaseStats[phase.id];

      html += `
        <div class="phase-section">
          <h2>${phase.title}</h2>
          <p>${phase.description}</p>
          <p><strong>Progress:</strong> ${phaseStat.completed}/${phaseStat.total} completed</p>
      `;

      phaseItems.forEach((item) => {
        const className = item.completed ? "completed" : "incomplete";
        const checkbox = item.completed ? "☑" : "☐";
        html += `
          <div class="checklist-item ${className}">
            <span class="checkbox">${checkbox}</span>
            <strong>${item.title}</strong>
            <p>${item.description}</p>
            ${
              item.nccReferences.length > 0
                ? `<div class="reference">References: ${item.nccReferences.join(", ")}</div>`
                : ""
            }
          </div>
        `;
      });

      html += `</div>`;
    });

    html += `
        </body>
      </html>
    `;

    return html;
  };

  const downloadJSON = () => {
    const data = {
      generatedDate: new Date().toISOString(),
      stats,
      checklist: checklist.map((item) => ({
        ...item,
        phase: comprehensiveFlowchartData.find((p) => p.id === item.phaseId)?.title,
      })),
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NCC-Design-Checklist-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
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
                <h1 className="text-2xl font-bold text-slate-900">Design Checklist</h1>
                <p className="text-sm text-slate-600">Track all NCC 2022 requirements</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadJSON}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToPDF}
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <Card className="mb-8 bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Completion Status</p>
                <p className="text-3xl font-bold text-cyan-600">
                  {stats.completed}/{stats.total}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">Percentage</p>
                <p className="text-3xl font-bold text-cyan-600">{stats.percentage}%</p>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-full transition-all duration-300"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Phase Tabs */}
        <Tabs value={filterPhase} onValueChange={setFilterPhase} className="mb-8">
          <TabsList className="grid grid-cols-4 lg:grid-cols-6 gap-2 h-auto p-2 bg-slate-100">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            {comprehensiveFlowchartData.map((phase) => {
              const phaseStat = phaseStats[phase.id];
              const isComplete = phaseStat.completed === phaseStat.total && phaseStat.total > 0;
              return (
                <TabsTrigger
                  key={phase.id}
                  value={phase.id}
                  className={`text-xs ${isComplete ? "bg-emerald-100 text-emerald-900" : ""}`}
                >
                  {phase.order}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* All Phases View */}
          <TabsContent value="all" className="space-y-8">
            {comprehensiveFlowchartData.map((phase) => {
              const phaseItems = checklist.filter((item) => item.phaseId === phase.id);
              const phaseStat = phaseStats[phase.id];
              const isPhaseComplete =
                phaseStat.completed === phaseStat.total && phaseStat.total > 0;

              return (
                <Card key={phase.id} className="overflow-hidden">
                  <CardHeader
                    className={`cursor-pointer transition-colors ${
                      isPhaseComplete
                        ? "bg-emerald-50 border-b-2 border-emerald-200"
                        : "bg-slate-50 border-b-2 border-slate-200"
                    }`}
                    onClick={() => togglePhase(phase.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white ${
                            isPhaseComplete
                              ? "bg-emerald-500"
                              : "bg-gradient-to-br from-cyan-500 to-cyan-600"
                          }`}
                        >
                          {isPhaseComplete ? "✓" : phase.order}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{phase.title}</CardTitle>
                          <CardDescription>{phase.description}</CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant={isPhaseComplete ? "default" : "outline"}
                        className={isPhaseComplete ? "bg-emerald-500" : ""}
                      >
                        {phaseStat.completed}/{phaseStat.total}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    {phaseItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                          item.completed
                            ? "bg-emerald-50 border border-emerald-200"
                            : "bg-slate-50 border border-slate-200 hover:border-cyan-300"
                        }`}
                      >
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={() => toggleItem(item.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              item.completed
                                ? "text-slate-600 line-through"
                                : "text-slate-900"
                            }`}
                          >
                            {item.title}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                          {item.nccReferences.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.nccReferences.map((ref, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {ref}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Individual Phase Views */}
          {comprehensiveFlowchartData.map((phase) => {
            const phaseItems = checklist.filter((item) => item.phaseId === phase.id);
            const phaseStat = phaseStats[phase.id];

            return (
              <TabsContent key={phase.id} value={phase.id}>
                <Card>
                  <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{phase.title}</CardTitle>
                        <CardDescription>{phase.description}</CardDescription>
                      </div>
                      <Badge className="bg-cyan-600">
                        {phaseStat.completed}/{phaseStat.total}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-3">
                    {phaseItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                          item.completed
                            ? "bg-emerald-50 border border-emerald-200"
                            : "bg-slate-50 border border-slate-200 hover:border-cyan-300"
                        }`}
                      >
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={() => toggleItem(item.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              item.completed
                                ? "text-slate-600 line-through"
                                : "text-slate-900"
                            }`}
                          >
                            {item.title}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                          {item.nccReferences.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.nccReferences.map((ref, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {ref}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <p className="text-sm text-slate-600 text-center">
            NCC 2022 Design Checklist • Track your compliance journey
          </p>
        </div>
      </footer>
    </div>
  );
}
