"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pokemon } from "@/app/services/types";
import TypeBadge from "@/components/TypeBadge";
import Image from "next/image";
import { formatId, formatName } from "../utils/formatting";

import { Column } from "@tanstack/react-table";

interface SortButtonProps {
  column: Column<Pokemon, unknown>;
  header: string;
}

export const SortButton = ({ column, header }: SortButtonProps) => {
  const isSorted = column.getIsSorted();

  if (!isSorted) {
    return (
      <button
        className="flex items-center justify-start"
        onClick={() => {
          column.clearSorting();
          column.toggleSorting(true);
        }}
      >
        {header}
        <SortIcon
          className="ml-2 h-4 w-4"
          g1="currentColor"
          g2="currentColor"
        />
      </button>
    );
  }

  return (
    <button
      className="flex items-center justify-start"
      onClick={() => {
        column.clearSorting();
        column.toggleSorting(column.getIsSorted() === "asc");
      }}
    >
      {header}

      {isSorted === "asc" ? (
        <SortIcon className="ml-2 h-4 w-4" g2="white" />
      ) : (
        <SortIcon className="ml-2 h-4 w-4" g1="white" />
      )}
    </button>
  );
};

export const columns: ColumnDef<Pokemon>[] = [
  {
    accessorKey: "Pokedex Number",
    header: ({ column }: { column: Column<Pokemon, unknown> }) => {
      return <SortButton column={column} header="Pokédex Number" />;
    },
    cell: ({ row }) => {
      const formattedId = formatId(row.original.id);
      return <div>{formattedId}</div>;
    },
    sortingFn: (rowA, rowB) => rowA.original.id - rowB.original.id,
  },
  {
    accessorKey: "sprites",
    header: "Sprite",
    cell: ({ row }) => (
      <Image
        className="flex items-center justify-center"
        src={row.original.sprites.front_default || "/pokemon-placeholder.svg"}
        width={64}
        height={48}
        alt={row.original.name}
      />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <SortButton column={column} header="Name" />;
    },
    cell: ({ row }) => {
      const formattedName = formatName(row.original.name);
      return (
        <div>
          <Link
            href={`/pokemon/${row.original.id}`}
            className="text-white hover:text-[#ff3366]"
          >
            {formattedName}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "types",
    header: "Types",
    cell: ({ row }) => (
      <div className="flex gap-2">
        {row.original.types.map((type) => (
          <TypeBadge key={type.type.name} type={type.type.name} />
        ))}
      </div>
    ),
    filterFn: (row, columnId, filterValue) => {
      return row.original.types.some((type) =>
        type.type.name.includes(filterValue)
      );
    },
  },
  {
    accessorKey: "HP",
    header: ({ column }) => {
      return <SortButton column={column} header="HP" />;
    },
    cell: ({ row }) => <div>{row.original.stats[0].base_stat || null}</div>,
    sortingFn: (rowA, rowB) => {
      const hpA = rowA.original.stats[0].base_stat;
      const hpB = rowB.original.stats[0].base_stat;
      return hpA - hpB;
    },
  },
  {
    accessorKey: "Attack",
    header: ({ column }) => {
      return <SortButton column={column} header="Attack" />;
    },
    cell: ({ row }) => <div>{row.original.stats[1].base_stat || "-"}</div>,
    sortingFn: (rowA, rowB) => {
      const hpA = rowA.original.stats[1].base_stat;
      const hpB = rowB.original.stats[1].base_stat;
      return hpA - hpB;
    },
  },
  {
    accessorKey: "Defense",
    header: ({ column }) => {
      return <SortButton column={column} header="Defense" />;
    },
    cell: ({ row }) => <div>{row.original.stats[2].base_stat || "-"}</div>,
    sortingFn: (rowA, rowB) => {
      const hpA = rowA.original.stats[2].base_stat;
      const hpB = rowB.original.stats[2].base_stat;
      return hpA - hpB;
    },
  },
  {
    accessorKey: "Speed",
    header: ({ column }) => {
      return <SortButton column={column} header="Speed" />;
    },
    cell: ({ row }) => <div>{row.original.stats[5].base_stat || "-"}</div>,
    sortingFn: (rowA, rowB) => {
      const hpA = rowA.original.stats[5].base_stat;
      const hpB = rowB.original.stats[5].base_stat;
      return hpA - hpB;
    },
  },
  {
    accessorKey: "special-attack",
    header: ({ column }) => {
      return <SortButton column={column} header="Sp. Atk" />;
    },
    cell: ({ row }) => <div>{row.original.stats[3].base_stat || "-"}</div>,
    sortingFn: (rowA, rowB) => {
      const hpA = rowA.original.stats[3].base_stat;
      const hpB = rowB.original.stats[3].base_stat;
      return hpA - hpB;
    },
  },
  {
    accessorKey: "special-defense",
    header: ({ column }) => {
      return <SortButton column={column} header="Sp. Def" />;
    },
    cell: ({ row }) => <div>{row.original.stats[4].base_stat || "-"}</div>,
    sortingFn: (rowA, rowB) => {
      const hpA = rowA.original.stats[4].base_stat;
      const hpB = rowB.original.stats[4].base_stat;
      return hpA - hpB;
    },
  },
];

import * as React from "react";
import Link from "next/link";
interface SortIconProps extends React.SVGProps<SVGSVGElement> {
  g1?: string;
  g2?: string;
}

const SortIcon = (props: SortIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-arrow-up-down"
    {...props}
  >
    <g stroke={props.g1 || "currentColor"}>
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
    </g>
    <g stroke={props.g2 || "currentColor"}>
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </g>
  </svg>
);
export default SortIcon;
