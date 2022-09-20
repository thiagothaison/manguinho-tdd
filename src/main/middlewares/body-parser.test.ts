import request from "supertest";

import app from "../config/app";

describe("BodyParser Middleware", () => {
  test("Should parse body as json", async () => {
    app.post("/teste_body_parser", (req, res) => {
      res.send(req.body);
    });
    await request(app)
      .post("/teste_body_parser")
      .send({ foo: "bar" })
      .expect({ foo: "bar" });
  });
});
