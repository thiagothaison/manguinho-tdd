import bcrypt from "bcryptjs";

import { BcrypterAdapter } from "./bcrypt-adapter";

jest.mock("bcryptjs", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("any-hash"));
  },

  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
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
  test("Should call hash with correct values", async () => {
    const { salt, sut } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.hash("any_value");

    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  test("Should throw if bcrypt throws", async () => {
    const { sut } = makeSut();
    jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.hash("any_value");

    await expect(promise).rejects.toThrow();
  });

  test("Should call compare with correct values", async () => {
    const { sut } = makeSut();
    const compareSpy = jest.spyOn(bcrypt, "compare");

    await sut.compare("any_value", "any_hash");

    expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash");
  });
});
