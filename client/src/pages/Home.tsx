import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, CheckCircle, Zap } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-16 md:top-16 z-40">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Navigate Australian Structural Design with Confidence
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            An interactive flowchart that guides you through the complete NCC 2022 structural design process. Every step connects directly to relevant NCC clauses and Australian Standards.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-16 max-w-3xl">
          <Button
            size="lg"
            onClick={() => setLocation("/design")}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            Start Design Workflow
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-cyan-600" />
              </div>
              <CardTitle>Interactive Flowchart</CardTitle>
              <CardDescription>Visual workflow navigation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Navigate through 14 sequential steps of the structural design process with interactive nodes, smooth animations, and detailed information panels.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Smart Navigation</CardTitle>
              <CardDescription>Intuitive step-by-step guidance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Move forward and backward through the design workflow with keyboard shortcuts and navigation buttons. Never get lost in the process.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-emerald-600" />
              </div>
              <CardTitle>Standards Reference</CardTitle>
              <CardDescription>Complete technical documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Every step includes direct references to NCC 2022 clauses and relevant Australian Standards for comprehensive guidance.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 12 Phases Overview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">12-Phase Design Process</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { num: 1, title: "Project Setup", desc: "Define parameters & state variations" },
              { num: 2, title: "Building Classification", desc: "Determine class (1-10)" },
              { num: 3, title: "Compliance Pathway", desc: "DTS, Performance, or Hybrid" },
              { num: 4, title: "Importance Level", desc: "Assign IL 1-4 & design events" },
              { num: 5, title: "Structural Actions", desc: "Determine all design loads" },
              { num: 6, title: "Material Standards", desc: "Select material & system" },
              { num: 7, title: "Structural Analysis", desc: "ULS & SLS checks" },
              { num: 8, title: "Fire Resistance", desc: "Determine FRL & design" },
              { num: 9, title: "Geotechnical", desc: "Site investigation & foundations" },
              { num: 10, title: "Connections", desc: "Design connections & detailing" },
              { num: 11, title: "Verification", desc: "Design review & documentation" },
              { num: 12, title: "Building Approval", desc: "Submit & construction inspections" },
            ].map((phase) => (
              <Card key={phase.num} className="border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {phase.num}
                    </div>
                    <div>
                      <CardTitle className="text-base">{phase.title}</CardTitle>
                      <CardDescription className="text-xs">{phase.desc}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-2xl p-12 text-white mb-16">
          <h3 className="text-3xl font-bold mb-4">Ready to Navigate the Design Process?</h3>
          <p className="text-lg mb-8 opacity-90">
            Start with the interactive flowchart to guide you through every step of NCC structural design.
          </p>
          <Button
            size="lg"
            onClick={() => setLocation("/design")}
            className="bg-white text-cyan-600 hover:bg-slate-50"
          >
            Start Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Standards Reference */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Compliance Standards</CardTitle>
            <CardDescription>
              This tool guides you through compliance with the following standards and regulations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Primary Standards</h4>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• NCC 2022 (National Construction Code)</li>
                  <li>• AS/NZS 1170 (Structural Design Actions)</li>
                  <li>• AS 3600 (Concrete Structures)</li>
                  <li>• AS 4100 (Steel Structures)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Additional References</h4>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• AS 2159 (Geotechnical Site Investigation)</li>
                  <li>• AS 2870 (Residential Slabs)</li>
                  <li>• AS 4678 (Earth Retaining Structures)</li>
                  <li>• ABCB Flood Standard</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <p className="text-sm text-slate-600 text-center">
            NCC 2022 Design Checkbook • Navigate Australian Structural Design with Confidence
          </p>
        </div>
      </footer>
    </div>
  );
}
