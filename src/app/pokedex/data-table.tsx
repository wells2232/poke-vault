"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import { SelectItem, SelectTrigger } from "@radix-ui/react-select";
import { PokemonTypes } from "../utils/PokemonTypes";
import { Pokemon } from "../services/types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  canPrevPage: boolean;
  canNextPage: boolean;
  totalPages: number;
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
}

export function DataTable<TData extends Pokemon, TValue>({
  columns,
  data,
  canPrevPage,
  canNextPage,
  totalPages,
  pageNumber,
  setPageNumber,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    enableMultiSort: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-end gap-4 py-4">
        <Input
          placeholder="Buscar Pokémon..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className=" w-[180px] bg-[rgba(255,255,255,0.1)] rounded-full border-none text-white ring-offset-[#ff3366]"
        />
        <div className="flex items-center gap-4">
          <Select
            value={table.getColumn("types")?.getFilterValue() as string}
            onValueChange={(value) => {
              if (value === "todos") {
                table.resetColumnFilters();
                return;
              }
              table.getColumn("types")?.setFilterValue(value);
            }}
          >
            <SelectTrigger className="h-10 w-[180px] bg-[rgba(255,255,255,0.1)] rounded-full ">
              <SelectValue placeholder="Selecione um tipo" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 opacity-100 text-white">
              <SelectGroup>
                <SelectLabel>Filtrar por Tipo</SelectLabel>
                <SelectItem
                  className="p-2 cursor-pointer hover:bg-[rgba(255,255,255,0.1)]"
                  value="todos"
                >
                  Todos os Tipos
                </SelectItem>
                {PokemonTypes.map((type) => (
                  <SelectItem
                    className="p-2 cursor-pointer hover:bg-[rgba(255,255,255,0.1)]"
                    key={type.label}
                    value={type.value}
                  >
                    {type.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border text-white border-zinc-50">
        <Table>
          <TableHeader className="hover:bg-inherit">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="rounded-lg w-fit">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="h-6"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="rounded-md"
                      style={{ minWidth: "10px" }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center space-x-2 py-4">
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            table.previousPage();
            setPageNumber(pageNumber - 1);
          }}
          disabled={!canPrevPage}
        >
          Anterior
        </Button>
        <span className="text-white">
          {pageNumber} de {totalPages}
        </span>
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            table.nextPage();
            setPageNumber(pageNumber + 1);
          }}
          disabled={!canNextPage}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
