"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Pokemon } from "@/app/services/types";
import { formatStats } from "@/app/utils/formatting";

interface PokemonStatsProps {
  pokemon: Pokemon;
}

export function PokemonStats(props: PokemonStatsProps) {
  const pokemon = props.pokemon;

  const statNames = ["HP", "Attack", "Defense", "Speed", "Sp. Atk", "Sp. Def"];
  const stats = formatStats(pokemon.stats).filter((stat) =>
    statNames.includes(stat.name)
  );

  if (stats.length < 6) {
    return <div>Error: Incomplete stats data</div>;
  }

  const chartData = [
    { statName: "HP", value: stats[0].value },
    { statName: "Attack", value: stats[1].value },
    { statName: "Defense", value: stats[2].value },
    { statName: "Speed", value: stats[3].value },
    { statName: "Sp. Atk", value: stats[4].value },
    { statName: "Sp. Def", value: stats[5].value },
  ];

  const chartConfig = {
    HP: {
      label: "HP",
    },
    Attack: {
      label: "Attack",
    },
    Defense: {
      label: "Defense",
    },
    Speed: {
      label: "Speed",
    },

    "Sp. Atk": {
      label: "Sp. Atk",
    },
    "Sp. Def": {
      label: "Sp. Def",
    },
  };

  interface TooltipProps {
    active?: boolean;
    payload?: {
      value: number;
      payload: {
        statName: string;
      };
    }[];
  }

  const ChartTooltipContent = ({ active, payload }: TooltipProps) => {
    if (!active || !payload?.length) {
      return null;
    }

    return (
      <div className="bg-[#0e0d0de0] p-2 rounded-md shadow-md">
        <p className="text-sm font-semibold">
          {`${payload[0].payload.statName}: ${payload[0].value}`}
        </p>
      </div>
    );
  };

  return (
    <Card className="bg-[rgba(255,255,255,0.01)] rounded-3xl">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-white">Base Stats</CardTitle>
      </CardHeader>
      <CardContent className="py-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-[400px] h-[240px]"
        >
          <RadarChart data={chartData} outerRadius={100} className="p-8">
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="statName" />
            <PolarGrid />
            <Radar
              dataKey="value"
              name="statName"
              fill="#ff3366"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
