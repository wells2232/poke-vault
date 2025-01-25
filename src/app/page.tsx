"use client";

import DailyPokemon from "@/components/landingpage/DailyPokemon";
import Pokedex from "@/components/landingpage/Pokedex";

export default function App() {
  return (
    <div className="flex flex-col container">
      <DailyPokemon />
      <Pokedex />
    </div>
  );
}
