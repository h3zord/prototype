import { DefaultBodyType, http, HttpResponse, StrictRequest } from "msw";

const isAuthorized = (request: StrictRequest<DefaultBodyType>) => {
  const authorization = request.headers.get("Authorization");
  if (authorization === "Bearer null") {
    return new HttpResponse("Unauthorized", {
      status: 401,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
};

export const usersMock = [
  http.all(`${import.meta.env.VITE_API_URL}/user/*`, ({ request }) =>
    isAuthorized(request),
  ),

  http.get(`${import.meta.env.VITE_API_URL}/user`, ({ request }) => {
    const url = new URL(request.url);

    const pageIndex = url.searchParams.get("page") || "0";
    const pageSize = url.searchParams.get("limit") || "10";
    const search = url.searchParams.get("search") || "";
    const sortKey = url.searchParams.get("sortKey") || undefined;
    const sortValue = url.searchParams.get("sortValue") || undefined;

    let totalUsers = 200;
    let users = Array.from({ length: Number(pageSize) }, (_, i) => ({
      id: i + 1 + Number(pageIndex) * Number(pageSize),
      firstName: `User `,
      lastName: `${i + 1 + Number(pageIndex) * Number(pageSize)}`,
      email: `user${i + 1 + Number(pageIndex) * Number(pageSize)}@gmail.com`,
      group: { id: i, name: `Group ${i + 1}` },
      customer: { id: i, name: `Customer ${i + 1}` },
      isApprover: Math.random() > 0.5,
    }));

    if (search) {
      users = users.filter(
        (user) =>
          user.firstName.includes(search) || user.email.includes(search),
      );
      totalUsers = users.length;
    }

    // don't allow sorting for fields like company_name
    if (
      sortKey &&
      sortValue &&
      !sortKey.includes("_") &&
      sortKey != "createdAt" &&
      sortKey != "isApprover"
    ) {
      users = users.sort((userA: any, userB: any) => {
        const keyA = userA[sortKey].toUpperCase();
        const keyB = userB[sortKey].toUpperCase();
        if (keyA < keyB) {
          return sortValue === "asc" ? -1 : 1;
        }
        return sortValue === "desc" ? 1 : -1;
      });
    }

    return HttpResponse.json({
      data: users,
      totalCount: totalUsers,
    });
  }),

  // Mock para o método POST em /user
  http.post(`${import.meta.env.VITE_API_URL}/user`, async ({ request }) => {
    const body = (await request.json()) as {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      groupId: string;
      customerId: string;
      approver: boolean;
    };

    const {
      firstName,
      lastName,
      email,
      password,
      groupId,
      customerId,
      approver,
    } = body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !customerId ||
      !groupId
    ) {
      return new HttpResponse("Bad Request", {
        status: 400,
        statusText: "Missing required fields",
      });
    }

    return HttpResponse.json(
      {
        id: Math.floor(Math.random() * 1000),
        firstName,
        lastName,
        email,
        groupId,
        customerId,
        approver,
      },
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }),

  // Mock para o método PUT em /user/:id
  http.put(`${import.meta.env.VITE_API_URL}/user/:id`, async () => {
    return new HttpResponse(null, {
      status: 204,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  // Mock para o método Delete em /user/:id
  http.delete(`${import.meta.env.VITE_API_URL}/user/:id`, async () => {
    return new HttpResponse(null, {
      status: 204,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  http.get(`${import.meta.env.VITE_API_URL}/user/list`, () => {
    return HttpResponse.json([
      {
        id: 1,
        name: "User 1",
      },
      {
        id: 2,
        name: "User 2",
      },
    ]);
  }),
];
