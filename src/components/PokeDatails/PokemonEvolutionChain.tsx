import { useEffect, useState } from "react";
import Image from "next/image";
import { formatName } from "@/app/utils/formatting";
import { fetchPokemonEvolutionChain } from "@/app/services/pokeApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Species } from "@/app/services/types";

interface EvolutionMethod {
  trigger?: {
    name: string;
  };
  min_level?: number;
  item?: {
    name: string;
  };
  held_item?: {
    name: string;
  };
  time_of_day?: string;
  happiness?: number;
}

interface EvolutionChainProps {
  chain: Evolution;
}

interface Evolution {
  species: Species;
  evolution_details: EvolutionMethod[]; // API retorna como array
  evolves_to: Evolution[];
}

interface PokemonEvolutionChainProps {
  pokemonId: string;
}

export default function PokemonEvolutionChain({
  pokemonId,
}: PokemonEvolutionChainProps) {
  const [evolutionChain, setEvolutionChain] =
    useState<EvolutionChainProps | null>(null);

  useEffect(() => {
    const fetchEvolution = async () => {
      const data = await fetchPokemonEvolutionChain(pokemonId);
      setEvolutionChain(data);
    };

    fetchEvolution();
  }, [pokemonId]);

  if (!evolutionChain?.chain) {
    return null;
  }

  const renderEvolutionSprite = (species: Species) => {
    const matches = species.url.match(/\/pokemon-species\/(\d+)\//);
    const id = matches ? matches[1] : "1";

    return (
      <div className="flex flex-col items-center gap-2">
        <Image
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
          width={96}
          height={96}
          alt={species.name}
          className="transition-transform hover:scale-110"
        />
        <span className="text-sm font-medium">{formatName(species.name)}</span>
      </div>
    );
  };

  const getEvolutionMethodText = (method: EvolutionMethod): string => {
    if (!method?.trigger?.name) return "";

    switch (method.trigger.name) {
      case "level-up":
        if (method.min_level) return `Level ${method.min_level}`;
        if (method.time_of_day) return `Level up (${method.time_of_day})`;
        if (method.happiness) return `Happiness (${method.happiness})`;
        return "Level up";
      case "use-item":
        return method.item?.name ? formatName(method.item.name) : "";
      case "trade":
        return method.held_item?.name
          ? `Trade with ${formatName(method.held_item.name)}`
          : "Trade";
      default:
        return formatName(method.trigger.name);
    }
  };

  return (
    <Card className="bg-[rgba(255,255,255,0.01)] rounded-3xl w-[400px] h-[330px] flex flex-col">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-white">Cadeia de Evolução</CardTitle>
      </CardHeader>
      <CardContent className="py-4 flex-1 flex items-center justify-center">
        <div className="flex items-center justify-center gap-4">
          {renderEvolutionSprite(evolutionChain.chain.species)}
          {evolutionChain.chain.evolves_to.length > 0 && (
            <>
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-400">
                  {getEvolutionMethodText(
                    evolutionChain.chain.evolves_to[0].evolution_details[0]
                  )}
                </span>
                <span className="text-2xl text-[#ff3366]">→</span>
              </div>
              {renderEvolutionSprite(
                evolutionChain.chain.evolves_to[0].species
              )}
              {evolutionChain.chain.evolves_to[0].evolves_to.length > 0 && (
                <>
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-gray-400">
                      {getEvolutionMethodText(
                        evolutionChain.chain.evolves_to[0].evolves_to[0]
                          .evolution_details[0]
                      )}
                    </span>
                    <span className="text-2xl text-[#ff3366]">→</span>
                  </div>
                  {renderEvolutionSprite(
                    evolutionChain.chain.evolves_to[0].evolves_to[0].species
                  )}
                </>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
