export class InvalidEmailError extends Error {
  readonly code = "INVALID_EMAIL";
  constructor(raw: string) {
    super(`Invalid email: ${raw}`);
  }
}

export class Email {
  private constructor(private readonly value: string) {}

  static create(raw: string): Email {
    const trimmed = raw.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      throw new InvalidEmailError(raw);
    }
    return new Email(trimmed);
  }

  toString(): string {
    return this.value;
  }
}
