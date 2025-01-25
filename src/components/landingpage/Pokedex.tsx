import { useEffect, useState } from "react";
import { DataTable } from "@/app/pokedex/data-table";
import { columns } from "@/app/pokedex/columns";
import { usePokemonStore } from "@/data/hooks/pokemonStore";

import Loader from "../Loader";


export default function Pokedex() {
  const { pokemonData, loading, fetchPokemon } = usePokemonStore();
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(0);

  // Fetch initial data
  useEffect(() => {
    if (pokemonData.length === 0) {
      fetchPokemon().catch((err) => {
        setError(err.message);
      });
    }
  }, [fetchPokemon, pokemonData]);

  const POKEMON_PER_PAGE = 20;
  const totalPokemons = pokemonData.length;
  const canNextPage = totalPokemons > POKEMON_PER_PAGE * pageNumber;
  const canPrevPage = pageNumber > 0;
  const totalPages = Math.ceil(totalPokemons / POKEMON_PER_PAGE);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl text-white font-bold mb-6">Pokedex</h1>
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <DataTable
          setPageNumber={setPageNumber}
          columns={columns}
          data={pokemonData}
          canNextPage={canNextPage}
          canPrevPage={canPrevPage}
          totalPages={totalPages}
          pageNumber={pageNumber}
        />
      )}
    </div>
  );
}
