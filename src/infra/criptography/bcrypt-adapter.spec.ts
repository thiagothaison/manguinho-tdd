import bcrypt from "bcryptjs";

import { BcrypterAdapter } from "./bcrypt-adapter";

jest.mock("bcryptjs", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("any-hash"));
  },
}));

describe("Bcrypter", () => {
  test("Should call bcrypt with correct values", async () => {
    const salt = 12;
    const sut = new BcrypterAdapter(salt);
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");

    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  test("Should return a hash on success", async () => {
    const salt = 12;
    const sut = new BcrypterAdapter(salt);
    const hash = await sut.encrypt("any_value");

    expect(hash).toBe("any-hash");
  });
});
