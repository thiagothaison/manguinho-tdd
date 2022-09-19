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

  test("Should return a hash on success", async () => {
    const { sut } = makeSut();
    const hash = await sut.encrypt("any_value");

    expect(hash).toBe("any-hash");
  });
});
