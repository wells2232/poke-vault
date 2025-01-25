import Image from "next/image";
import { formatId, formatName } from "@/app/utils/formatting";
import TypeBadge from "../TypeBadge";
import Link from "next/link";
import { typeGradientColors } from "@/app/utils/typeGradientColors";
import { Pokemon } from "@/app/services/types";

export interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const typeColor = typeGradientColors;

  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <div
        style={{
          background: `linear-gradient(to bottom right, ${
            typeColor[pokemon.types[0].type.name].start
          }, ${typeColor[pokemon.types[0].type.name].end})`,
        }}
        className={`rounded-lg relative gap-3 transition-transform duration-200 hover:scale-105 hover:shadow-lg cursor-pointer`}
      >
        <div className="flex items-center gap-3 px-4 pb-2">
          <div className="flex justify-between w-full items-center">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-white mb-1 capitalize">
                {formatName(pokemon.name)}
              </h2>
              <span> {formatId(pokemon.id)}</span>
              <div className="flex gap-1">
                {pokemon.types.map((type) => (
                  <TypeBadge key={type.type.name} type={type.type.name} />
                ))}
              </div>
            </div>
            <div>
              <Image
                src={
                  pokemon.sprites.front_default ||
                  pokemon.sprites.front_default ||
                  "/pokeimgmock.svg"
                }
                loading="lazy"
                alt={pokemon.name || ""}
                width={100}
                height={100}
                className={`${
                  pokemon?.sprites.other["official-artwork"].front_default
                    ? ""
                    : "animate-spin"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
