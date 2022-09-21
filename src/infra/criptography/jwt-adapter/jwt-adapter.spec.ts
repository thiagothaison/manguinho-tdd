import jwt from "jsonwebtoken";

import { JwtAdapter } from "./jwt-adapter";

jest.mock("jsonwebtoken", () => ({
  async sign(): Promise<string> {
    return "hash";
  },
}));

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

  test("Should return a token on sign success", async () => {
    const { sut } = makeSut();
    const token = await sut.encrypt("any-id");

    expect(token).toBe("hash");
  });

  test("Should throw if sign throws", async () => {
    const { sut } = makeSut();
    jest.spyOn(jwt, "sign").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.encrypt("any-id");

    await expect(promise).rejects.toThrow();
  });
});
