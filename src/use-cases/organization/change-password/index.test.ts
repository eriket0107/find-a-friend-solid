import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChangePasswordOrganizationUseCase } from ".";
import { PasswordHandler } from "@/utils/password-pandler";
import { OrganizationInMemoryRepository } from "@/repositories/in-memory/organization.in-memory";
import {
  ErrorOrganizationNotFound,
  ErrorOrganizationPasswordIncorrect,
} from "../errors";

let sut: ChangePasswordOrganizationUseCase;
let repository: OrganizationInMemoryRepository;
let passwordHandler: PasswordHandler;

const logger = vi.fn((level: string = "info") => ({
  level,
  debug: vi.fn(),
  error: vi.fn(),
  fatal: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  trace: vi.fn(),
  silent: vi.fn(),
}));

describe("ChangePasswordOrganizationUseCase", async () => {
  beforeEach(() => {
    passwordHandler = new PasswordHandler();
    repository = new OrganizationInMemoryRepository();
    sut = new ChangePasswordOrganizationUseCase(
      repository,
      logger,
      passwordHandler,
    );
  });

  it("should change password", async () => {
    await repository.create({
      id: "1",
      name: "Teste Org",
      email: "org@gmail.com",
      cnpj: "46367217000135",
      whatsapp: "21999999999",
      street: "Av Alfredo Balthazar da silveira",
      city: "Rio de Janeiro",
      state: "Rio de Janeiro",
      cep: "22790710",
      country: "BRA",
      password_hash: await passwordHandler.hashPassword("123"),
    });

    const { updatedPassword } = await sut.execute({
      id: "1",
      password: "123",
      newPassword: "1234",
    });

    expect(
      await passwordHandler.comparePassword(
        "1234",
        updatedPassword!.password_hash as string,
      ),
    ).toBe(true);
    expect(updatedPassword).toBeDefined();
  });

  it("should throw an error if organization does not exist", async () => {
    await expect(
      sut.execute({ id: "nonexistent", password: "123", newPassword: "1234" }),
    ).rejects.toThrow(ErrorOrganizationNotFound);
  });

  it("should throw an error if password is incorrect", async () => {
    await repository.create({
      id: "2",
      name: "Teste Org 2",
      email: "org2@gmail.com",
      cnpj: "12345678000199",
      whatsapp: "21988888888",
      street: "Rua Exemplo",
      city: "São Paulo",
      state: "São Paulo",
      cep: "01000000",
      country: "BRA",
      password_hash: await passwordHandler.hashPassword("correct-password"),
    });

    await expect(
      sut.execute({ id: "2", password: "wrong-password", newPassword: "1234" }),
    ).rejects.toThrow(ErrorOrganizationPasswordIncorrect);
  });

  it("should throw an error if password is missing", async () => {
    await repository.create({
      id: "3",
      name: "Teste Org 3",
      email: "org3@gmail.com",
      cnpj: "12345678000200",
      whatsapp: "21977777777",
      street: "Rua Sem Nome",
      city: "Belo Horizonte",
      state: "Minas Gerais",
      cep: "30140071",
      country: "BRA",
      password_hash: await passwordHandler.hashPassword("secret"),
    });

    await expect(
      sut.execute({ id: "3", password: "", newPassword: "newSecret" }),
    ).rejects.toThrow(ErrorOrganizationPasswordIncorrect);
  });

  it("should throw an error if new password is missing", async () => {
    await repository.create({
      id: "4",
      name: "Teste Org 4",
      email: "org4@gmail.com",
      cnpj: "98765432000100",
      whatsapp: "21966666666",
      street: "Rua Principal",
      city: "Curitiba",
      state: "Paraná",
      cep: "80010000",
      country: "BRA",
      password_hash: await passwordHandler.hashPassword("password"),
    });

    await expect(
      sut.execute({ id: "4", password: "password", newPassword: "" }),
    ).rejects.toThrow(ErrorOrganizationPasswordIncorrect);
  });
});
