import { IPetRepository } from "@/repositories/pet.repository";
import { FileStorage } from "@/utils/filer-storage";
import { LoggerType } from "@/utils/logger";
import { MultipartFile } from "@fastify/multipart";
import { ErrorPetNotFound } from "../errors";

interface IUploadPetPhotoUseCaseRequest {
  petId: string;
  files: AsyncIterableIterator<MultipartFile>;
  isProfilePhoto: boolean;
}

export class UploadPetPhotoUseCase {
  constructor(
    private logger: LoggerType,
    private fileStorage: FileStorage,
    private petRepository: IPetRepository,
  ) {}

  async execute({
    petId,
    files,
    isProfilePhoto,
  }: IUploadPetPhotoUseCaseRequest): Promise<void> {
    this.logger("Pet").info({
      message: "Starting pet photo upload",
      petId,
      isProfilePhoto,
      folder: "Upload Pet Photo UseCase",
    });
    const pet = await this.petRepository.getById(petId);

    if (!pet) {
      this.logger("Pet").warn({
        message: "Pet not found",
        petId,
        folder: "Upload Pet Photo UseCase",
      });
      throw new ErrorPetNotFound();
    }
    const photos: string[] = [];

    for await (const file of files) {
      const { photoPath } = await this.fileStorage.uploadFile({
        file,
        id: petId,
        isProfilePhoto,
      });

      photos.push(photoPath);
    }

    this.logger("Pet").info({
      message: "File uploaded successfully",
      petId,
      photoPath: photos,
      isProfilePhoto,
      folder: "Upload Pet Photo UseCase",
    });

    const updatedPet = {
      profilePhoto: isProfilePhoto ? photos[0] : pet.profilePhoto,
      photos: isProfilePhoto ? pet.photos : [...(pet.photos ?? []), ...photos],
    };

    await this.petRepository.update({ id: petId, data: updatedPet });

    this.logger("Pet").info({
      message: "Pet updated successfully",
      petId,
      updatedFields: {
        profilePhoto: updatedPet.profilePhoto,
        photos: updatedPet.photos,
      },
      folder: "Upload Pet Photo UseCase",
    });
  }
}
