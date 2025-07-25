import { DefaultBodyType, http, HttpResponse, StrictRequest } from "msw";
import {
  purposeOfPurchaseOptions,
  unitAbbrevOptions,
  companyOptions,
  unitOptions,
  creditAnalysisOptions,
  classificationOptions,
  hasOwnStockOptions,
  productOptions,
} from "../../helpers/options/customer";
import { generateValidCNPJ } from "../helpers/generateCNPJ";
import { Customer, CustomerType, Product } from "../../types/models/customer";

const isAuthorized = (request: StrictRequest<DefaultBodyType>) => {
  const authorization = request.headers.get("Authorization");
  return authorization !== "Bearer null";
};

const getRandomOptionValue = (options: any) => {
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex].value;
};

const getRandomOptionArray = (options: any, maxLength: number) => {
  const shuffledOptions = [...options]; // Clone options to avoid mutation
  const optionsArray = [];

  const length = Math.floor(Math.random() * (maxLength + 1)); // Random length from 0 to maxLength

  // Shuffle the options array
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index
    [shuffledOptions[i], shuffledOptions[j]] = [
      shuffledOptions[j],
      shuffledOptions[i],
    ];
  }

  // Pick the first 'length' shuffled options
  for (let i = 0; i < length; i++) {
    optionsArray.push(shuffledOptions[i].value);
  }

  return optionsArray;
};

const generatePrice = (product: Product, products: Product[]) => {
  return products.includes(product)
    ? Math.floor(1000 + Math.random() * 9000)
    : 0;
};

export const customerMock = [
  // Mock para o endpoint GET /clients
  http.get(`${import.meta.env.VITE_API_URL}/customer`, ({ request }) => {
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

    // Generate random customer data
    let customers: Customer[] = Array.from(
      { length: Number(pageSize) },
      (_, i) => {
        const products = getRandomOptionArray(
          productOptions,
          Object.keys(Product).length,
        );
        return {
          id: i + 1 + pageIndex * pageSize,
          cpfCnpj: generateValidCNPJ(),
          ie: `${Math.floor(100000000 + Math.random() * 899999999)}`,
          name: `Customer ${i + 1 + pageIndex * pageSize}`,
          fantasyName: `Fantasy ${i + 1}`,
          purposeOfPurchase: getRandomOptionValue(purposeOfPurchaseOptions),
          phone: `35${Math.floor(10000000 + Math.random() * 8999999)}`,
          nfeEmail: `nfe${i + 1}@example.com`,
          financialEmail: `finance${i + 1}@example.com`,
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
          notes: `Note for customer ${i + 1}`,
          classification: getRandomOptionValue(classificationOptions),
          hasOwnStock: getRandomOptionValue(hasOwnStockOptions),
          clicheCorrugatedPrice: generatePrice(
            Product.CLICHE_CORRUGATED,
            products,
          ),
          clicheRepairPrice: generatePrice(Product.CLICHE_REPAIR, products),
          // clicheReformPrice: generatePrice(Product.CLICHE_REFORM, products),
          // clicheReformMinimum: 9.8,
          dieCutBlockNationalPrice: generatePrice(
            Product.DIECUTBLOCK_NATIONAL,
            products,
          ),
          dieCutBlockImportedPrice: generatePrice(
            Product.DIECUTBLOCK_IMPORTED,
            products,
          ),
          easyflowPrice: generatePrice(Product.EASYFLOW, products),
          printingPrice: generatePrice(Product.PRINTING, products),
          profileProofIccPrice: generatePrice(
            Product.PROFILE_PROOF_ICC,
            products,
          ),
          finalArtPrice: generatePrice(Product.FINAL_ART, products),
          imageProcessingPrice: generatePrice(
            Product.IMAGE_PROCESSING,
            products,
          ),

          transport: {
            id: i + 1,
            fantasyName: `Transport ${i + 1}`,
          },
          procedure: "",
          representativeId: i + 1,
          operatorId: i + 2,
          representative: {
            id: i + 1,
            firstName: `Representative`,
            lastName: `${i + 1}`,
          },
          operator: {
            id: i + 2,
            firstName: `Operator`,
            lastName: `${i + 2}`,
          },
          products: products,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          type: CustomerType.STANDARD,
          standardCustomers: [],
          externalCustomers: [],
        };
      },
    );

    // Apply search filtering
    if (search) {
      customers = customers.filter(
        (customer) =>
          customer.name.includes(search) ||
          customer.phone.includes(search) ||
          customer.cpfCnpj.includes(search),
      );
      totalCustomers = customers.length;
    }

    // Apply sorting
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
  }),

  http.post(`${import.meta.env.VITE_API_URL}/customer`, async () => {
    return HttpResponse.json({
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  http.put(`${import.meta.env.VITE_API_URL}/customer/:id`, async () => {
    return new HttpResponse(null, {
      status: 204,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  http.post(`${import.meta.env.VITE_API_URL}/customer/external`, async () => {
    return HttpResponse.json({
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  http.put(
    `${import.meta.env.VITE_API_URL}/customer/external/:id`,
    async () => {
      return new HttpResponse(null, {
        status: 204,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  ),

  http.get(`${import.meta.env.VITE_API_URL}/customer/list`, ({ request }) => {
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
        name: "Customer 1",
        externalCustomers: [
          {
            id: 1,
            name: "External Customer 1",
          },
          {
            id: 2,
            name: "External Customer 2",
          },
        ],
      },
      {
        id: 2,
        name: "Customer 2",
        externalCustomers: [
          {
            id: 1,
            name: "External Customer 1",
          },
          {
            id: 2,
            name: "External Customer 2",
          },
        ],
      },
    ]);
  }),

  http.delete(`${import.meta.env.VITE_API_URL}/customer/:id`, async () => {
    return new HttpResponse(null, {
      status: 204,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),
];
