/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchAllPokemon(limit: number = 20, offset: number = 0) {
  const response = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon List");
  }
  const data = await response.json();

  return data;
}

export async function fetchPokemonByType(type: string) {
  const response = await fetch(`${BASE_URL}/type/${type}`);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon by type");
  }
  const data = await response.json();
  const pokemons = data.pokemon.map(
    (pokemon: { pokemon: { name: string } }) => {
      return pokemon.pokemon;
    }
  );
  return pokemons;
}

export async function fetchPokemonDetails(name: string) {
  const response = await fetch(`${BASE_URL}/pokemon/${name}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch details for Pokémon: ${name}`);
  }
  return response.json();
}

export async function fetchPokemonSpecies(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon species");
  }
  const data = await response.json();
  return data.genera.find(
    (genus: { language: { name: string } }) => genus.language.name === "en"
  ).genus;
}

export async function fetchPokemonEvolutionChain(pokemonId: string) {
  try {
    // Primeiro, buscar a species do pokemon
    const speciesResponse = await fetch(
      `${BASE_URL}/pokemon-species/${pokemonId}`
    );
    if (!speciesResponse.ok) {
      return null;
    }
    const speciesData = await speciesResponse.json();

    if (!speciesData.evolution_chain?.url) {
      return null;
    }

    // Depois, buscar a cadeia evolutiva usando a URL da species
    const evolutionResponse = await fetch(speciesData.evolution_chain.url);
    if (!evolutionResponse.ok) {
      return null;
    }
    const evolutionData = await evolutionResponse.json();

    // Adicionar informações sobre o método de evolução
    const addEvolutionDetails = (chain: { evolves_to: string[] }) => {
      if (chain.evolves_to?.length > 0) {
        chain.evolves_to = chain.evolves_to.map((evolution: any) => ({
          ...evolution,
          evolves_to: addEvolutionDetails(evolution).evolves_to,
        }));
      }
      return chain;
    };

    evolutionData.chain = addEvolutionDetails(evolutionData.chain);
    return evolutionData;
  } catch (error) {
    console.error("Error fetching Pokémon evolution chain:", error);
    return null;
  }
}
