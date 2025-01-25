import { PokemonStat } from "../services/types";

export const formatName = (name: string | null | undefined): string => {
  if (!name || typeof name !== "string") return "";
  return name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

// Format stats to be displayed as HP, Attack, Defense, Speed, Sp. Atk, Sp. Def
export function formatStats(stats: PokemonStat[]) {
  return stats.map((stat) => {
    switch (stat.stat.name) {
      case "hp":
        return { name: "HP", value: stat.base_stat };
      case "attack":
        return { name: "Attack", value: stat.base_stat };
      case "defense":
        return { name: "Defense", value: stat.base_stat };
      case "speed":
        return { name: "Speed", value: stat.base_stat };
      case "special-attack":
        return { name: "Sp. Atk", value: stat.base_stat };
      case "special-defense":
        return { name: "Sp. Def", value: stat.base_stat };
      default:
        return { name: stat.stat.name, value: stat.base_stat };
    }
  });
}

export function formatId(id: number) {
  return id.toString().padStart(6, "#0000");
}
