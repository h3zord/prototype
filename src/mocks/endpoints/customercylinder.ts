import { DefaultBodyType, http, HttpResponse, StrictRequest } from "msw";
import { Cylinder } from "./../../types/models/customercylinder";
// import { lapOptions } from "../../helpers/options/printer";

const isAuthorized = (request: StrictRequest<DefaultBodyType>) => {
  const authorization = request.headers.get("Authorization");
  return authorization !== "Bearer null";
};

const cylinders: Cylinder[] = [];

// Função para gerar cilindros fictícios
const generateCylinder = (id: number, idPrinter: number): Cylinder => ({
  id,
  shrinkage: Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000,
  clicheMaxWidth: Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000,
  stonedClicheMaxWidth: Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000,
  polyesterMaxWidth: Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000,
  development: Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000,
  distortion: parseFloat((Math.random() * 5).toFixed(2)),
  printer: {
    id: idPrinter,
    name: `Printer ${idPrinter}`,
    type: {
      id: idPrinter,
      name: "Printer Model",
    },
  },
});

// Mock para a rota de cilindros
export const cylinderMocks = [
  http.get(
    `${import.meta.env.VITE_API_URL}/customer/:idCustomer/printer/:idPrinter/cylinder`,
    ({ request, params }) => {
      if (!isAuthorized(request)) {
        return new HttpResponse("Unauthorized", {
          status: 401,
          headers: { "Content-Type": "text/plain" },
        });
      }

      const { idCustomer, idPrinter } = params as {
        idCustomer: string;
        idPrinter: string;
      };

      // Gera uma lista fictícia de cilindros para o cliente e impressora especificados
      const cylinders = Array.from({ length: 5 }, (_, i) =>
        generateCylinder(i + 1, parseInt(idPrinter, 10)),
      );

      return HttpResponse.json({
        data: cylinders,
        totalCount: cylinders.length,
        customerId: idCustomer,
        printerId: idPrinter,
      });
    },
  ),
  http.post(
    `${import.meta.env.VITE_API_URL}/customer/:idCustomer/printer/:idPrinter/cylinder`,
    ({ request, params }) => {
      if (!isAuthorized(request)) {
        return new HttpResponse("Unauthorized", {
          status: 401,
          headers: { "Content-Type": "text/plain" },
        });
      }

      const { idPrinter } = params as { idPrinter: string };
      const newCylinder = {
        ...request.body,
        id: cylinders.length + 1, // Gera um novo ID automaticamente
        printer: {
          id: parseInt(idPrinter, 10),
          name: `Printer ${idPrinter}`,
        },
      };

      cylinders.push(newCylinder as Cylinder);

      return HttpResponse.json(newCylinder, { status: 201 });
    },
  ),

  // PUT - Atualização de um cilindro existente
  http.put(
    `${import.meta.env.VITE_API_URL}/customer/:idCustomer/printer/:idPrinter/cylinder/:idCylinder`,
    async () => {
      return new HttpResponse(null, {
        status: 204,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  ),

  // DELETE - Remoção de um cilindro
  http.delete(
    `${import.meta.env.VITE_API_URL}/customer/:idCustomer/printer/:idPrinter/cylinder/:id`,
    ({ request, params }) => {
      if (!isAuthorized(request)) {
        return new HttpResponse("Unauthorized", {
          status: 401,
          headers: { "Content-Type": "text/plain" },
        });
      }

      const { id } = params as { id: string };

      const index = cylinders.findIndex((cyl) => cyl.id === parseInt(id, 10));
      if (index === -1) {
        return new HttpResponse("Not Found", { status: 404 });
      }

      cylinders.splice(index, 1);
      return HttpResponse.json({ message: "Cilindro deletado com sucesso!" });
    },
  ),
];
