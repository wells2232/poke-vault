"use client";

import { Pokemon } from "@/app/services/types";
import { useState } from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import { formatId, formatName } from "@/app/utils/formatting";
import TypeBadge from "../TypeBadge";
import { typeGradientColors } from "@/app/utils/typeGradientColors";
import PopupList from "./PopupList";
import { XIcon } from "lucide-react";

interface TeamProps {
  team: (Pokemon | null)[];
  setTeam: (team: (Pokemon | null)[]) => void;
}

export default function Team({ team, setTeam }: TeamProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const handleRemovePokemon = (index: number) => {
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
  };

  const handleAddPokemon = (index: number) => {
    setSelectedSlot(index);
    setIsPopupOpen(true);
  };

  const handleSelectPokemon = (pokemon: Pokemon) => {
    if (selectedSlot !== null) {
      const newTeam = [...team];
      newTeam[selectedSlot] = pokemon;
      setTeam(newTeam);
      setSelectedSlot(null);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Montador de Equipe</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((pokemon, index) => (
          <div key={index} className="relative">
            {pokemon ? (
              <Card
                style={{
                  background: `linear-gradient(to bottom right, ${
                    typeGradientColors[pokemon.types[0].type.name].start
                  }, ${typeGradientColors[pokemon.types[0].type.name].end})`,
                }}
                className="relative flex items-center p-4 rounded-lg transition-transform duration-200 hover:scale-105"
              >
                <button
                  onClick={() => handleRemovePokemon(index)}
                  className="absolute top-2 right-2 text-white hover:text-red-500"
                >
                  <XIcon/>
                </button>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <h2 className="text-lg font-bold text-white mb-1">
                      {formatName(pokemon.name)}
                    </h2>
                    <span className="text-white">{formatId(pokemon.id)}</span>
                    <div className="flex gap-1 mt-1">
                      {pokemon.types.map((type) => (
                        <TypeBadge key={type.type.name} type={type.type.name} />
                      ))}
                    </div>
                  </div>
                  <Image
                    src={
                      pokemon.sprites.front_default ||
                      pokemon.sprites.front_default ||
                      "/pokeimgmock.svg"
                    }
                    alt={pokemon.name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </Card>
            ) : (
              <Card
                onClick={() => handleAddPokemon(index)}
                className="flex items-center justify-center p-4 h-[132px] bg-[rgba(255,255,255,0.1)] border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:border-[#ff3366] transition-colors"
              >
                <span className="text-gray-400">Adicionar Pokémon</span>
              </Card>
            )}
          </div>
        ))}
      </div>

      <PopupList
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSelectPokemon={handleSelectPokemon}
      />
    </div>
  );
}
