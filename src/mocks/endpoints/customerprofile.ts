import { DefaultBodyType, http, HttpResponse, StrictRequest } from "msw";

// Função para verificar autorização
const isAuthorized = (request: StrictRequest<DefaultBodyType>) => {
  const authorization = request.headers.get("Authorization");
  return authorization !== "Bearer null";
};

// Função para gerar valores aleatórios
const getRandomPrinterId = () => Math.floor(Math.random() * 100) + 1;

export const profileMock = [
  // Mock para GET /customer/:idCustomer/printer/:idPrinter/profile
  http.get(
    `${import.meta.env.VITE_API_URL}/customer/:idCustomer/printer/:idPrinter/profile`,
    ({ request, params }) => {
      if (!isAuthorized(request)) {
        return new HttpResponse("Unauthorized", {
          status: 401,
          headers: {
            "Content-Type": "text/plain",
          },
        });
      }

      const { idPrinter } = params as {
        idCustomer: string;
        idPrinter: string;
      };

      const url = new URL(request.url);

      const pageIndex = parseInt(url.searchParams.get("page") || "0", 10);
      const pageSize = parseInt(url.searchParams.get("limit") || "10", 10);
      const search = url.searchParams.get("search") || "";
      const sortKey = url.searchParams.get("sortKey") || undefined;
      const sortValue = url.searchParams.get("sortValue") || undefined;

      // Total fictício de profiles
      let totalProfiles = 50;

      // Gera profiles aleatórios
      let profiles = Array.from({ length: totalProfiles }, (_, i) => ({
        id: i + 1,
        name: `Profile ${i + 1}`,
        printerId: getRandomPrinterId(),
        printer: {
          id: idPrinter,
          name: `Printer ${idPrinter}`,
          type: {
            id: idPrinter,
            name: "Printer Model",
          },
        },
      }));

      // Aplica busca
      if (search) {
        profiles = profiles.filter((profile) =>
          profile.name.toLowerCase().includes(search.toLowerCase()),
        );
        totalProfiles = profiles.length;
      }

      // Aplica ordenação
      if (sortKey && sortValue && sortKey in profiles[0]) {
        profiles = profiles.sort((a, b) => {
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
      const paginatedProfiles = profiles.slice(start, end);

      return HttpResponse.json({
        data: paginatedProfiles,
        totalCount: totalProfiles,
      });
    },
  ),

  // Mock para POST /customer/:idCustomer/printer/:idPrinter/profile
  http.post(
    `${import.meta.env.VITE_API_URL}/customer/:idCustomer/printer/:idPrinter/profile`,
    async () => {
      return HttpResponse.json({
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  ),

  // Mock para PUT /customer/:idCustomer/printer/:idPrinter/profile/:idProfile
  http.put(
    `${import.meta.env.VITE_API_URL}/customer/:idCustomer/printer/:idPrinter/profile/:idProfile`,
    async () => {
      return new HttpResponse(null, {
        status: 204,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  ),

  // Mock para DELETE /customer/:idCustomer/printer/:idPrinter/profile/:idProfile
  http.delete(
    `${import.meta.env.VITE_API_URL}/customer/:idCustomer/printer/:idPrinter/profile/:idProfile`,
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
