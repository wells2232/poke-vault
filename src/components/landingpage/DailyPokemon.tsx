import { formatId, formatName } from "@/app/utils/formatting";
import TypeBadge from "../TypeBadge";
import { useState, useEffect, useMemo } from "react";
import { typeGradientColors } from "@/app/utils/typeGradientColors";
import Image from "next/image";
import { Card } from "../ui/card";
import Link from "next/link";
import Loader from "../Loader";
import { usePokemonStore } from "@/data/hooks/pokemonStore"; // Adjust import path as needed
import { Pokemon } from "@/app/services/types";

export default function DailyPokemon() {
  const { pokemonData, loading, fetchPokemon } = usePokemonStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pokemonData.length === 0) {
      fetchPokemon().catch((err: { message: string }) => {
        setError(err.message);
      });
    }
  }, [fetchPokemon, pokemonData]);

  const dailyPokemon: Pokemon | null = useMemo(() => {
    if (pokemonData.length === 0) return null;

    const today = new Date();
    const seed = today.toDateString();
    const randomSeed = seed
      .split("")
      .reduce((acc, char) => (acc += char.charCodeAt(0)), 0);
    const pokemonIndex = randomSeed % pokemonData.length;
    return pokemonData[pokemonIndex];
  }, [pokemonData]);

  const typeColor = dailyPokemon
    ? typeGradientColors[dailyPokemon.types[0].type.name]
    : undefined;

  function PokeInfo() {
    if (loading) return <Loader />;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return dailyPokemon ? (
      <div className="p-4 space-y-3 text-white">
        <div>
          <h1 className="text-lg font-semibold">POKÉMON DO DIA</h1>
          <h2 className="uppercase font-bold text-2xl sm:text-3xl lg:text-4xl">
            {formatName(dailyPokemon.name)}
          </h2>
          <p className="text-sm opacity-90">{formatId(dailyPokemon.id)}</p>
        </div>

        <p className="text-sm max-w-md">
          Descubra o Pokémon especial do dia! A cada dia, um novo Pokémon é
          selecionado aleatoriamente para você conhecer melhor.
        </p>
        <div className="flex flex-wrap gap-2">
          {dailyPokemon?.types.map((type) => (
            <TypeBadge key={type.type.name} type={type.type.name} />
          ))}
        </div>
      </div>
    ) : null;
  }

  return (
    <div className="mt-8 w-full px-4 max-w-4xl mx-auto">
      {dailyPokemon && (
        <Link href={`/pokemon/${dailyPokemon?.id}`}>
          <Card
            style={{
              background: `linear-gradient(to bottom right, ${typeColor?.start}, ${typeColor?.end})`,
            }}
            className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg hover:scale-[1.02] transition-transform"
          >
            <PokeInfo />
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
              <Image
                src={
                  dailyPokemon?.sprites.other["official-artwork"]
                    .front_default ||
                  dailyPokemon?.sprites.front_default ||
                  "/pokeimgmock.svg"
                }
                alt={dailyPokemon?.name || ""}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 256px"
                priority
              />
            </div>
          </Card>
        </Link>
      )}
    </div>
  );
}
