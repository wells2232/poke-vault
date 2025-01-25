import React from "react";
import TypeBadge from "../TypeBadge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface PokemonMovementsProps {
  moves: { move: { name: string; url: string } }[];
}

interface MoveData {
  name: string;
  type: { name: string };
  pp: number;
  power: number | null;
  accuracy: number | null;
  effect_entries: { effect: string; short_effect: string }[];
}

const fetchMove = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon List");
  }
  const data = await response.json();
  return data;
};

const PokemonMovements: React.FC<PokemonMovementsProps> = ({ moves }) => {
  const [movesData, setMovesData] = React.useState<MoveData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMoves = async () => {
      try {
        const promises = moves.map((move) => fetchMove(move.move.url));
        const results = await Promise.all(promises);
        setMovesData(results);
      } catch (error) {
        console.error("Error fetching moves:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoves();
  }, [moves]);

  const formatMoveName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card className="w-full bg-[rgba(255,255,255,0.01)]">
      <CardHeader>
        <CardTitle className="text-white text-xl sm:text-2xl">Movimentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] sm:h-[500px] lg:h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#f36] scrollbar-track-transparent">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-[#f36] z-10 rounded-lg overflow-hidden">
              <tr className="text-white">
                <th className="p-2 sm:p-3 text-left text-sm sm:text-base first:rounded-l-lg">
                  Tipo
                </th>
                <th className="p-2 sm:p-3 text-left text-sm sm:text-base">
                  Movimento
                </th>
                <th className="p-2 sm:p-3 text-left text-sm sm:text-base">
                  PP
                </th>
                <th className="p-2 sm:p-3 text-left text-sm sm:text-base">
                  Poder
                </th>
                <th className="p-2 sm:p-3 text-left text-sm sm:text-base last:rounded-r-lg">
                  Precisão
                </th>
              </tr>
            </thead>
            <tbody className="text-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    Loading moves...
                  </td>
                </tr>
              ) : (
                movesData.map((move, index) => (
                  <tr
                    key={`${move.name}-${index}`}
                    className="hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  >
                    <td className="p-2 sm:p-3">
                      <TypeBadge type={move.type.name} />
                    </td>
                    <td className="p-2 sm:p-3">
                      <div className="space-y-1">
                        <div className="font-medium text-sm sm:text-base break-words">
                          {formatMoveName(move.name)}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-400 break-words">
                          {move.effect_entries?.[0]?.short_effect?.replace(
                            "$effect_chance",
                            "100"
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 sm:p-3 text-sm sm:text-base whitespace-nowrap">
                      {move.pp}
                    </td>
                    <td className="p-2 sm:p-3 text-sm sm:text-base whitespace-nowrap">
                      {move.power || "-"}
                    </td>
                    <td className="p-2 sm:p-3 text-sm sm:text-base whitespace-nowrap">
                      {move.accuracy ? `${move.accuracy}%` : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PokemonMovements;
