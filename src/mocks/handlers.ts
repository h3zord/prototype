import { delay, http } from "msw";
import { usersMock } from "./endpoints/user";
import { authMock } from "./endpoints/auth";
import { groupsMock } from "./endpoints/group";
import { customerMock } from "./endpoints/customer";
import { transportMock } from "./endpoints/transport";
import { permissionsMock } from "./endpoints/permissions";
import { printerMock } from "./endpoints/customerprinter";
import { cylinderMocks } from "./endpoints/customercylinder";
import { dieCutBlockMock } from "./endpoints/customerdiecutblock";
import { profileMock } from "./endpoints/customerprofile";
import { externalCustomerMock } from "./endpoints/externalcustomers";
import { serviceOrderMock } from "./endpoints/serviceorder";

export const handlers = [
  http.all("*", async () => {
    await delay(1000);
  }),
  ...authMock,
  ...usersMock,
  ...groupsMock,
  ...customerMock,
  ...transportMock,
  ...permissionsMock,
  ...externalCustomerMock,
  ...printerMock,
  ...cylinderMocks,
  ...dieCutBlockMock,
  ...profileMock,
  ...serviceOrderMock,
];
