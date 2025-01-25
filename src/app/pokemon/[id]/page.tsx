"use client";

import { Pokemon } from "@/app/services/types";
import Loader from "@/components/Loader";
import PokemonDetails from "@/components/PokeDatails/PokemonDetails";
import { useEffect, useState } from "react";
import { fetchPokemonDetails } from "@/app/services/pokeApi";
import { useParams } from "next/navigation";

export default function PaginaPokemon() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams();

  useEffect(() => {
    const getPokemonDetails = async (id: string) => {
      try {
        await fetchPokemonDetails(id).then((pokemon) => {
          setPokemon(pokemon);
        });
      } catch (error) {
        console.log("Failed to fetch pokemon details", error);
      } finally {
        setLoading(false);
      }
    };

    getPokemonDetails(id as string);
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (!pokemon) {
    return (
      <div className="flex text-5xl text-white items-center justify-center h-screen">
        Pokémon não encontrado
      </div>
    );
  }

  return <PokemonDetails pokemon={pokemon} />;
}
