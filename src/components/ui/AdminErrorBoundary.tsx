"use client";
import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

type State = { hasError: boolean; message: string };

export class AdminErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message ?? "Erreur inconnue" };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFD400]/10 flex items-center justify-center">
            <AlertTriangle size={24} className="text-[#FFD400]" />
          </div>
          <div className="text-center">
            <p className="font-fraunces text-lg text-[#101014] mb-1">Cette page a rencontré une erreur</p>
            <p className="font-mono text-xs text-[#101014]/30 max-w-sm">{this.state.message}</p>
          </div>
          <button onClick={() => { this.setState({ hasError: false, message: "" }); window.location.reload(); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF2DA0] text-white font-hanken text-sm hover:bg-[#FF2DA0]/90 transition-colors">
            <RefreshCw size={13} /> Recharger la page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
