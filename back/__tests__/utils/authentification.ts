import request from "supertest";
import { app } from "../../src/app"; // Adjust path as necessary

// Sign-up utility function
export const signUp = async (userData: object) => {
  const response = await request(app).post("/users").send(userData);
  const sessionCookie = response.headers["set-cookie"];
  return { sessionCookie, userId: response.body.user?._id, response };
};

// Login utility function
export const login = async (userData: object) => {
  const response = await request(app).post("/auth/login").send(userData);
  const sessionCookie = response.headers["set-cookie"];
  return { sessionCookie, userId: response.body.user?._id, response };
};

// Logout utility function
export const logout = async (sessionCookie: string[]) => {
  const response = await request(app)
    .post("/auth/logout")
    .set("Cookie", sessionCookie);
  return response;
};

// Delete user utility function
export const deleteUser = async (userId: string) => {
  const response = await request(app)
    .delete(`/users/${userId}`)
  return response;
};

// Force logout utility function
export const forceLogout = async (userId: string) => {
  const response = await request(app)
    .delete(`/auth/logout/${userId}`)
  return response;
};