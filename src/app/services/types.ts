export interface PokemonType {
  type: {
    name: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
}

export interface Pokemon {
  evolutionChain: EvolutionChain;
  name: string;
  id: number;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  moves: PokemonMove[];
  height: number;
  weight: number;
  species: { url: string };
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
    front_default: string;
  };
}

export interface EvolutionChain {
  chain: {
    species: Species;
    evolves_to: Evolution[];
  };
}

export interface Species {
  name: string;
  url: string;
}

export interface Evolution {
  species: Species;
  evolves_to: Evolution[];
}

export interface PokemonListType {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}
