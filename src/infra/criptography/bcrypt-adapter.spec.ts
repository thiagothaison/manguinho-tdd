import bcrypt from "bcryptjs";

import { BcrypterAdapter } from "./bcrypt-adapter";

describe("Bcrypter", () => {
  test("Should call bcrypt with correct values", async () => {
    const salt = 12;
    const sut = new BcrypterAdapter(salt);
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");

    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });
});
