import { DefaultBodyType, http, HttpResponse, StrictRequest } from "msw";

// Função para verificar autorização
const isAuthorized = (request: StrictRequest<DefaultBodyType>) => {
  const authorization = request.headers.get("Authorization");
  return authorization !== "Bearer null";
};

// Mock dos dados de exemplo para DieCutBlocks
const dieCutBlocks = [
  { id: 1, distortion: `${3.5}`, cylinderId: 1 },
  { id: 1, distortion: `${2.5}`, cylinderId: 1 },
  { id: 1, distortion: `${4.5}`, cylinderId: 1 },
  { id: 1, distortion: `${4.0}`, cylinderId: 1 },
  { id: 2, distortion: `${4.0}`, cylinderId: 2 },
  { id: 2, distortion: `${4.2}`, cylinderId: 2 },
  { id: 2, distortion: `${3.8}`, cylinderId: 2 },
  { id: 2, distortion: `${3.0}`, cylinderId: 2 },
];

export const dieCutBlockMock = [
  // Mock para GET
  http.get(
    `${import.meta.env.VITE_API_URL}/customer/:id/printer/:printerId/cylinder/:cylinderId/diecutblock`,
    ({ request, params }) => {
      if (!isAuthorized(request)) {
        return new HttpResponse("Unauthorized", {
          status: 401,
          headers: { "Content-Type": "text/plain" },
        });
      }

      const { cylinderId } = params;

      if (!cylinderId) {
        return HttpResponse.json(
          { error: "Invalid or missing cylinderId" },
          { status: 400 },
        );
      }

      // Filtra os blocos pelo cylinderId
      const filteredBlocks = dieCutBlocks.filter(
        (block) => block.cylinderId === parseInt(cylinderId, 10),
      );

      return HttpResponse.json({
        data: filteredBlocks,
        totalCount: filteredBlocks.length,
      });
    },
  ),

  // Mock para POST
  http.post(
    `${import.meta.env.VITE_API_URL}/customer/:id/printer/:printerId/cylinder/:cylinderId/diecutblock`,
    async () => {
      return HttpResponse.json({
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  ),

  // Mock para PUT
  http.put(
    `${import.meta.env.VITE_API_URL}/customer/:id/printer/:printerId/cylinder/:cylinderId/diecutblock/:dieCutBlockId`,
    async () => {
      return new HttpResponse(null, {
        status: 204,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  ),

  // Mock para DELETE
  http.delete(
    `${import.meta.env.VITE_API_URL}/customer/:id/printer/:printerId/cylinder/:cylinderId/diecutblock/:dieCutBlockId`,
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
