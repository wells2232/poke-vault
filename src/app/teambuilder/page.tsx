"use client";

import Team from "@/components/teambuilder/Team";
import TypeCoverage from "@/components/teambuilder/TypeCoverage";
import TeamAnalysis from "@/components/teambuilder/TeamAnalysis";
import { useState } from "react";
import { Pokemon } from "../services/types";

export default function TeamBuilderPage() {
  const [team, setTeam] = useState<(Pokemon | null)[]>(Array(6).fill(null));

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Team team={team} setTeam={setTeam} />
        </div>
        <div className="space-y-6">
          <TypeCoverage team={team} />
          <TeamAnalysis team={team} />
        </div>
      </div>
    </div>
  );
}
