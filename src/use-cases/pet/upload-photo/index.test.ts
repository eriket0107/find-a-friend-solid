import { beforeEach, describe, expect, it, vi } from "vitest";
import { UploadPetPhotoUseCase } from ".";
import { PetInMemoryRepository } from "@/repositories/in-memory/pet.in-memory";
import { FileStorage } from "@/utils/filer-storage";
import { LoggerType } from "@/utils/logger";
import { ErrorPetNotFound } from "../errors";
import { MultipartFile } from "@fastify/multipart";

let repository: PetInMemoryRepository;
let sut: UploadPetPhotoUseCase;

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

const fileStorage = {
  uploadFile: vi
    .fn()
    .mockResolvedValue({ photoPath: "photo-url", type: "webp" }),
  logger,
} as unknown as FileStorage;

const spyUpload = vi.spyOn(fileStorage, "uploadFile");

const mockFile = {
  filename: "photo.jpg",
  mimetype: "image/jpeg",
  file: Buffer.from("mock file content"),
} as unknown as MultipartFile;

describe("Upload Pet Photo Use Case", () => {
  beforeEach(() => {
    repository = new PetInMemoryRepository();
    sut = new UploadPetPhotoUseCase(logger, fileStorage, repository);
  });

  it("should upload pet photos successfully", async () => {
    await repository.create({
      id: "pet-id",
      name: "Buddy",
      age: "2",
      breed: "Labrador",
      gender: "M",
      description: "Cute and friendly",
      traits: ["Friendly", "Playful"],
      organization: "valid-org-id",
    });

    const { uploadedPetPhoto } = await sut.execute({
      petId: "pet-id",
      files: [mockFile],
      isProfilePhoto: true,
    });

    expect(spyUpload).toHaveBeenCalledTimes(1);
    expect(uploadedPetPhoto).toBeDefined();
    expect(uploadedPetPhoto?.profilePhoto).toBe("photo-url");
  });

  it("should throw an error if the pet does not exist", async () => {
    const nonExistentPetId = "non-existent-id";

    await expect(
      sut.execute({
        petId: nonExistentPetId,
        files: [],
        isProfilePhoto: true,
      }),
    ).rejects.toThrowError(ErrorPetNotFound);
  });

  it("should handle file upload failure gracefully", async () => {
    spyUpload.mockRejectedValueOnce(new ErrorPetNotFound());

    await expect(
      sut.execute({
        petId: "pet-id",
        files: [mockFile],
        isProfilePhoto: true,
      }),
    ).rejects.toBeInstanceOf(ErrorPetNotFound);
  });
});
