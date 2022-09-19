import { MissingParamError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController {
  handle(request: HttpRequest): HttpResponse {
    const requiredFields = ["name", "email"];

    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    return {
      statusCode: 200,
      body: {},
    };
  }
}
