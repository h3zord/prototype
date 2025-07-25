import React, { useEffect, useMemo, useRef } from "react";
import { Control, type UseFormSetValue, useWatch } from "react-hook-form";
import SelectMultiField from "../../../../components/ui/form/SelectMultiField";
import TruncatedMultiSelect from "../../../../components/ui/form/TruncatedMultiSelect";
import { useDashboardFilters } from "../../api/hooks";
import type { Option } from "../../../../components/ui/form/SelectMultiField";
import type { FiltersForm } from "../Viewer/DashboardViewer";
import { getLabelFromValue } from "../../../../helpers/options/getOptionFromValue";
import {
  serviceOrderClicheStatusOptions,
  serviceOrderDieCutBlockStatusOptions,
} from "../../../../helpers/options/serviceorder";
import { unitOptions } from "./options";
import {
  clicheCorrugatedProductFields,
  diecutblockProductFields,
} from "../../api/helpers";

interface FilterSectionProps {
  control: Control<FiltersForm>;
  setValue: UseFormSetValue<FiltersForm>;
  product: "CLICHE_CORRUGATED" | "DIECUTBLOCK";
}

const FilterSection: React.FC<FilterSectionProps> = ({
  control,
  setValue,
  product,
}) => {
  const initialized = useRef(false);

  const { data: filterData, isLoading: loadingFilters } = useDashboardFilters();

  const status = useWatch({ control, name: "status" });

  const toOptions = (items?: string[]) =>
    items?.map((item) => ({ label: item, value: item })) ?? [];

  const clientOptionsList: Option[] =
    filterData?.customers.map((customer) => ({
      label: String(customer.fantasyName || customer.name),
      value: String(customer.id),
    })) ?? [];

  const operatorOptionsList: Option[] =
    filterData?.operators.map((op) => ({
      label: `${op.firstName} ${op.lastName}`,
      value: String(op.id),
    })) ?? [];

  const productFields =
    product === "CLICHE_CORRUGATED"
      ? clicheCorrugatedProductFields
      : diecutblockProductFields;

  const productTypeOptionsList: Option[] = Object.entries(productFields).map(
    ([key, { label }]) => ({
      value: key,
      label,
    }),
  );

  const unitOptionsList: Option[] =
    filterData?.units.map((unit) => ({
      label: getLabelFromValue(unit, unitOptions),
      value: unit,
    })) ?? [];

  const statusOptionsList: Option[] = useMemo(() => {
    const serviceOrderStatusOptions =
      product === "CLICHE_CORRUGATED"
        ? serviceOrderClicheStatusOptions
        : serviceOrderDieCutBlockStatusOptions;

    return (
      filterData?.statuses
        .map((status) => ({
          label: getLabelFromValue(status, serviceOrderStatusOptions),
          value: status,
        }))
        .filter((status) => status.label) ?? []
    );
  }, [filterData?.statuses, product]);

  useEffect(() => {
    const pcpOrders = statusOptionsList.filter(
      (opt) => !["FINALIZED", "CANCELLED", "DISPATCHED"].includes(opt.value),
    );

    setValue("status", pcpOrders, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [product, setValue, statusOptionsList]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 w-full text-[12px]">
      <div className="min-w-[215px]">
        <SelectMultiField
          label="Cliente"
          name="customer"
          control={control}
          options={clientOptionsList}
          loading={loadingFilters}
        />
      </div>
      <div className="min-w-[215px]">
        <SelectMultiField
          label="Produto"
          name="productType"
          control={control}
          options={productTypeOptionsList}
          loading={loadingFilters}
        />
      </div>
      <div className="min-w-[215px]">
        <SelectMultiField
          label="Operador"
          name="operator"
          control={control}
          options={operatorOptionsList}
          loading={loadingFilters}
        />
      </div>
      {product === "CLICHE_CORRUGATED" && (
        <div className="min-w-[215px]">
          <SelectMultiField
            label="Espessura"
            name="thickness"
            control={control}
            options={toOptions(filterData?.thicknesses)}
            loading={loadingFilters}
          />
        </div>
      )}
      <div className="min-w-[215px]">
        <SelectMultiField
          label="Unidade"
          name="unit"
          control={control}
          options={unitOptionsList}
          loading={loadingFilters}
        />
      </div>
      <div className="min-w-[215px]">
        <TruncatedMultiSelect
          label="Status"
          name="status"
          control={control}
          options={statusOptionsList}
          loading={loadingFilters}
        />
      </div>
    </div>
  );
};

export default FilterSection;
