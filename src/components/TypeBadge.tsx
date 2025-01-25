import { Badge } from "./ui/badge";

interface TypeBadgeProps {
  type: string;
}

interface TypeBgColors {
  [key: string]: string;
}

export default function TypeBadge({ type }: TypeBadgeProps) {
  const typeBgColors: TypeBgColors = {
    normal: "bg-gray-600",
    fire: "bg-red-600",
    water: "bg-blue-600",
    electric: "bg-yellow-500",
    grass: "bg-green-600",
    ice: "bg-blue-400",
    fighting: "bg-red-700",
    poison: "bg-purple-600",
    ground: "bg-yellow-700",
    flying: "bg-indigo-400",
    psychic: "bg-pink-600",
    bug: "bg-lime-600",
    rock: "bg-yellow-800",
    ghost: "bg-purple-700",
    dragon: "bg-indigo-700",
    dark: "bg-gray-800",
    steel: "bg-gray-500",
    fairy: "bg-pink-400",
  };

  return (
    <Badge className={`${typeBgColors[type]} text-white capitalize`}>
      {type}
    </Badge>
  );
}
