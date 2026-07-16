export class AppError extends Error {
  constructor(public statusCode: number, message: string, public code = 'ERROR', public details?: unknown) {
    super(message);
    this.name = 'AppError';
  }
}
