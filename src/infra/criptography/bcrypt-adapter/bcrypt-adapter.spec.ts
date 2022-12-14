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

  test("Should return a valid hash on hash success", async () => {
    const { sut } = makeSut();
    const hash = await sut.hash("any_value");

    expect(hash).toBe("any-hash");
  });

  test("Should throw if hash throws", async () => {
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

  test("Should return true when compare succeeds", async () => {
    const { sut } = makeSut();
    const isValid = await sut.compare("any_value", "any_hash");

    expect(isValid).toBeTruthy();
  });

  test("Should return false when compare succeeds", async () => {
    const { sut } = makeSut();
    jest
      .spyOn(bcrypt, "compare")
      .mockImplementationOnce(() => new Promise((resolve) => resolve(false)));

    const isValid = await sut.compare("any_value", "any_hash");

    expect(isValid).toBeFalsy();
  });

  test("Should throw if compare throws", async () => {
    const { sut } = makeSut();
    jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.compare("any_value", "any_hash");

    await expect(promise).rejects.toThrow();
  });
});
