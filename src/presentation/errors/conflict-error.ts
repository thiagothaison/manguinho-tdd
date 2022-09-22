export class ConflictError extends Error {
  constructor(paramName: string) {
    super(`Conflict field: ${paramName}`);
    this.name = "ConflictError";
  }
}
