"use client";

import { Pokemon } from "@/app/services/types";
import TypeBadge from "../TypeBadge";

interface TeamAnalysisProps {
  team: (Pokemon | null)[];
}

const typeEffectiveness: { [key: string]: { [key: string]: number } } = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    bug: 2,
    rock: 0.5,
    dragon: 0.5,
    steel: 2,
  },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: {
    water: 2,
    electric: 0.5,
    grass: 0.5,
    ground: 0,
    flying: 2,
    dragon: 0.5,
  },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5,
  },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    ground: 2,
    flying: 2,
    dragon: 2,
    steel: 0.5,
  },
  fighting: {
    normal: 2,
    ice: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
    dark: 2,
    steel: 2,
    fairy: 0.5,
  },
  poison: {
    grass: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
    fairy: 2,
  },
  ground: {
    fire: 2,
    electric: 2,
    grass: 0.5,
    poison: 2,
    flying: 0,
    bug: 0.5,
    rock: 2,
    steel: 2,
  },
  flying: {
    electric: 0.5,
    grass: 2,
    fighting: 2,
    bug: 2,
    rock: 0.5,
    steel: 0.5,
  },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: {
    fire: 2,
    ice: 2,
    fighting: 0.5,
    ground: 0.5,
    flying: 2,
    bug: 2,
    steel: 0.5,
  },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: {
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    ice: 2,
    rock: 2,
    steel: 0.5,
    fairy: 2,
  },
  fairy: { fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

export default function TeamAnalysis({ team }: TeamAnalysisProps) {
  const calculateTeamEffectiveness = () => {
    const effectiveness: { [key: string]: number } = {};

    team.forEach((pokemon) => {
      if (!pokemon) return;

      pokemon.types.forEach((pokemonType) => {
        Object.entries(typeEffectiveness[pokemonType.type.name] || {}).forEach(
          ([type, multiplier]) => {
            effectiveness[type] = (effectiveness[type] || 1) * multiplier;
          }
        );
      });
    });

    return effectiveness;
  };

  const teamEffectiveness = calculateTeamEffectiveness();

  const getWeaknesses = () => {
    return Object.entries(teamEffectiveness)
      .filter(([, value]) => value > 1)
      .sort((a, b) => b[1] - a[1]);
  };

  const getResistances = () => {
    return Object.entries(teamEffectiveness)
      .filter(([, value]) => value < 1)
      .sort((a, b) => a[1] - b[1]);
  };

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Análise do Time</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-white font-semibold mb-2">Fraquezas</h3>
          <div className="flex flex-wrap gap-2">
            {getWeaknesses().map(([type, multiplier]) => (
              <div key={type} className="flex items-center gap-1">
                <TypeBadge type={type} />
                <span className="text-white text-sm">x{multiplier}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">Resistências</h3>
          <div className="flex flex-wrap gap-2">
            {getResistances().map(([type, multiplier]) => (
              <div key={type} className="flex items-center gap-1">
                <TypeBadge type={type} />
                <span className="text-white text-sm">x{multiplier}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
