import React, { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
  useFieldArray,
  Control,
} from "react-hook-form";
import { BiPlusCircle, BiSolidTrash } from "react-icons/bi";
import DecimalInputFixed from "../../../components/ui/form/DecimalInput";
import { convertStringToNumber } from "../../../helpers/convertStringToNumber";
import { InsertMeasuresCorrugatedClicheFormInput } from "../../serviceOrder/api/schemas";

type ClicheColorRow = InsertMeasuresCorrugatedClicheFormInput["colors"][number];
// Props for the table component
interface ClicheColorsTableProps {
  control: Control<InsertMeasuresCorrugatedClicheFormInput>;
  errors: FieldErrors<InsertMeasuresCorrugatedClicheFormInput>;
  register: UseFormRegister<InsertMeasuresCorrugatedClicheFormInput>;
  watch: UseFormWatch<InsertMeasuresCorrugatedClicheFormInput>;
}

const ClicheColorsTable: React.FC<ClicheColorsTableProps> = ({
  control,
  errors,
  watch,
  register,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "colors",
  });

  const columns: ColumnDef<ClicheColorRow>[] = useMemo(
    () => [
      {
        id: "lxa",
        header: () => (
          <div className="flex gap-2 items-center">
            L x A cm
            <BiPlusCircle
              className="cursor-pointer"
              size={22}
              onClick={() =>
                append({
                  quantity: "",
                  width: "",
                  height: "",
                  tint: null,
                })
              }
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex gap-2 items-center">
            <DecimalInputFixed
              label=""
              register={register(`colors.${row.index}.width`)} // Sem setValueAs!
              placeholder="Digite a largura"
              error={errors?.colors?.[row.index]?.width}
            />
            x
            <DecimalInputFixed
              label=""
              register={register(`colors.${row.index}.height`)} // Sem setValueAs!
              placeholder="Digite a altura"
              error={errors?.colors?.[row.index]?.height}
            />
          </div>
        ),
      },
      {
        header: "Quantidade",
        cell: ({ row }) => (
          <DecimalInputFixed
            label=""
            placeholder="Digite a quantidade"
            register={register(`colors.${row.index}.quantity`)}
            error={errors?.colors?.[row.index]?.quantity}
          />
        ),
      },
      {
        header: "Total cm²",
        cell: ({ row }) => {
          const width = Number(watch(`colors.${row.index}.width`)) || 0;
          const height = Number(watch(`colors.${row.index}.height`)) || 0;
          const quantity = Number(watch(`colors.${row.index}.quantity`)) || 0;
          const total = quantity * width * height;

          return <div>{convertStringToNumber(total)}</div>;
        },
      },
      {
        header: "Ação",
        cell: ({ row }) => (
          <BiSolidTrash
            size={18}
            className="cursor-pointer"
            onClick={() => remove(row.index)}
          />
        ),
      },
    ],
    [errors],
  );

  const table = useReactTable({
    data: fields,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <table className="min-w-full border-separate border-spacing-y-3 table-auto rounded bg-gray-700">
        <thead className="text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className="relative font-normal text-center px-2"
                >
                  <div className="flex justify-center">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </div>
                  {/* <ColumnDivider isLast={headersArray.length - 1 === index} /> */}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="bg-gray-600 text-white">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-2 py-1.5">
                  <div className="flex justify-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-red-500 mt-1 text-sm break-words">
        {errors?.colors?.root?.message
          ? errors?.colors?.root?.message
          : errors?.colors?.message}
      </div>
    </div>
  );
};

export default ClicheColorsTable;
