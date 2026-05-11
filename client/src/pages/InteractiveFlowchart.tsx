import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ZoomIn, ZoomOut, ChevronRight, RotateCcw, ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import { flowchartNodes, flowchartOrder, FlowchartNode } from "@/data/flowchartData";

export default function InteractiveFlowchart() {
  const [, setLocation] = useLocation();
  const [selectedNode, setSelectedNode] = useState<FlowchartNode | null>(flowchartNodes.start);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const NODE_WIDTH = 140;
  const NODE_HEIGHT = 80;
  const HORIZONTAL_SPACING = 180;
  const VERTICAL_SPACING = 140;

  // Calculate node positions for horizontal flow
  const nodePositions = useMemo(() => {
    const positions = new Map<string, { x: number; y: number }>();
    const baseX = 100;
    const baseY = 300;

    flowchartOrder.forEach((nodeId, index) => {
      const x = baseX + index * HORIZONTAL_SPACING;
      const y = baseY;
      positions.set(nodeId, { x, y });
    });

    return positions;
  }, []);

  // Calculate SVG bounds
  const bounds = useMemo(() => {
    let minX = 0, maxX = 0, minY = 0, maxY = 0;
    nodePositions.forEach((pos) => {
      minX = Math.min(minX, pos.x - NODE_WIDTH / 2 - 50);
      maxX = Math.max(maxX, pos.x + NODE_WIDTH / 2 + 50);
      minY = Math.min(minY, pos.y - NODE_HEIGHT / 2 - 50);
      maxY = Math.max(maxY, pos.y + NODE_HEIGHT / 2 + 50);
    });
    return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
  }, [nodePositions]);

  // Get node shape path based on type
  const getNodePath = (x: number, y: number, type: string): string => {
    const w = NODE_WIDTH / 2;
    const h = NODE_HEIGHT / 2;

    switch (type) {
      case "start":
      case "end":
        // Circle
        return `M ${x - w + 20} ${y} A ${w - 20} ${h} 0 1 1 ${x + w - 20} ${y} A ${w - 20} ${h} 0 1 1 ${x - w + 20} ${y}`;
      case "decision":
        // Diamond
        return `M ${x} ${y - h - 10} L ${x + w + 10} ${y} L ${x} ${y + h + 10} L ${x - w - 10} ${y} Z`;
      case "process":
      case "action":
        // Rounded rectangle
        return `M ${x - w} ${y - h + 8} L ${x - w} ${y + h - 8} Q ${x - w} ${y + h} ${x - w + 8} ${y + h} L ${x + w - 8} ${y + h} Q ${x + w} ${y + h} ${x + w} ${y + h - 8} L ${x + w} ${y - h + 8} Q ${x + w} ${y - h} ${x + w - 8} ${y - h} L ${x - w + 8} ${y - h} Q ${x - w} ${y - h} ${x - w} ${y - h + 8}`;
      default:
        return "";
    }
  };

  // Render connection lines
  const renderConnections = () => {
    const connections: any[] = [];

    flowchartOrder.forEach((nodeId, index) => {
      if (index < flowchartOrder.length - 1) {
        const fromNode = flowchartNodes[nodeId];
        const toNode = flowchartNodes[flowchartOrder[index + 1]];

        if (fromNode && toNode) {
          const fromPos = nodePositions.get(fromNode.id);
          const toPos = nodePositions.get(toNode.id);

          if (fromPos && toPos) {
            const startX = fromPos.x + NODE_WIDTH / 2;
            const startY = fromPos.y;
            const endX = toPos.x - NODE_WIDTH / 2;
            const endY = toPos.y;
            const midX = (startX + endX) / 2;

            connections.push(
              <g key={`line-${nodeId}`}>
                {/* Connection line */}
                <path
                  d={`M ${startX} ${startY} Q ${midX} ${startY - 30}, ${endX} ${endY}`}
                  stroke="#cbd5e1"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
                {/* Arrow head */}
                <polygon
                  points={`${endX},${endY} ${endX - 8},${endY - 5} ${endX - 8},${endY + 5}`}
                  fill="#cbd5e1"
                />
              </g>
            );
          }
        }
      }
    });

    return connections;
  };

  // Render nodes
  const renderNodes = () => {
    return flowchartOrder.map((nodeId) => {
      const node = flowchartNodes[nodeId];
      const pos = nodePositions.get(nodeId);
      const isSelected = selectedNode?.id === nodeId;

      if (!pos || !node) return null;

      const { x, y } = pos;

      return (
        <g
          key={`node-${nodeId}`}
          onClick={() => setSelectedNode(node)}
          style={{ cursor: "pointer" }}
          className="transition-all duration-200"
        >
          {/* Shadow filter */}
          <defs>
            <filter id={`shadow-${nodeId}`}>
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity={isSelected ? "0.3" : "0.15"} />
            </filter>
            <linearGradient id={`grad-${nodeId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={node.color} stopOpacity="1" />
              <stop offset="100%" stopColor={node.color} stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Node shape */}
          <path
            d={getNodePath(x, y, node.type)}
            fill={`url(#grad-${nodeId})`}
            filter={`url(#shadow-${nodeId})`}
            stroke={isSelected ? "#ffffff" : "rgba(255,255,255,0.4)"}
            strokeWidth={isSelected ? "3" : "1.5"}
            opacity={isSelected ? 1 : 0.9}
            className="transition-all duration-200 hover:opacity-100"
          />

          {/* Node label */}
          <text
            x={x}
            y={y - 8}
            textAnchor="middle"
            fill="white"
            fontSize="13"
            fontWeight="600"
            className="pointer-events-none select-none"
            style={{ letterSpacing: "-0.3px" }}
          >
            {node.label}
          </text>

          {/* Node type indicator */}
          <text
            x={x}
            y={y + 12}
            textAnchor="middle"
            fill="rgba(255,255,255,0.7)"
            fontSize="10"
            className="pointer-events-none select-none"
            style={{ fontStyle: "italic" }}
          >
            {node.type}
          </text>
        </g>
      );
    });
  };

  // Handle zoom
  const handleZoom = (direction: "in" | "out") => {
    const zoomSpeed = 0.2;
    const newZoom = direction === "in" 
      ? Math.min(3, zoom + zoomSpeed)
      : Math.max(0.3, zoom - zoomSpeed);
    setZoom(newZoom);
  };

  // Handle fit to screen
  const handleFitToScreen = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 40;
      const containerHeight = containerRef.current.clientHeight - 40;
      
      const scaleX = containerWidth / bounds.width;
      const scaleY = containerHeight / bounds.height;
      const newZoom = Math.min(scaleX, scaleY, 1) * 0.95;
      
      setZoom(newZoom);
      setPanX(0);
      setPanY(0);
    }
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
    }
  };

  // Handle mouse up for dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.shiftKey) {
      e.preventDefault();
      const direction = e.deltaY > 0 ? "out" : "in";
      handleZoom(direction);
    }
  }, [zoom]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel as EventListener, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel as EventListener);
    }
  }, [handleWheel]);

  // Navigate to previous/next node
  const handleNavigate = (direction: "prev" | "next") => {
    if (!selectedNode) return;
    const currentIndex = flowchartOrder.indexOf(selectedNode.id);
    if (direction === "prev" && currentIndex > 0) {
      setSelectedNode(flowchartNodes[flowchartOrder[currentIndex - 1]]);
    } else if (direction === "next" && currentIndex < flowchartOrder.length - 1) {
      setSelectedNode(flowchartNodes[flowchartOrder[currentIndex + 1]]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
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
                <h1 className="text-2xl font-bold text-slate-900">NCC Structural Design Flow</h1>
                <p className="text-sm text-slate-600">Interactive workflow visualization</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2 items-center flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoom("out")}
              className="border-slate-300"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoom("in")}
              className="border-slate-300"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFitToScreen}
              className="border-slate-300"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <div className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNavigate("prev")}
              disabled={!selectedNode || flowchartOrder.indexOf(selectedNode.id) === 0}
              className="border-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNavigate("next")}
              disabled={!selectedNode || flowchartOrder.indexOf(selectedNode.id) === flowchartOrder.length - 1}
              className="border-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Flowchart Canvas */}
          <div className="lg:col-span-3">
            <Card className="border-slate-200 bg-white overflow-hidden" style={{ minHeight: "600px" }}>
              <CardContent className="p-0 h-full relative">
                <div
                  ref={containerRef}
                  className="w-full h-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{ cursor: isDragging ? "grabbing" : "grab" }}
                >
                  <svg
                    ref={svgRef}
                    width={Math.max(bounds.width, 1200)}
                    height={Math.max(bounds.height, 600)}
                    viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
                    className="w-full h-full"
                    style={{
                      transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
                      transformOrigin: "top left",
                      transition: isDragging ? "none" : "transform 0.2s ease-out"
                    }}
                  >
                    {/* Background grid */}
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect x={bounds.minX} y={bounds.minY} width={bounds.width} height={bounds.height} fill="url(#grid)" />

                    {/* Render connections */}
                    {renderConnections()}

                    {/* Render nodes */}
                    {renderNodes()}
                  </svg>
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="border-slate-200 mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Node Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500" />
                    <span className="text-sm text-slate-700">Start/End</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-cyan-500" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
                    <span className="text-sm text-slate-700">Decision</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-purple-500" />
                    <span className="text-sm text-slate-700">Process</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-red-500" />
                    <span className="text-sm text-slate-700">Fire</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-slate-400" />
                    <span className="text-sm text-slate-700">Action</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-slate-200 sticky top-24 bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Node Details</CardTitle>
                <CardDescription>
                  {selectedNode ? selectedNode.label : "Select a node"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedNode ? (
                  <div className="space-y-4">
                    {/* Node Type */}
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Type</p>
                      <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded font-medium capitalize">
                        {selectedNode.type}
                      </span>
                    </div>

                    {/* Description */}
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Description</p>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {selectedNode.description}
                      </p>
                    </div>

                    {/* NCC Reference */}
                    {selectedNode.nccRef && (
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase mb-1">NCC Reference</p>
                        <p className="text-sm font-medium text-cyan-600 break-words">
                          {selectedNode.nccRef}
                        </p>
                      </div>
                    )}

                    {/* AS Standard */}
                    {selectedNode.asStandard && (
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Standard</p>
                        <p className="text-sm font-medium text-cyan-600 break-words">
                          {selectedNode.asStandard}
                        </p>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="pt-4 border-t border-slate-200">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNavigate("prev")}
                          disabled={flowchartOrder.indexOf(selectedNode.id) === 0}
                          className="flex-1"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNavigate("next")}
                          disabled={flowchartOrder.indexOf(selectedNode.id) === flowchartOrder.length - 1}
                          className="flex-1"
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-slate-500">
                      Click on a node to view its details
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
