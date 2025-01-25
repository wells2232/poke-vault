import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Adiciona a variável de ambiente NEXT_PUBLIC_POKEAPI_URL
  env: {
    NEXT_PUBLIC_POKEAPI_URL: "https://pokeapi.co/api/v2/pokemon/",
  },

  // Configuração para utilizar images do Next.js
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "raw.githubusercontent.com"
      }
    ]
  }
};

export default nextConfig;
