import { GetPetByIdUseCase } from ".";
import { PetInMemoryRepository } from "@/repositories/in-memory/pet.in-memory";
import { LoggerType } from "@/utils/logger";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorPetNotFound } from "../errors";

let sut: GetPetByIdUseCase;
let petRepository: PetInMemoryRepository;

const logger = vi.fn(() => ({
  info: vi.fn(),
})) as unknown as LoggerType;

describe("Get Pet By Id UseCase", () => {
  beforeEach(() => {
    petRepository = new PetInMemoryRepository();
    sut = new GetPetByIdUseCase(petRepository, logger);
  });

  it("should be able to get a pet by id", async () => {
    const pet = await petRepository.create({
      id: "pet-id",
      name: "John Doe",
      age: "1",
      breed: "Labrador",
      description: "This is a test pet",
      gender: "M",
      traits: ["Teste"],
      isAdopted: false,
      organization: {
        id: "1",
        name: "John Doe",
        street: "123 Main St",
        whatsapp: "1234567890",
        cnpj: "1234567890",
        email: "john.doe@example.com",
        cep: "1234567890",
        city: "São Paulo",
        state: "SP",
        country: "Brazil",
      },
    });

    const { pet: petById } = await sut.execute({ id: pet.id as string });
    expect(petById).toEqual(pet);
    expect(petById.id).toBe("pet-id");
    expect(petById.name).toBe("John Doe");
  });

  it("should not be able to get a pet by id if pet does not exist", async () => {
    await expect(sut.execute({ id: "non-existent-id" })).rejects.toThrow(
      new ErrorPetNotFound(),
    );
  });

  it("should throw an error if the id is invalid", async () => {
    await expect(sut.execute({ id: "" })).rejects.toThrow(
      new ErrorPetNotFound(),
    );
  });
});
