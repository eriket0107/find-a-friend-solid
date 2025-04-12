import { LoggerType } from "@/utils/logger";
import { AuthenticateOrganizationUseCase } from "./index";
import { PasswordHandler } from "@/utils/password-pandler";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { OrganizationInMemoryRepository } from "@/repositories/in-memory/organization.in-memory";
import {
  ErrorOrganizationNotFound,
  ErrorOrganizationPasswordIncorrect,
} from "../errors";
import { Organization } from "database/entities/Organization";

const logger: LoggerType = vi.fn((level: string = "info") => ({
  level,
  debug: vi.fn(),
  error: vi.fn(),
  fatal: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  trace: vi.fn(),
  silent: vi.fn(),
}));

describe("Authenticate Organization Use Case", () => {
  let repository: OrganizationInMemoryRepository;
  let passwordHandler: PasswordHandler;
  let authenticateOrganizationUseCase: AuthenticateOrganizationUseCase;

  beforeEach(() => {
    repository = new OrganizationInMemoryRepository();
    passwordHandler = new PasswordHandler();
    authenticateOrganizationUseCase = new AuthenticateOrganizationUseCase(
      repository,
      logger,
      passwordHandler,
    );

    vi.clearAllMocks();
  });

  it("should authenticate an organization with valid credentials", async () => {
    const password = "testPassword123";
    const hashedPassword = await passwordHandler.hashPassword(password);

    const testOrganization: Partial<Organization> = {
      id: "1",
      name: "Test Organization",
      email: "test@example.com",
      password_hash: hashedPassword,
    };

    await repository.create(testOrganization as Organization);

    const result = await authenticateOrganizationUseCase.execute({
      email: "test@example.com",
      password: password,
    });

    expect(result.organization).toBeDefined();
    expect(result.organization.email).toBe("test@example.com");
    expect(result.organization.name).toBe("Test Organization");
    expect(result.organization.password_hash).toBeUndefined();
  });

  it("should throw ErrorOrganizationNotFound when organization doesn't exist", async () => {
    await expect(
      authenticateOrganizationUseCase.execute({
        email: "nonexistent@example.com",
        password: "anyPassword",
      }),
    ).rejects.toThrow(ErrorOrganizationNotFound);

    expect(logger).toHaveBeenCalledWith("Organization");
  });

  it("should throw ErrorOrganizationPasswordIncorrect when password is wrong", async () => {
    const password = "testPassword123";
    const hashedPassword = await passwordHandler.hashPassword(password);

    const testOrganization: Partial<Organization> = {
      id: "1",
      name: "Test Organization",
      email: "test@example.com",
      password_hash: hashedPassword,
    };

    await repository.create(testOrganization as Organization);

    await expect(
      authenticateOrganizationUseCase.execute({
        email: "test@example.com",
        password: "wrongPassword",
      }),
    ).rejects.toThrow(ErrorOrganizationPasswordIncorrect);

    expect(logger).toHaveBeenCalledWith("Organization");
  });

  it("should throw ErrorOrganizationPasswordIncorrect when organization has no password", async () => {
    const testOrganization: Partial<Organization> = {
      id: "1",
      name: "Test Organization",
      email: "test@example.com",
    };

    await repository.create(testOrganization as Organization);

    await expect(
      authenticateOrganizationUseCase.execute({
        email: "test@example.com",
        password: "anyPassword",
      }),
    ).rejects.toThrow(ErrorOrganizationPasswordIncorrect);

    expect(logger).toHaveBeenCalledWith("Organization");
  });
});
