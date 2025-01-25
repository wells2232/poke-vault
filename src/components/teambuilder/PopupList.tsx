"use client";

import { Pokemon } from "@/app/services/types";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Input } from "./Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { fetchAllPokemon, fetchPokemonDetails } from "@/app/services/pokeApi";
import Image from "next/image";
import { formatId, formatName } from "@/app/utils/formatting";
import TypeBadge from "../TypeBadge";
import { typeGradientColors } from "@/app/utils/typeGradientColors";

interface PopupListProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPokemon: (pokemon: Pokemon) => void;
}

export default function PopupList({
  isOpen,
  onClose,
  onSelectPokemon,
}: PopupListProps) {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);

  const types = [
    "all",
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];

  useEffect(() => {
    const loadPokemons = async () => {
      try {
        const response = await fetchAllPokemon(151, 0);
        const pokemonDetails = await Promise.all(
          response.results.map((pokemon: { name: string }) =>
            fetchPokemonDetails(pokemon.name)
          )
        );
        setPokemons(pokemonDetails);
        setFilteredPokemons(pokemonDetails);
      } catch (error) {
        console.error("Erro ao carregar pokémons:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadPokemons();
    }
  }, [isOpen]);

  useEffect(() => {
    let filtered = pokemons;

    // Filtrar por busca
    if (searchQuery) {
      filtered = filtered.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrar por tipo
    if (selectedType !== "all") {
      filtered = filtered.filter((pokemon) =>
        pokemon.types.some((type) => type.type.name === selectedType)
      );
    }

    setFilteredPokemons(filtered);
  }, [searchQuery, selectedType, pokemons]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[800px] h-[600px] bg-[#1a1a1a] p-6 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-red-500"
        >
          X
        </button>

        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Selecionar Pokémon
          </h2>

          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Buscar Pokémon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {formatName(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#ff3366] scrollbar-track-transparent">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <span className="text-white">Carregando...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredPokemons.map((pokemon) => (
                  <Card
                    key={pokemon.id}
                    style={{
                      background: `linear-gradient(to bottom right, ${
                        typeGradientColors[pokemon.types[0].type.name].start
                      }, ${
                        typeGradientColors[pokemon.types[0].type.name].end
                      })`,
                    }}
                    className="p-4 flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => {
                      onSelectPokemon(pokemon);
                      onClose();
                    }}
                  >
                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold text-white">
                        {formatName(pokemon.name)}
                      </h3>
                      <span className="text-white">{formatId(pokemon.id)}</span>
                      <div className="flex gap-1 mt-1">
                        {pokemon.types.map((type) => (
                          <TypeBadge
                            key={type.type.name}
                            type={type.type.name}
                          />
                        ))}
                      </div>
                    </div>
                    <Image
                      src={pokemon.sprites.front_default || "/pokeimgmock.svg"}
                      alt={pokemon.name}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
