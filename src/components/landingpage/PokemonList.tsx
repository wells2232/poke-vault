import { useState, useEffect } from "react";
import PokemonCard from "./PokemonCard";
import { Pokemon } from "@/app/services/types";
import { ArrowLeftIcon, ArrowRightIcon, Filter, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectGroup, SelectLabel, SelectValue } from "@radix-ui/react-select";
import {
  fetchAllPokemon,
  fetchPokemonByType,
  fetchPokemonDetails,
} from "@/app/services/pokeApi";
import { usePokemonContext } from "@/data/hooks/pokemonContext";
import Loader from "../Loader";

const ITEMS_PER_PAGE = 21;

export default function PokemonList() {
  const { pokemonList, setPokemonList } = usePokemonContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("Todos os Tipos");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      if (pokemonList.length > 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchAllPokemon(10000, 0);
        const pokemons = await Promise.all(
          data.results.map((pokemon: Pokemon) =>
            fetchPokemonDetails(pokemon.name)
          )
        );
        setPokemonList(pokemons);
      } catch (err) {
        setError("Failed to load Pokemon data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [setPokemonList, pokemonList.length]);

  // Handle type filtering with debounce
  const handleFilterChange = async (type: string) => {
    setSelectedType(type);
    setCurrentPage(1);

    if (type === "Todos os Tipos") {
      return;
    }

    try {
      setIsFetching(true);
      const data = await fetchPokemonByType(type);
      const pokemons = await Promise.all(
        data.map((pokemon: Pokemon) => fetchPokemonDetails(pokemon.name))
      );
      setPokemonList(pokemons);
    } catch (err) {
      setError("Failed to filter Pokemon. Please try again.");
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  // Filter and paginate pokemon list
  const filteredPokemons = pokemonList.filter((pokemon) => {
    const matchesSearch = pokemon.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "Todos os Tipos" ||
      pokemon.types.some((type) => type.type.name === selectedType);
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredPokemons.length / ITEMS_PER_PAGE);
  const pokemonsToDisplay = filteredPokemons.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  console.log(pokemonsToDisplay);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-4 md:p-8">
      <div className="container mx-auto sticky top-0 z-10 py-4 bg-[#1a1a2e] w-full px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Pokédex</h1>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative flex-1 sm:flex-initial">
              <Search
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                type="text"
                placeholder="Buscar Pokémon..."
                className="w-full sm:w-48 h-10 bg-[rgba(255,255,255,0.1)] rounded-md px-8 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff3366] focus:ring-opacity-50 transition-all"
              />
            </div>

            <Select value={selectedType} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full sm:w-[150px] bg-[rgba(255,255,255,0.1)] flex items-center justify-start gap-4">
                <Filter size={14} />
                <SelectValue placeholder="Filtrar por Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Filtrar por Tipo</SelectLabel>
                  {[
                    "Todos os Tipos",
                    "normal",
                    "fogo",
                    "água",
                    "planta",
                    "elétrico",
                    "gelo",
                    "lutador",
                    "veneno",
                    "terra",
                    "voador",
                    "psíquico",
                    "inseto",
                    "pedra",
                    "fantasma",
                    "sombrio",
                    "dragão",
                    "aço",
                    "fada",
                  ].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isFetching ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      ) : (
        <>
          <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-4">
            {pokemonsToDisplay.map((pokemon) => (
              <div
                key={pokemon.name}
                className="group cursor-pointer transform hover:scale-[1.02] transition-transform"
              >
                <PokemonCard pokemon={pokemon} />
              </div>
            ))}
          </div>

          {filteredPokemons.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center mt-8 items-center gap-2 sm:gap-4 flex-wrap">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="flex items-center gap-1 sm:gap-2 bg-[#ff3366] px-2 sm:px-4 py-1 sm:py-2 rounded-md text-white text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                <ArrowLeftIcon size={14} className="sm:w-4 sm:h-4" />
                Anterior
              </button>
              <span className="mx-2 sm:mx-4 text-sm sm:text-base">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-1 sm:gap-2 bg-[#ff3366] px-2 sm:px-4 py-1 sm:py-2 rounded-md text-white text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                Próxima
                <ArrowRightIcon size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
