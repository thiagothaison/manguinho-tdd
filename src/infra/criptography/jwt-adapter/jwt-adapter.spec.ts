import jwt from "jsonwebtoken";

import { JwtAdapter } from "./jwt-adapter";

interface SutTypes {
  sut: JwtAdapter;
  secret: string;
}

const makeSut = (): SutTypes => {
  const secret = "secret";
  const sut = new JwtAdapter(secret);

  return { sut, secret };
};

describe("Jwt Adapter", () => {
  test("Should call sign with correct values", async () => {
    const { sut, secret } = makeSut();
    const signSpy = jest.spyOn(jwt, "sign");
    await sut.encrypt("any-id");

    expect(signSpy).toHaveBeenCalledWith({ id: "any-id" }, secret);
  });
});
