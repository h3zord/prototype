import { DefaultBodyType, http, HttpResponse, StrictRequest } from "msw";

const isAuthorized = (request: StrictRequest<DefaultBodyType>) => {
  const authorization = request.headers.get("Authorization");
  return authorization !== "Bearer null";
};

export const groupsMock = [
  http.get(`${import.meta.env.VITE_API_URL}/group/list`, ({ request }) => {
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
        name: "Grupo 1",
      },
      {
        id: 2,
        name: "Grupo 2",
      },
      {
        id: 3,
        name: "Grupo 3",
      },
      {
        id: 4,
        name: "Grupo 4",
      },
    ]);
  }),
];
