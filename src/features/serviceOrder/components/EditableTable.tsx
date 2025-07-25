import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  Row,
} from "@tanstack/react-table";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox, SelectField } from "../../../components";
import { useFieldArray } from "react-hook-form";
import { createOptions } from "../../../helpers/options/functionsOptions";
import { BiPlusCircle, BiSolidTrash } from "react-icons/bi";
import { tintOptions } from "../../../helpers/options/serviceorder";
import SelectFieldWithColors from "../../../components/ui/form/SelectFieldWithColors";
import type { Curve } from "../../../types/models/customerprinter";

// Define table row type
interface Option<T = string | number> {
  value: T;
  label: string;
}

interface TintOption extends Option<string> {
  color: string;
}

interface TableRow {
  cliche: boolean;
  tint: TintOption | null;
  lineature: Option<string> | null;
  angle: Option<number> | null;
  dotType: Option<string> | null;
  curve: Option<string> | null;
}

const DraggableRow = ({
  row,
  index,
}: {
  row: Row<TableRow>;
  index: number;
}) => {
  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    isDragging,
  } = useSortable({
    id: `row-${index}`,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      {row.getVisibleCells().map((cell, cellIndex) => (
        <td key={cell.id} className="align-top">
          {cellIndex === 0 ? (
            <div
              {...attributes}
              {...listeners}
              className="drag-handle flex justify-center items-center p-2 first:pl-0 h-full min-h-[60px]"
              style={{ cursor: "grab" }}
            >
              &#9776;
            </div>
          ) : cellIndex === 1 ? (
            // Checkbox column - centralized alignment
            <div className="flex justify-center items-center min-h-[60px] py-2">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          ) : cellIndex === 7 ? (
            // Action column - centralized alignment
            <div className="flex justify-center items-center min-h-[60px] py-2">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          ) : (
            <div className="flex justify-center items-start min-h-[60px] py-2">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          )}
        </td>
      ))}
    </tr>
  );
};

// Props for the table component
interface ColorsTableProps {
  control: any;
  errors: any;
  register: any;
  printerDetails: any;
}

