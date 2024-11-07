import "./setup";
const request = require("supertest");
import { app } from "../src/app";
import { pagesRoutes } from "./vars/pages";
import { userEditor } from "./vars/users";
import { login, logout, signUp, deleteUser } from "./utils/authentification";

// Guest
describe(`GET Pages`, () => {
  pagesRoutes.guest.map((page) => {
    it(`${page}`, async () => {
      const res = await request(app).get(page);
      expect(res.statusCode).toEqual(200);
    });
  });
});
describe(`GET Pages`, () => {
  pagesRoutes.editor.map((page) => {
    it(`${page}`, async () => {
      const res = await request(app).get(page);
      expect(res.statusCode).toEqual(404);
    });
  });
});
describe(`GET Pages`, () => {
  pagesRoutes.login.map((page) => {
    it(`${page}`, async () => {
      const res = await request(app).get(page);
      expect(res.statusCode).toEqual(200);
    });
  });
});

// Editor
describe("GET Pages with login", () => {
  let sessionCookieGetPages: string;

  it("Sign-up", async () => {
    const { sessionCookie } = await signUp(userEditor);
  });

  it("Login", async () => {
    const { sessionCookie } = await login(userEditor);
    sessionCookieGetPages = sessionCookie;
  });

  pagesRoutes.editor.forEach((page) => {
    it(`should return 200 for ${page} with session`, async () => {
      const res = await request(app)
        .get(page)
        .set("Cookie", sessionCookieGetPages);
      expect(res.statusCode).toEqual(200);
    });
  });

  it("Logout", async () => {
    const response = await logout([sessionCookieGetPages]);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Utilisateur déconnecté");
    expect(response.headers["set-cookie"][0]).toContain("connect.sid=;");
  });

  it("Delete user", async () => {
    const { sessionCookie, userId } = await login(userEditor); // Re-login to get a session for deletion
    const responsLogout = await logout([sessionCookie]);
    expect(responsLogout.status).toBe(200);
    expect(responsLogout.body.message).toBe("Utilisateur déconnecté");
    expect(responsLogout.headers["set-cookie"][0]).toContain("connect.sid=;");

    const responseDelete = await deleteUser(userId);
    expect(responseDelete.status).toBe(200);
  });
});
