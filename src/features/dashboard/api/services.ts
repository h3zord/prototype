import { api } from "../../../config/api";

export interface DashboardFilters {
  customers: {
    id: number;
    name: string;
    fantasyName: string;
  }[];
  operators: {
    id: number;
    firstName: string;
    lastName: string;
  }[];
  thicknesses: string[];
  products: string[];
  units: string[];
  statuses: string[];
}

export const getDashboardFilters = async (): Promise<DashboardFilters> => {
  const response = await api.get<DashboardFilters>("/dashboard/filters");

  return response.data;
};

export interface ProductTypeMetrics {
  current: number;
  diffPct: string | null;
  previous: number;
}

export interface CardMetric {
  current: number;
  previous: number;
  diffPct: number;
}

export interface CardStats {
  new: CardMetric;
  alteration: CardMetric;
  reprint: CardMetric;
  replacement: CardMetric;
  reassembly: CardMetric;
  repair: CardMetric;
  reconfection: CardMetric;
}

interface ClicheCorrugatedTotal {
  quantity: number;
  measures: {
    total: number;
  };
}

interface DieCutBlockTotal {
  quantity: number;
  measures: {
    channel: number;
    international: number;
    national: number;
    total: number;
  };
}

export interface DashboardData {
  cards: {
    CLICHE_CORRUGATED: CardStats;
    DIECUTBLOCK: CardStats;
    comparedTo: ProductTypeMetrics;
    showComparison: boolean;
    totalGeneral: {
      clicheCorrugated: ClicheCorrugatedTotal;
      dieCutBlock: DieCutBlockTotal;
    };
  };
  productionByProduct: {
    CLICHE_CORRUGATED?: Record<string, number>;
    DIECUTBLOCK?: Record<string, number>;
  };
  productionByCustomer: {
    CLICHE_CORRUGATED: Record<string, number>;
    DIECUTBLOCK: Record<string, number>;
  };
  productionByOperator: {
    CLICHE_CORRUGATED: {
      area?: Record<string, number>;
      quantity: Record<string, number>;
    };
    DIECUTBLOCK: {
      area?: Record<string, number>;
      quantity: Record<string, number>;
    };
  };
  avgProductionTimeByCustomer?: {
    CLICHE_CORRUGATED: Record<
      string,
      {
        time: string;
        count: number;
      }
    >;
    DIECUTBLOCK: Record<
      string,
      {
        time: string;
        count: number;
      }
    >;
  };
  avgProductionTimeByOperation?: Record<
    string,
    {
      CLICHE_CORRUGATED: Record<string, string>;
      DIECUTBLOCK: Record<string, string>;
    }
  >;
  avgDeliveryTimeByCustomer?: {
    CLICHE_CORRUGATED: Record<
      string,
      {
        time: string;
        count: number;
      }
    >;
    DIECUTBLOCK: Record<
      string,
      {
        time: string;
        count: number;
      }
    >;
  };
  salesByRepresentative?: {
    CLICHE_CORRUGATED?: Record<
      string,
      Record<
        string,
        {
          area: number;
          quantity: number;
        }
      >
    >;
    DIECUTBLOCK?: Record<
      string,
      Record<
        string,
        {
          area: number;
          quantity: number;
        }
      >
    >;
  };
  statusDurationByCustomer?: {
    CLICHE_CORRUGATED?: Record<
      string,
      Record<string, { time: string; count: number }>
    >;
    DIECUTBLOCK?: Record<
      string,
      Record<string, { time: string; count: number }>
    >;
  };
}

export interface GetDashboardDataParams {
  filters?: {
    startDate?: Date;
    endDate?: Date;
    products: "CLICHE_CORRUGATED" | "DIECUTBLOCK";
    customers: (string | number)[];
    operators: (string | number)[];
    units: (string | number)[];
    statuses: (string | number)[];
    productType: (string | number)[];
  };
}

export const getDashboardData = async ({
  filters,
}: GetDashboardDataParams): Promise<DashboardData> => {
  const response = await api.get<DashboardData>("/dashboard/data", {
    params: {
      ...filters,
    },
  });

  return response.data;
};
