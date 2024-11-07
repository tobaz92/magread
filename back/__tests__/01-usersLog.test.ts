import "./setup";
import { userError, userTest } from "./vars/users";
import {
  signUp,
  login,
  logout,
  deleteUser,
  forceLogout,
} from "./utils/authentification";

describe("Authentication", () => {
  describe("Normal", () => {
    it("Sign-up", async () => {
      const { sessionCookie } = await signUp(userTest);
      const response = await logout([sessionCookie]);
      expect(response.body.message).toBe("Utilisateur déconnecté");
    });

    it("Login", async () => {
      const { sessionCookie } = await login(userTest);
      const response = await logout([sessionCookie]);
      expect(response.body.message).toBe("Utilisateur déconnecté");
      expect(sessionCookie).toBeDefined();
    });

    it("Logout", async () => {
      const { sessionCookie } = await login(userTest); // Re-login to get a session
      const response = await logout([sessionCookie]);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Utilisateur déconnecté");
      expect(response.headers["set-cookie"][0]).toContain("connect.sid=;");
    });

    it("Delete user", async () => {
      const { sessionCookie, userId } = await login(userTest); // Re-login to get a session for deletion
      const responsLogout = await logout([sessionCookie]);
      expect(responsLogout.status).toBe(200);
      expect(responsLogout.body.message).toBe("Utilisateur déconnecté");
      expect(responsLogout.headers["set-cookie"][0]).toContain("connect.sid=;");

      const responseDelete = await deleteUser(userId);
      expect(responseDelete.status).toBe(200);
    });
  });

  describe("Error", () => {
    describe("Login", () => {
      it("Login — with error", async () => {
        const { response } = await login(userError);
        expect(response.status).toBe(404);
      });
    });

    describe("Multiple login", () => {
      let userIdForLogout: string;

      it("Sign-up", async () => {
        const { sessionCookie } = await signUp(userTest);
        const response = await logout([sessionCookie]);
        expect(response.body.message).toBe("Utilisateur déconnecté");
      });

      it("Login x4", async (nb = 4) => {
        for (let index = 0; index < nb + 1; index++) {
          const { userId } = await login(userTest);

          if (index === nb - 1) {
            userIdForLogout = userId;
          }
          if (index === nb) {
            const responseForceLogout = await forceLogout(userIdForLogout);
            expect(responseForceLogout.status).toBe(200);

            const responseDelete = await deleteUser(userIdForLogout);
            expect(responseDelete.status).toBe(200);
          }
        }
      });
    });

    describe("Multiple sign-up", () => {
      let userId: string;

      it("First", async () => {
        const { sessionCookie } = await signUp(userTest);
        const response = await logout([sessionCookie]);
        expect(response.body.message).toBe("Utilisateur déconnecté");
      });
      it("Second - user is uniq", async () => {
        const { response } = await signUp(userTest);
        expect(response.status).toBe(500);

        const { sessionCookie, userId } = await login(userTest); // Re-login to get a session for deletion
        const responsLogout = await logout([sessionCookie]);
        expect(responsLogout.status).toBe(200);
        expect(responsLogout.body.message).toBe("Utilisateur déconnecté");
        expect(responsLogout.headers["set-cookie"][0]).toContain(
          "connect.sid=;"
        );
        const responseDelete = await deleteUser(userId);
        expect(responseDelete.status).toBe(200);
      });
    });
  });
});
