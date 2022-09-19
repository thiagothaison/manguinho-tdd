import { SignUpController } from "./signup";

describe("SignUp Controller", () => {
  test("Should return 400 if no name is provided", () => {
    const sut = new SignUpController();
    const request = {
      body: {
        email: "any@email.com",
        password: "anypassword",
        passwordConfirmation: "anypassword",
      },
    };
    const response = sut.handle(request);

    expect(response.statusCode).toBe(400);
  });
});
