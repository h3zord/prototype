import { DefaultBodyType, http, HttpResponse, StrictRequest } from "msw";
import { PERMISSIONS_TYPE } from "../../types/models/permissions";

const isAuthorized = (request: StrictRequest<DefaultBodyType>) => {
  const authorization = request.headers.get("Authorization");
  return authorization && authorization.startsWith("Bearer ");
};

export const permissionsMock = [
  // Mock para o endpoint GET /user/me
  http.get(`${import.meta.env.VITE_API_URL}/user/me`, ({ request }) => {
    if (!isAuthorized(request)) {
      return new HttpResponse("Unauthorized", {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Simulação de diferentes usuários com base no token
    const authorization = request.headers.get("Authorization");
    if (authorization === "Bearer invalid-token") {
      return new HttpResponse(JSON.stringify({ message: "Invalid token" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userMaster = {
      id: 1,
      firstName: "Admin",
      lastName: "Master",
      email: "admin@admin.com",
      isApprover: true,
      groupId: 1,
      customerId: 1,
      createdAt: "2024-11-12T13:11:16.925Z",
      updatedAt: "2024-11-12T13:11:16.925Z",
      group: {
        id: 1,
        name: "Administrador",
        permissions: Object.values(PERMISSIONS_TYPE),
        hiddenProperties: {},
      },
    };

    return new HttpResponse(JSON.stringify(userMaster), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),

  // Mock para outro cenário de autorização falha
  http.get(`${import.meta.env.VITE_API_URL}/user/me`, ({ request }) => {
    if (request.headers.get("Authorization") === "Bearer expired-token") {
      return new HttpResponse(JSON.stringify({ message: "Token expired" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
];
