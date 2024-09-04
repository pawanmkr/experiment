export class CreateOtpDto {
  readonly code: string;
  readonly userId: number;
}

export class UpdateOtpDto {
  readonly code?: string;
  readonly userId?: number;
}
