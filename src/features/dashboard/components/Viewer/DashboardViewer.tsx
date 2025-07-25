import React, { useEffect, useState } from "react";
import StatsGrid from "../Cards/StatsGrid";
import ToolBar from "../Filters/ToolBar";
import FilterSection from "../Filters/FilterSection";
import { Controller, useForm } from "react-hook-form";
import { useDashboardData } from "../../api/hooks";
import { ChartGrid } from "../Chart/ChartGrid";
import { makeStatsList } from "../../helpers/makeStatsList";
import type { Option } from "../../../../components/ui/form/SelectMultiField";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../../components/components/ui/tabs";

export interface FiltersForm {
  product: "CLICHE_CORRUGATED" | "DIECUTBLOCK";
  dateInterval?: [Date, Date] | undefined;
  customer: Option[];
  status: Option[];
  operator: Option[];
  thickness: Option[];
  productType: Option[];
  unit: Option[];
}

export type FiltersMapped = {
  products: "CLICHE_CORRUGATED" | "DIECUTBLOCK";
  startDate?: Date; // Tornando startDate opcional
  endDate?: Date; // Tornando endDate opcional
  customers: (string | number)[];
  operators: (string | number)[];
  thickness: (string | number)[];
  units: (string | number)[];
  statuses: (string | number)[];
  productType: (string | number)[];
};

export interface ProductTypeMetrics {
  title: string;
  value: number;
  delta: number;
  measureDetails: {
    channel: number;
    international: number;
    national: number;
  } | null;
}

interface LooseOption {
  value?: string | number;
}

const mapOptionValues = (
  options?: (LooseOption | undefined)[],
): (string | number)[] =>
  (options ?? [])
    .map((item) => item?.value)
    .filter((value): value is string | number => value !== undefined);

export const DashboardViewer: React.FC = () => {
  const initialFilters: FiltersMapped = {
    products: "CLICHE_CORRUGATED",
    thickness: [],
    customers: [],
    operators: [],
    units: [],
    statuses: [],
    productType: [],
  };

  const [filters, setFilters] = useState<FiltersMapped>(initialFilters);
  const [productTypeMetrics, setProductTypeMetrics] = useState<
    ProductTypeMetrics[]
  >([]);
  const { data: dashboardData } = useDashboardData({ filters });

  const { control, watch, setValue } = useForm<FiltersForm>({
    defaultValues: {
      customer: [],
      productType: [],
      operator: [],
      thickness: [],
      unit: [],
      status: [],
      product: initialFilters.products,
      dateInterval: undefined, // Definindo dateInterval como undefined por padrão
    },
  });

  const product = watch("product");

  useEffect(() => {
    const subscription = watch((data) => {
      if (!data.product) return;

      const mapped: FiltersMapped = {
        products: data.product,
        customers: mapOptionValues(data.customer),
        operators: mapOptionValues(data.operator),
        units: mapOptionValues(data.unit),
        statuses: mapOptionValues(data.status),
        productType: mapOptionValues(data.productType),
        thickness:
          data.product === "CLICHE_CORRUGATED"
            ? mapOptionValues(data.thickness)
            : [],
      };

      if (data.dateInterval && data.dateInterval.length === 2) {
        const [startDate, endDate] = data.dateInterval;
        if (startDate && endDate) {
          mapped.startDate = startDate;
          mapped.endDate = endDate;
        }
      }

      setFilters(mapped);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (dashboardData) {
      const stats = makeStatsList({
        cardStats: dashboardData.cards,
        product,
      });

      setProductTypeMetrics(stats);
    }
  }, [dashboardData, product]);

  const comparisonPeriod = "mês anterior";

  return (
    <div className="">
      <ToolBar control={control} />

      <Controller
        control={control}
        name="product"
        render={({ field }) => (
          <Tabs
            value={field.value}
            onValueChange={field.onChange}
            className="space-y-4 w-full"
          >
            <TabsList className="grid w-full grid-cols-2 border border-gray-600">
              <TabsTrigger
                value="CLICHE_CORRUGATED"
                className="text-white data-[state=active]:bg-[#f9a853] text-[12px]"
              >
                Clichê
              </TabsTrigger>
              <TabsTrigger
                value="DIECUTBLOCK"
                className="text-white data-[state=active]:bg-[#f9a853] text-[12px]"
              >
                Forma
              </TabsTrigger>
            </TabsList>

            <FilterSection
              control={control}
              setValue={setValue}
              product={product}
            />

            <TabsContent value="CLICHE_CORRUGATED" className="space-y-5">
              <StatsGrid
                stats={productTypeMetrics}
                comparisonPeriod={comparisonPeriod}
                showComparison={dashboardData?.cards.showComparison}
                product="CLICHE_CORRUGATED"
                totalGeneral={
                  dashboardData?.cards.totalGeneral.clicheCorrugated
                }
              />
              <ChartGrid
                product={product}
                filters={filters}
                productionByProduct={
                  dashboardData?.productionByProduct?.CLICHE_CORRUGATED
                }
                productionByOperator={
                  dashboardData?.productionByOperator?.CLICHE_CORRUGATED
                }
                productionByCustomer={
                  dashboardData?.productionByCustomer?.CLICHE_CORRUGATED
                }
                productionTimeByCustomer={
                  dashboardData?.avgProductionTimeByCustomer?.CLICHE_CORRUGATED
                }
                deliveryTimeByCustomer={
                  dashboardData?.avgDeliveryTimeByCustomer?.CLICHE_CORRUGATED
                }
                operationTimeByCustomer={
                  dashboardData?.avgProductionTimeByOperation
                }
                salesByRepresentative={
                  dashboardData?.salesByRepresentative?.CLICHE_CORRUGATED
                }
                statusDurationByCustomer={
                  dashboardData?.statusDurationByCustomer
                }
              />
            </TabsContent>

            <TabsContent value="DIECUTBLOCK" className="space-y-5">
              <StatsGrid
                stats={productTypeMetrics}
                comparisonPeriod={comparisonPeriod}
                showComparison={dashboardData?.cards.showComparison}
                product="DIECUTBLOCK"
                totalGeneral={dashboardData?.cards.totalGeneral.dieCutBlock}
              />
              <ChartGrid
                product={product}
                filters={filters}
                productionByProduct={
                  dashboardData?.productionByProduct?.DIECUTBLOCK
                }
                productionByOperator={
                  dashboardData?.productionByOperator?.DIECUTBLOCK
                }
                productionByCustomer={
                  dashboardData?.productionByCustomer?.DIECUTBLOCK
                }
                productionTimeByCustomer={
                  dashboardData?.avgProductionTimeByCustomer?.DIECUTBLOCK
                }
                deliveryTimeByCustomer={
                  dashboardData?.avgDeliveryTimeByCustomer?.DIECUTBLOCK
                }
                operationTimeByCustomer={
                  dashboardData?.avgProductionTimeByOperation
                }
                salesByRepresentative={
                  dashboardData?.salesByRepresentative?.DIECUTBLOCK
                }
                statusDurationByCustomer={
                  dashboardData?.statusDurationByCustomer
                }
              />
            </TabsContent>
          </Tabs>
        )}
      />
    </div>
  );
};
