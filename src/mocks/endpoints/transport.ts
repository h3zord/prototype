import { DefaultBodyType, http, HttpResponse, StrictRequest } from "msw";
import { unitAbbrevOptions } from "../../helpers/options/customer";
import { generateValidCNPJ } from "../helpers/generateCNPJ";
import { PersonType } from "../../types/models/transport";

// Função para verificar autorização
const isAuthorized = (request: StrictRequest<DefaultBodyType>) => {
  const authorization = request.headers.get("Authorization");
  return authorization !== "Bearer null";
};

// Função para selecionar um valor aleatório das opções
const getRandomOptionValue = (options) => {
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex].value;
};

// Função para gerar CPF ou CNPJ
const getRandomCpfCnpj = (isCnpj: boolean) => {
  return isCnpj
    ? generateValidCNPJ() // CNPJ (14 dígitos)
    : `${Math.floor(10000000000 + Math.random() * 89999999999)}`; // CPF (11 dígitos)
};

// Mock de transportes
export const transportMock = [
  // Mock para o endpoint GET /transport
  http.get(`${import.meta.env.VITE_API_URL}/transport`, ({ request }) => {
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

    let totalTransports = 100;

    // Gerar dados aleatórios de transportes
    let transports = Array.from({ length: Number(pageSize) }, (_, i) => {
      const isCnpj = Math.random() > 0.5;
      const personType = isCnpj ? PersonType.COMPANY : PersonType.INDIVIDUAL;

      return {
        id: i + 1 + pageIndex * pageSize,
        cpfCnpj: getRandomCpfCnpj(isCnpj),
        ie: isCnpj
          ? `${Math.floor(100000000 + Math.random() * 899999999)}`
          : "", // Inscrição Estadual só para PJ
        name: isCnpj ? `Transportador ${i + 1}` : "",
        fantasyName: `Transportador ${i + 1}`,
        phone: `35${Math.floor(900000000 + Math.random() * 8999999)}`,
        financialEmail: `financeiro${i + 1}@empresa.com`,
        personType,
        postalCode: `${Math.floor(90000000 + Math.random() * 999999)}`,
        street: `Rua Exemplo ${i + 1}`,
        neighborhood: `Bairro Exemplo ${i + 1}`,
        number: `${Math.floor(1 + Math.random() * 9999)}`,
        complement: `Complemento ${i + 1}`,
        city: `Cidade Exemplo ${i + 1}`,
        state: `RS`,
        unit: getRandomOptionValue(unitAbbrevOptions),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    // Aplicar filtro de busca
    if (search) {
      transports = transports.filter(
        (transport) =>
          transport.name.includes(search) ||
          transport.phone.includes(search) ||
          transport.cpfCnpj.includes(search),
      );
      totalTransports = transports.length;
    }

    // Aplicar ordenação
    if (sortKey && sortValue) {
      transports = transports.sort((a, b) => {
        const keyA = a[sortKey].toUpperCase();
        const keyB = b[sortKey].toUpperCase();
        if (keyA < keyB) return sortValue === "asc" ? -1 : 1;
        return sortValue === "desc" ? 1 : -1;
      });
    }

    return HttpResponse.json({
      data: transports,
      totalCount: totalTransports,
    });
  }),

  // Mock para o endpoint POST /transport
  http.post(
    `${import.meta.env.VITE_API_URL}/transport`,
    async ({ request }) => {
      const body = await request.json();
      const requiredFields =
        body.personType === PersonType.COMPANY
          ? [
              "cpfCnpj",
              "fantasyName",
              "phone",
              "financialEmail",
              "postalCode",
              "street",
              "unit",
              "neighborhood",
              "number",
              "city",
              "state",
            ]
          : [
              "cpfCnpj",
              "name",
              "phone",
              "postalCode",
              "street",
              "unit",
              "neighborhood",
              "number",
              "city",
              "state",
            ];

      for (const field of requiredFields) {
        if (!body[field]) {
          return new HttpResponse(`Field ${field} is required`, {
            status: 400,
            headers: {
              "Content-Type": "text/plain",
            },
          });
        }
      }

      return HttpResponse.json({
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  ),

  // Mock para o endpoint PUT /transport/:id
  http.put(`${import.meta.env.VITE_API_URL}/transport/:id`, async () => {
    return new HttpResponse(null, {
      status: 204,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  // Mock para o endpoint DELETE /transport/:id
  http.delete(`${import.meta.env.VITE_API_URL}/transport/:id`, async () => {
    return new HttpResponse(null, {
      status: 204,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  http.get(`${import.meta.env.VITE_API_URL}/transport/list`, () => {
    return HttpResponse.json([
      {
        id: 1,
        fantasyName: "Transport 1",
      },
      {
        id: 2,
        fantasyName: "Transport 2",
      },
    ]);
  }),
];
