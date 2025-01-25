"use client";

import { Pokemon } from "@/app/services/types";
import TypeBadge from "../TypeBadge";

interface TypeCoverageProps {
  team: (Pokemon | null)[];
}

export default function TypeCoverage({ team }: TypeCoverageProps) {
  const types = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];

  const getCoverageCount = (type: string) => {
    return team.filter((pokemon) =>
      pokemon?.types.some((t) => t.type.name === type)
    ).length;
  };

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Cobertura de Tipos</h2>
      <div className="grid grid-cols-3 gap-3">
        {types.map((type) => (
          <div key={type} className="flex items-center gap-2">
            <TypeBadge type={type} />
            <span className="text-white">{getCoverageCount(type)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
