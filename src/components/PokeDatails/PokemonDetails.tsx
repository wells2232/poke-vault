"use client";

import { Pokemon } from "@/app/services/types";
import { PokemonStats } from "./PokemonStats";
import PokemonCardDetails from "./PokemonCardDetails";
import PokemonMovements from "./PokemonMovements";
import PokemonEvolutionChain from "./PokemonEvolutionChain";

interface PokemonDetailsProps {
  pokemon: Pokemon;
}

export default function PokemonDetails({ pokemon }: PokemonDetailsProps) {
  return (
    <div className="flex container flex-col items-center justify-between mx-auto bg-transparent w-full text-white gap-4 p-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <PokemonCardDetails pokemon={pokemon} />
          <PokemonStats pokemon={pokemon} />

          <PokemonEvolutionChain pokemonId={pokemon.id.toString()} />
        </div>
      </div>
      <div className="w-full max-w-[1200px]">
        <PokemonMovements moves={pokemon.moves} />
      </div>
    </div>
  );
}
