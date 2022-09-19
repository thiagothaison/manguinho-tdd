import bcrypt from "bcryptjs";

import { BcrypterAdapter } from "./bcrypt-adapter";

jest.mock("bcryptjs", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("any-hash"));
  },
}));

interface SutTypes {
  sut: BcrypterAdapter;
  salt: number;
}

const makeSut = (): SutTypes => {
  const salt = 12;
  const sut = new BcrypterAdapter(salt);

  return { salt, sut };
};

describe("Bcrypter", () => {
  test("Should call bcrypt with correct values", async () => {
    const { salt, sut } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");

    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  test("Should throw if bcrypt throws", async () => {
    const { sut } = makeSut();
    jest.spyOn(bcrypt, "hash").mockImplementation(() => {
      throw new Error();
    });

    const promise = sut.encrypt("any_value");

    await expect(promise).rejects.toThrow();
  });
});
