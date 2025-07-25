import { DefaultBodyType, http, HttpResponse, StrictRequest } from "msw";
import { flapOptions } from "../../helpers/options/printer";

const isAuthorized = (request: StrictRequest<DefaultBodyType>) => {
  const authorization = request.headers.get("Authorization");
  return authorization !== "Bearer null";
};

const getRandomOptionValue = (options: any) => {
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex].value;
};

export const printerMock = [
  // Mock para GET /customer/:idCustomer/printer
  http.get(
    `${import.meta.env.VITE_API_URL}/customer/:idCustomer/printer`,
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
      const path = url.pathname;

      // Extrai o idCustomer do path usando regex
      const idCustomerMatch = path.match(/\/customer\/(\d+)\/printer/);
      const idCustomer = idCustomerMatch
        ? parseInt(idCustomerMatch[1], 10)
        : null;

      if (!idCustomer) {
        return HttpResponse.json(
          { error: "Invalid or missing idCustomer" },
          { status: 400 },
        );
      }

      // Recupera parâmetros de paginação, busca e ordenação
      const pageIndex = parseInt(url.searchParams.get("page") || "0", 10);
      const pageSize = parseInt(url.searchParams.get("limit") || "10", 10);
      const search = url.searchParams.get("search") || "";
      const sortKey = url.searchParams.get("sortKey") || undefined;
      const sortValue = url.searchParams.get("sortValue") || undefined;

      // Total fictício de impressoras
      let totalPrinters = 50;

      // Gera impressoras no formato esperado
      let printers = Array.from({ length: totalPrinters }, (_, i) => ({
        id: i + 1,
        name: `Printer ${i + 1}`,
        type: "CORRUGATED_PRINTER",
        corrugatedPrinter: {
          id: i + 1000,
          printerId: i + 1,
          variation: `${Math.floor(Math.random() * 20)}`,
          channelName: "Margin 177",
          channelMinimum: 1,
          flap: getRandomOptionValue(flapOptions),
        },
        colorsAmount: `${Math.floor(Math.random() * 10) + 1}`,
        trap: `${Math.floor(Math.random() * 5) + 1}`,
        lineatures: ["12lpcm/31lpi", "20lpcm/50lpi", "24lpcm/62lpi"],
        thicknesses: ["1.14 - ESXR"],
        dotTypes: ["C - Topo Plano", "crs01 - WSI_Crystal C16"],
        curves: ["Curva 1", "Curva 2", "Curva 3"],
        angles: [15, 30, 45, 60],
        customer: {
          id: idCustomer,
          name: `Customer ${idCustomer}`,
        },
        customerId: idCustomer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      // Aplica busca
      if (search) {
        printers = printers.filter((printer) =>
          printer.name.toLowerCase().includes(search.toLowerCase()),
        );
        totalPrinters = printers.length;
      }

      // Aplica ordenação
      if (sortKey && sortValue && sortKey in printers[0]) {
        printers = printers.sort((a, b) => {
          const keyA = a[sortKey];
          const keyB = b[sortKey];
          if (keyA < keyB) return sortValue === "asc" ? -1 : 1;
          if (keyA > keyB) return sortValue === "asc" ? 1 : -1;
          return 0;
        });
      }

      // Aplica paginação
      const start = pageIndex * pageSize;
      const end = start + pageSize;
      const paginatedPrinters = printers.slice(start, end);

      // Retorna os dados no formato esperado
      return HttpResponse.json({
        data: paginatedPrinters,
        totalCount: totalPrinters,
      });
    },
  ),

  // Mock para POST /customer/:idCustomer/printer
  http.post(
    `${import.meta.env.VITE_API_URL}/customer/:idCustomer/printer`,
    async () => {
      return HttpResponse.json(
        { message: "Printer created successfully" },
        { status: 201, headers: { "Content-Type": "application/json" } },
      );
    },
  ),

  // Mock para PUT /customer/:idCustomer/printer/:idPrinter
  http.put(
    `${import.meta.env.VITE_API_URL}/customer/:idCustomer/printer/:idPrinter`,
    async () => {
      return new HttpResponse(null, {
        status: 204,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  ),

  // Mock para DELETE /customer/:idCustomer/printer/:idPrinter
  http.delete(
    `${import.meta.env.VITE_API_URL}/customer/:idCustomer/printer/:idPrinter`,
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
    `${import.meta.env.VITE_API_URL}/customer/:idCustomer/printer`,
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
      const path = url.pathname;

      // Extrai o idCustomer do path usando regex
      const idCustomerMatch = path.match(/\/customer\/(\d+)\/printer/);
      const idCustomer = idCustomerMatch
        ? parseInt(idCustomerMatch[1], 10)
        : null;

      // Verifica se o idCustomer é válido
      if (!idCustomer) {
        return HttpResponse.json(
          { error: "Invalid or missing idCustomer" },
          { status: 400 },
        );
      }

      // Recupera parâmetros de paginação, busca e ordenação
      const pageIndex = parseInt(url.searchParams.get("page") || "0", 10);
      const pageSize = parseInt(url.searchParams.get("limit") || "10", 10);
      const search = url.searchParams.get("search") || "";
      const sortKey = url.searchParams.get("sortKey") || undefined;
      const sortValue = url.searchParams.get("sortValue") || undefined;

      // Total fictício de impressoras
      let totalPrinters = 50;

      // Gera impressoras no formato esperado
      let printers = Array.from({ length: totalPrinters }, (_, i) => ({
        id: i + 1,
        name: `Printer ${i + 1}`,
        type: "CORRUGATED_PRINTER",
        corrugatedPrinter: {
          id: i + 1000,
          printerId: i + 1,
          variation: `${Math.floor(Math.random() * 20)}`,
          lap: getRandomOptionValue(flapOptions),
          colorsAmount: "4",
          defaultLineature: "21",
          lineatures: ["21", "22", "23", "24"],
        },
        customer: {
          id: idCustomer,
          name: `Customer ${idCustomer}`,
        },
        customerId: idCustomer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      // Aplica busca
      if (search) {
        printers = printers.filter((printer) =>
          printer.name.toLowerCase().includes(search.toLowerCase()),
        );
        totalPrinters = printers.length;
      }

      // Aplica ordenação
      if (sortKey && sortValue && sortKey in printers[0]) {
        printers = printers.sort((a, b) => {
          const keyA = a[sortKey];
          const keyB = b[sortKey];
          if (keyA < keyB) return sortValue === "asc" ? -1 : 1;
          if (keyA > keyB) return sortValue === "asc" ? 1 : -1;
          return 0;
        });
      }

      // Aplica paginação
      const start = pageIndex * pageSize;
      const end = start + pageSize;
      const paginatedPrinters = printers.slice(start, end);

      // Retorna os dados no formato esperado
      return HttpResponse.json({
        data: paginatedPrinters,
        totalCount: totalPrinters,
      });
    },
  ),

  // Mock para GET /customer/:idCustomer/printer/list
  http.get(
    `${import.meta.env.VITE_API_URL}/customer/:idCustomer/printer/list`,
    ({ request, params }) => {
      if (!isAuthorized(request)) {
        return new HttpResponse("Unauthorized", {
          status: 401,
          headers: {
            "Content-Type": "text/plain",
          },
        });
      }

      const idCustomer = parseInt(params.idCustomer as string, 10);

      if (!idCustomer || isNaN(idCustomer)) {
        return HttpResponse.json(
          { error: "Invalid or missing idCustomer" },
          { status: 400 },
        );
      }

      // Geração de dados fictícios de impressoras
      const printers = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        name: `Printer ${i + 1}`,
        lineatures: ["12lpcm/31lpi", "20lpcm/50lpi", "24lpcm/62lpi"],
        thicknesses: [
          `${Math.random().toFixed(2)} mm`,
          `${(Math.random() + 1).toFixed(2)} mm`,
        ],
        dotTypes: ["C - Topo Plano", "crs01 - WSI_Crystal C16"],
        curves: ["Curva 1", "Curva 2", "Curva 3"],
        angles: [15, 30, 45, 60],
        colorsAmount: Math.floor(Math.random() * 10) + 1,
        trap: 12,
        cylinders: [
          {
            id: 1,
            cylinder: 12,
            polyesterMaxHeight: 11,
            clicheMaxWidth: 12,
            distortion: 12,
            dieCutBlockDistortion: 12,
          },
        ],
        corrugatedPrinter: {
          id: 51,
          variation: 3,
          flap: "LEFT",
          channelName: "Martin 177",
          channelMinimum: 1,
          printerId: i + 1,
        },
        profiles: [
          { id: 1, name: "perfil 1" },
          { id: 2, name: "perfil 2" },
        ],
      }));

      return HttpResponse.json(printers);
    },
  ),
];
