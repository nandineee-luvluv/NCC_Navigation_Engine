import React from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Home,
  Workflow,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

/**
 * Navigation Menu Component
 * Persistent menu bar for accessing all pages from anywhere
 */

export default function Navigation() {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      label: "Home",
      icon: Home,
      path: "/",
      description: "Back to home",
    },
    {
      label: "Design",
      icon: Workflow,
      path: "/design",
      description: "NCC Design Workflow",
    },
  ];

  const handleNavigation = (path: string) => {
    setLocation(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation Bar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-40 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-full">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation("/")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold">
              📋
            </div>
            <span className="font-bold text-slate-900 hidden sm:inline">NCC Design</span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation(item.path)}
                  className="gap-2 hover:bg-slate-100 text-slate-700 hover:text-slate-900"
                  title={item.description}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>


        </div>
      </nav>

      {/* Mobile Navigation Bar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-40 shadow-sm flex items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation("/")}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
            📋
          </div>
          <span className="font-bold text-slate-900 text-sm">NCC</span>
        </div>

        {/* Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-700"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 bg-white border-b border-slate-200 z-40 shadow-lg">
          <div className="flex flex-col p-2 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation(item.path)}
                  className="justify-start gap-3 text-slate-700 hover:bg-slate-100"
                >
                  <Icon className="w-4 h-4" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs text-slate-500">{item.description}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-16 hidden md:block" />
      <div className="h-14 md:hidden" />
    </>
  );
}
