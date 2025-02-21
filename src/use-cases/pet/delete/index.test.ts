import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeletePetUseCase } from "./index";
import { LoggerType } from "@/utils/logger";
import { PetInMemoryRepository } from "@/repositories/in-memory/pet.in-memory";
import { ErrorPetNotFound } from "../errors";

let repository: PetInMemoryRepository;
let deletePetUseCase: DeletePetUseCase;

const logger = vi.fn(() => ({
  info: vi.fn(),
})) as unknown as LoggerType;

describe("DeletePetUseCase", () => {
  beforeEach(() => {
    repository = new PetInMemoryRepository();
    deletePetUseCase = new DeletePetUseCase(repository, logger);
  });

  it("should delete a pet successfully", async () => {
    const petId = "123";
    await repository.create({
      id: petId,
      name: "Buddy",
      age: "2",
      breed: "Labrador",
      gender: "Male",
      description: "Friendly and playful",
      traits: ["Friendly", "Playful"],
      organization: {
        id: "123",
        name: "Test Org",
        email: "test@org.com",
        cnpj: "12345678901234",
        whatsapp: "12345678901",
        cep: "12345678",
        state: "Test State",
        city: "Test City",
        country: "Test Country",
        street: "Test Street",
      },
    });

    await deletePetUseCase.execute({ id: petId });

    expect(await repository.getById(petId)).toBeNull();
  });

  it("should throw an error when trying to delete a non-existent pet", async () => {
    const petId = "non-existent-id";

    await expect(
      deletePetUseCase.execute({ id: petId }),
    ).rejects.toBeInstanceOf(ErrorPetNotFound);
  });
});
