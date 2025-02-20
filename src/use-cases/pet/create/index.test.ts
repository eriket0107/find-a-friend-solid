import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreatePetUseCase } from ".";
import { GetByIdOrganizationUseCase } from "@/use-cases/organization/get-by-id";
import { ErrorOrganizationNotFound } from "@/use-cases/organization/errors";
import { LoggerType } from "@/utils/logger";
import { Pet } from "database/entities/Pet";
import { PetInMemoryRepository } from "@/repositories/in-memory/pet.in-memory";
import { OrganizationInMemoryRepository } from "@/repositories/in-memory/organization.in-memory";

let sut: CreatePetUseCase;
let petRepository: PetInMemoryRepository;
let getByIdOrganizationUseCase: GetByIdOrganizationUseCase;
let organizationRepository: OrganizationInMemoryRepository;

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

describe("Create Pet Use Case", () => {
  beforeEach(() => {
    petRepository = new PetInMemoryRepository();
    organizationRepository = new OrganizationInMemoryRepository();
    getByIdOrganizationUseCase = new GetByIdOrganizationUseCase(
      organizationRepository,
      logger,
    );
    sut = new CreatePetUseCase(
      petRepository,
      getByIdOrganizationUseCase,
      logger,
    );
  });

  it("should be able to create a pet", async () => {
    await organizationRepository.create({
      id: "valid-org-id",
      name: "Teste Org",
      email: "org@gmail.com",
      cnpj: "46367217000135",
      whatsapp: "21999999999",
      street: "Av Alfredo Balthazar da silveira",
      city: "Rio de Janeiro",
      state: "Rio de Janeiro",
      cep: "22790710",
      country: "BRA",
    });

    const petData: Pet = {
      id: "pet-id",
      name: "Buddy",
      age: "2",
      breed: "Labrador",
      gender: "M",
      profilePhoto: "https://example.com/buddy.jpg",
      photos: [
        "https://example.com/buddy1.jpg",
        "https://example.com/buddy2.jpg",
      ],
      description: "Cute and friendly",
      traits: ["Friendly", "Playful"],
      organization: "valid-org-id",
    };

    const { petCreated } = await sut.execute({
      pet: petData,
    });

    expect(petCreated).toHaveProperty("id", "pet-id");
    expect(petData).toEqual(petCreated);
  });

  it("should not be able to create a pet if the organization does not exist", async () => {
    const petData: Pet = {
      id: "pet-id",
      name: "Buddy",
      age: "2",
      breed: "Labrador",
      gender: "M",
      profilePhoto: "https://example.com/buddy.jpg",
      photos: [
        "https://example.com/buddy1.jpg",
        "https://example.com/buddy2.jpg",
      ],
      description: "Cute and friendly",
      traits: ["Friendly", "Playful"],
      organization: "invalid-org-id",
    };

    await expect(sut.execute({ pet: petData })).rejects.toBeInstanceOf(
      ErrorOrganizationNotFound,
    );
  });

  it("should not create a pet if required fields are missing", async () => {
    await organizationRepository.create({
      id: "valid-org-id",
      name: "Teste Org",
      email: "org@gmail.com",
      cnpj: "46367217000135",
      whatsapp: "21999999999",
      street: "Av Alfredo Balthazar da silveira",
      city: "Rio de Janeiro",
      state: "Rio de Janeiro",
      cep: "22790710",
      country: "BRA",
    });

    const incompletePetData = {
      id: "pet-id",
      name: "Buddy",
      age: "2",
      breed: "Labrador",
      organization: "valid-org-id",
    } as Pet;

    await expect(sut.execute({ pet: incompletePetData })).rejects.toThrow();
  });

  it("should validate pet age format", async () => {
    await organizationRepository.create({
      id: "valid-org-id",
      name: "Teste Org",
      email: "org@gmail.com",
      cnpj: "46367217000135",
      whatsapp: "21999999999",
      street: "Av Alfredo Balthazar da silveira",
      city: "Rio de Janeiro",
      state: "Rio de Janeiro",
      cep: "22790710",
      country: "BRA",
    });

    const invalidAgePetData: Pet = {
      id: "pet-id",
      name: "Buddy",
      age: "-1", // Invalid age
      breed: "Labrador",
      gender: "M",
      profilePhoto: "https://example.com/buddy.jpg",
      photos: ["https://example.com/buddy1.jpg"],
      description: "Cute and friendly",
      traits: ["Friendly"],
      organization: "valid-org-id",
    };

    await expect(sut.execute({ pet: invalidAgePetData })).rejects.toThrow();
  });

  it("should validate pet gender format", async () => {
    await organizationRepository.create({
      id: "valid-org-id",
      name: "Teste Org",
      email: "org@gmail.com",
      cnpj: "46367217000135",
      whatsapp: "21999999999",
      street: "Av Alfredo Balthazar da silveira",
      city: "Rio de Janeiro",
      state: "Rio de Janeiro",
      cep: "22790710",
      country: "BRA",
    });

    const invalidGenderPetData: Pet = {
      id: "pet-id",
      name: "Buddy",
      age: "2",
      breed: "Labrador",
      gender: "X",
      profilePhoto: "https://example.com/buddy.jpg",
      photos: ["https://example.com/buddy1.jpg"],
      description: "Cute and friendly",
      traits: ["Friendly"],
      organization: "valid-org-id",
    };

    await expect(sut.execute({ pet: invalidGenderPetData })).rejects.toThrow();
  });
});
