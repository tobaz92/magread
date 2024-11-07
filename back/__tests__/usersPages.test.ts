import './setup';
const request = require("supertest");
import { app } from "../src/app";
import { pagesRoutes } from "./vars/pages";

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
