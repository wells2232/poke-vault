import { Pokemon } from "@/app/services/types";
import { create } from "zustand";

interface PokemonStore {
  pokemonData: Pokemon[];
  loading: boolean;
  fetchPokemon: () => Promise<void>;
}

export const usePokemonStore = create<PokemonStore>((set) => ({
  pokemonData: [],
  loading: false,
  fetchPokemon: async () => {
    set({ loading: true });

    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=1200"
      );
      const data = await response.json();

      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon: { name: string; url: string }) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();

          return details;
        })
      );
      set({ pokemonData: pokemonDetails, loading: false });
    } catch (error) {
      console.error("Failed to fetch pokémon data: ", error);
      set({ loading: false });
    }
  },
}));