const ColorsTable: React.FC<ColorsTableProps> = ({
  control,
  errors,
  register,
  printerDetails,
}) => {
  const { fields, append, remove, move, replace } = useFieldArray({
    control,
    name: "colors",
  });

  const getDefaultOption = (options: any[]) => {
    return options?.length === 1
      ? { value: options[0], label: options[0] }
      : null;
  };

  // Nova função para lidar com curvas como objetos
  const getDefaultCurveOption = (curves: Curve[]) => {
    // console.log(curves);
    return curves?.length === 1
      ? { value: curves[0].id, label: curves[0].name }
      : null;
  };

  const addCMYKColors = () => {
    const cmykOptions = tintOptions.filter((option) => {
      return (
        option.label === "Cyan" ||
        option.label === "Magenta" ||
        option.label === "Yellow" ||
        option.label === "Black"
      );
    });

    const cmykAngles: { [key: string]: number } = {
      Cyan: 7.5,
      Magenta: 67.5,
      Yellow: 82.5,
      Black: 37.5,
    };

    const availableAngles = printerDetails?.angles?.map(Number) || [];

    const cmykColorsValues = cmykOptions.map((colorOption) => {
      const angleValue = cmykAngles[colorOption.label];
      const isAngleAvailable = availableAngles.includes(angleValue);

      return {
        cliche: true,
        tint: colorOption,
        lineature: getDefaultOption(printerDetails?.lineatures),
        curve: getDefaultCurveOption(printerDetails?.curves),
        angle: isAngleAvailable
          ? {
              value: angleValue,
              label: String(angleValue),
            }
          : null,
        dotType: getDefaultOption(printerDetails?.dotTypes),
      };
    });

    replace(cmykColorsValues);
  };

  const data = printerDetails?.curves?.map((curve: Curve) => ({
    value: curve.id,
    label: curve.name,
  }));

  const columns: ColumnDef<TableRow>[] = [
    {
      header: "Mover",
      cell: ({ row }) => (
        <div className="drag-handle p-2" style={{ cursor: "grab" }}>
          &#9776;
        </div>
      ),
    },
    {
      header: "Clichê?",
      cell: ({ row }) => (
        <Checkbox label="" register={register(`colors.${row.index}.cliche`)} />
      ),
    },
    {
      id: "tint",
      header: () => (
        <div className="flex gap-2 items-center">
          Tinta
          <BiPlusCircle
            className="cursor-pointer"
            size={22}
            onClick={() => {
              append({
                cliche: true,
                tint: null,
                lineature: getDefaultOption(printerDetails?.lineatures),
                curve: getDefaultCurveOption(printerDetails?.curves), // Atualizado
                angle:
                  printerDetails?.angles?.length === 1
                    ? {
                        value: Number(printerDetails.angles[0]),
                        label: String(printerDetails.angles[0]),
                      }
                    : null,
                dotType: getDefaultOption(printerDetails?.dotTypes),
              });
            }}
          />
          <div
            className="cursor-pointer w-4 h-4 rounded-full border"
            style={{
              background: `conic-gradient(
                #009fe3 0 90deg,
                #e6007e 90deg 180deg,
                #ffed00 180deg 270deg,
                #000000 270deg 360deg
              )`,
            }}
            onClick={addCMYKColors}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-full">
          <SelectFieldWithColors
            label=""
            options={tintOptions}
            control={control}
            name={`colors.${row.index}.tint`}
            error={errors?.colors?.[row.index]?.tint}
          />
        </div>
      ),
    },
    {
      header: "Lineatura",
      cell: ({ row }) => (
        <div className="w-full">
          <SelectField
            label=""
            options={printerDetails?.lineatures?.map((lineature: string) =>
              createOptions(lineature),
            )}
            control={control}
            name={`colors.${row.index}.lineature`}
            error={errors?.colors?.[row.index]?.lineature}
            defaultValue={getDefaultOption(printerDetails?.lineatures)}
          />
        </div>
      ),
    },
    {
      header: "Ângulo",
      cell: ({ row }) => (
        <div className="w-full">
          <SelectField
            label=""
            options={printerDetails?.angles?.map((angle: string) => ({
              value: Number(angle),
              label: String(angle),
            }))}
            control={control}
            name={`colors.${row.index}.angle`}
            error={errors?.colors?.[row.index]?.angle}
            defaultValue={
              printerDetails?.angles?.length === 1
                ? {
                    value: Number(printerDetails.angles[0]),
                    label: String(printerDetails.angles[0]),
                  }
                : null
            }
          />
        </div>
      ),
    },
    {
      header: "Ponto",
      cell: ({ row }) => (
        <div className="w-full">
          <SelectField
            label=""
            options={printerDetails?.dotTypes?.map((dotType: string) =>
              createOptions(dotType),
            )}
            control={control}
            name={`colors.${row.index}.dotType`}
            error={errors?.colors?.[row.index]?.dotType}
            defaultValue={getDefaultOption(printerDetails?.dotTypes)}
          />
        </div>
      ),
    },
    {
      header: "Curva",
      cell: ({ row }) => (
        <div className="w-full">
          <SelectField
            label=""
            options={data}
            control={control}
            name={`colors.${row.index}.curve`}
            error={errors?.colors?.[row.index]?.curve}
            defaultValue={getDefaultCurveOption(printerDetails?.curves)}
          />
        </div>
      ),
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
  ];

  const table = useReactTable<TableRow>({
    data: fields as unknown as TableRow[],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = parseInt(String(active.id).split("-")[1], 10);
    const newIndex = parseInt(String(over.id).split("-")[1], 10);
    move(oldIndex, newIndex);
  };

  return (
    <div className="w-full">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={fields.map((_, index) => `row-${index}`)}
          strategy={verticalListSortingStrategy}
        >
          <table className="min-w-full border-separate border-spacing-y-3 table-auto rounded bg-gray-700">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-center font-medium px-2 first:pl-0 pb-2"
                    >
                      <div className="flex justify-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => (
                <DraggableRow key={row.id} row={row} index={index} />
              ))}
            </tbody>
          </table>

          {/* Container fixo para mensagens de erro */}
          <div className="min-h-[24px] mt-2">
            {(errors?.colors?.root?.message || errors?.colors?.message) && (
              <div className="text-red-500 text-sm break-words">
                {errors?.colors?.root?.message
                  ? errors?.colors?.root?.message
                  : errors?.colors?.message}
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ColorsTable;
