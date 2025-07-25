import { http, HttpResponse } from "msw";

const VALID_CREDENTIALS = {
  email: "test@test.com",
  password: "Flexograv@24",
};

export const authMock = [
  http.post(
    `${import.meta.env.VITE_API_URL}/auth/login`,
    async ({ request }) => {
      const body: any = await request.json();
      if (
        body.email !== VALID_CREDENTIALS.email ||
        body.password !== VALID_CREDENTIALS.password
      ) {
        return new HttpResponse("Unauthorized", {
          status: 401,
          headers: {
            "Content-Type": "text/plain",
          },
        });
      }

      return HttpResponse.json({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMxLCJpYXQiOjE3Mjg0NzU4NDgsImV4cCI6MTcyOTA4MDY0OH0.BhIIDeymDoAnMGIcAoF7zuMELwBzmgIVgUlA-ce_k1U",
      });
    },
  ),
];
