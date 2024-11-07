import "./setup";
const request = require("supertest");
import { app } from "../src/app";
import { pagesRoutes } from "./vars/pages";
import { userEditor2 } from "./vars/users";
import { login, logout, signUp, deleteUser } from "./utils/authentification";
import e from "express";

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
  describe("Add domain", () => {
    it("One domain", async () => {
      const response = await request(app)
        .post("/settings")
        .set("Cookie", sessionCookie)
        .send({ allowedDomains: ["domain.com"] });
      expect(response.status).toBe(200);
    });

    it("Multiple domains", async () => {
      const response = await request(app)
        .post("/settings")
        .set("Cookie", sessionCookie)
        .send({ allowedDomains: ["domain.com", "test.com"] });
      expect(response.status).toBe(200);
    });
  });

  describe("Create token", () => {
    it("Create token", async () => {
      const response = await request(app)
        .post("/settings/tokengenerator")
        .set("Cookie", sessionCookie)
        .send({
          embedToken: {
            domain: "domain.com",
            fileId: "123",
            expiresAt: "2022-12-12",
          },
        });
      expect(response.status).toBe(200);
      expect(response.body.tokens.token).toBeDefined();
      expect(response.body.tokens.tokenBase64).toBeDefined();
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
