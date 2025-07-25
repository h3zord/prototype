import { DefaultBodyType, http, HttpResponse, StrictRequest } from "msw";
import {
  purposeOfPurchaseOptions,
  unitAbbrevOptions,
  companyOptions,
  unitOptions,
  creditAnalysisOptions,
  classificationOptions,
  hasOwnStockOptions,
  transportOptions,
  statusOptions,
} from "../../helpers/options/customer";
import { generateValidCNPJ } from "../helpers/generateCNPJ";

const isAuthorized = (request: StrictRequest<DefaultBodyType>) => {
  const authorization = request.headers.get("Authorization");
  return authorization !== "Bearer null";
};

const getRandomOptionValue = (options: any) => {
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex].value;
};

// Mock para o endpoint de "external customer"
export const externalCustomerMock = [
  // Mock para o endpoint GET /external/customers
  http.get(
    `${import.meta.env.VITE_API_URL}/external/customers`,
    ({ request }) => {
      if (!isAuthorized(request)) {
        return new HttpResponse("Unauthorized", {
          status: 401,
          headers: {
            "Content-Type": "text/plain",
          },
        });
      }

      const url = new URL(request.url);
      const pageIndex = parseInt(url.searchParams.get("page") || "0", 10);
      const pageSize = parseInt(url.searchParams.get("limit") || "10", 10);
      const search = url.searchParams.get("search") || "";
      const sortKey = url.searchParams.get("sortKey") || undefined;
      const sortValue = url.searchParams.get("sortValue") || undefined;

      let totalCustomers = 200;

      let customers = Array.from({ length: Number(pageSize) }, (_, i) => ({
        id: i + 1 + pageIndex * pageSize,
        cnpj: generateValidCNPJ(),
        ie: `${Math.floor(100000000 + Math.random() * 899999999)}`,
        name: `External Customer ${i + 1 + pageIndex * pageSize}`,
        fantasyName: `External Fantasy ${i + 1}`,
        purposeOfPurchase: getRandomOptionValue(purposeOfPurchaseOptions),
        phone: `35${Math.floor(10000000 + Math.random() * 8999999)}`,
        nfeEmail: `nfe${i + 1}@example.com`,
        financialEmail: `finance${i + 1}@example.com`,
        status: getRandomOptionValue(statusOptions),
        postalCode: `${Math.floor(10000000 + Math.random() * 8999999)}`,
        street: `${i + 1} Example Street`,
        neighborhood: `Neighborhood ${i + 1}`,
        number: `${Math.floor(1 + Math.random() * 1000)}`,
        complement: `Suite ${Math.floor(1 + Math.random() * 500)}`,
        city: `City ${i + 1}`,
        state: getRandomOptionValue(unitAbbrevOptions),
        company: getRandomOptionValue(companyOptions),
        unit: getRandomOptionValue(unitOptions),
        creditAnalysis: getRandomOptionValue(creditAnalysisOptions),
        isVerified: Math.random() > 0.5,
        notes: `Note for external customer ${i + 1}`,
        classification: getRandomOptionValue(classificationOptions),
        hasOwnStock: getRandomOptionValue(hasOwnStockOptions),
        nxPrice: Math.floor(1000 + Math.random() * 9000),
        hdPrice: Math.floor(1000 + Math.random() * 9000),
        transport: getRandomOptionValue(transportOptions),
        procedure: "",
        representativeId: i + 1,
        operatorId: i + 2,
        representative: {
          id: i + 1,
          firstName: `Representative`,
          lastName: `${i + 1}`,
          email: `rep${i + 1}@example.com`,
          isApprover: Math.random() > 0.5,
          groupId: i + 1,
          customerId: i + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        operator: {
          id: i + 2,
          firstName: `Operator`,
          lastName: `${i + 2}`,
          email: `operator${i + 2}@example.com`,
          isApprover: Math.random() > 0.5,
          groupId: i + 2,
          customerId: i + 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      // Filtragem e ordenação iguais ao customer original
      if (search) {
        customers = customers.filter(
          (customer) =>
            customer.name.includes(search) ||
            customer.phone.includes(search) ||
            customer.cnpj.includes(search),
        );
        totalCustomers = customers.length;
      }

      if (
        sortKey &&
        sortValue &&
        !sortKey.includes("_") &&
        sortKey != "createdAt"
      ) {
        customers = customers.sort((userA: any, userB: any) => {
          const keyA = userA[sortKey].toUpperCase();
          const keyB = userB[sortKey].toUpperCase();
          if (keyA < keyB) {
            return sortValue === "asc" ? -1 : 1;
          }
          return sortValue === "desc" ? 1 : -1;
        });
      }

      return HttpResponse.json({
        data: customers,
        totalCount: totalCustomers,
      });
    },
  ),

  http.post(`${import.meta.env.VITE_API_URL}/external/customer`, async () => {
    return HttpResponse.json({
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  http.put(
    `${import.meta.env.VITE_API_URL}/external/customer/:id`,
    async () => {
      return new HttpResponse(null, {
        status: 204,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  ),

  http.get(
    `${import.meta.env.VITE_API_URL}/external/customer/list`,
    ({ request }) => {
      if (!isAuthorized(request)) {
        return new HttpResponse("Unauthorized", {
          status: 401,
          headers: {
            "Content-Type": "text/plain",
          },
        });
      }

      return HttpResponse.json([
        {
          id: 1,
          name: "External Customer 1",
        },
        {
          id: 2,
          name: "External Customer 2",
        },
      ]);
    },
  ),

  http.delete(
    `${import.meta.env.VITE_API_URL}/external/customer/:id`,
    async () => {
      return new HttpResponse(null, {
        status: 204,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  ),
];
