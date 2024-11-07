import "./setup";
const request = require("supertest");
import { app } from "../src/app";
import { pagesRoutes } from "./vars/pages";
import { userEditor2 } from "./vars/users";
import { login, logout, signUp, deleteUser } from "./utils/authentification";

describe("Settings", () => {
  let sessionCookie: string;
  let userId: string;

  describe("Create user", () => {
    it("Sign-up", async () => {
      const { sessionCookie: sessionCookieSignUp, userId: userIdSignUp } =
        await signUp(userEditor2);
      sessionCookie = sessionCookieSignUp;
      userId = userIdSignUp;
    });
  });

  describe("Add Domain", () => {
    it("Add domain", async () => {
      const response = await request(app)
        .post("/settings")
        .set("Cookie", sessionCookie)
        .send({ allowedDomains: ["domain.com"] });
      expect(response.status).toBe(200);
    });
  });

  describe("Add Domains", () => {
    it("Add domains", async () => {
      const response = await request(app)
        .post("/settings")
        .set("Cookie", sessionCookie)
        .send({ allowedDomains: ["domain.com", "test.com"] });
      expect(response.status).toBe(200);
    });
  });

  describe("Delete settings", () => {
    it("Delete settings", async () => {
      const response = await request(app).delete(`/settings/${userId}`);
      expect(response.status).toBe(200);
    });
  });

  describe("Clean user", () => {
    it("Logout", async () => {
      const response = await logout([sessionCookie]);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Utilisateur déconnecté");
    });

    it("Delete user", async () => {
      const response = await deleteUser(userId);
      expect(response.status).toBe(200);
    });
  });
});
