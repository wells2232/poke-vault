import { Pokemon } from "@/app/services/types";
import { formatId, formatName } from "@/app/utils/formatting";
import { typeGradientColors } from "@/app/utils/typeGradientColors";
import TypeBadge from "../TypeBadge";
import Image from "next/image";
import { fetchPokemonSpecies } from "@/app/services/pokeApi";
import { useEffect, useState } from "react";

interface PokemonCardDetailsProps {
  pokemon: Pokemon;
}

export default function PokemonCardDetails(props: PokemonCardDetailsProps) {
  const { pokemon } = props;

  const getGradientStyle = (type: string) => {
    const typeColor = typeGradientColors[type];
    return {
      background: `linear-gradient(to bottom right, ${typeColor.start}, ${typeColor.end})`,
    };
  };

  const [species, setSpecies] = useState<string>("");

  useEffect(() => {
    fetchPokemonSpecies(pokemon.species.url).then((species) => {
      setSpecies(species);
    });
  }, [pokemon.species.url]);

  return (
    <div
      className="flex items-center w-[400px] h-auto justify-center rounded-2xl shadow-md text-white"
      style={getGradientStyle(pokemon.types[0].type.name)}
    >
      <div className="flex flex-col items-start justify-start gap-2 p-4 ">
        <h1 className="text-3xl font-bold">{formatName(pokemon.name)}</h1>
        <span>{formatId(pokemon.id)}</span>
        <div className="flex gap-3">
          {pokemon.types.map((type) => (
            <TypeBadge key={type.type.name} type={type.type.name} />
          ))}
        </div>
        <span>Species: {species}</span>
        <span>Altura: {pokemon.height}m</span>
        <span>Peso: {pokemon.weight}kg</span>
        <div className="flex flex-col gap-2">
          <span>Habilidades</span>
          <ul className="list-disc list-inside">
            {pokemon.abilities.map((ability) => (
              <li key={ability.ability.name}>
                {formatName(ability.ability.name)}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <Image
          src={
            pokemon.sprites.other["official-artwork"].front_default ||
            pokemon.sprites.front_default ||
            "/pokeimgmock.svg"
          }
          className="object-contain transform scale-110 p-4"
          width={400}
          height={400}
          style={{ width: "auto" }}
          alt={pokemon.name}
        />
      </div>
    </div>
  );
}
