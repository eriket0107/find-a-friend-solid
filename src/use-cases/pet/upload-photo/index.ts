import { IPetRepository } from "@/repositories/pet.repository";
import { PhotoStorage } from "@/utils/photo-storage";
import { LoggerType } from "@/utils/logger";
import { MultipartFile } from "@fastify/multipart";
import { ErrorPetNotFound } from "../errors";
import { Pet } from "database/entities/Pet";

interface IUploadPetPhotoUseCaseRequest {
  petId: string;
  files: AsyncIterableIterator<MultipartFile>;
  isProfilePhoto: boolean;
}

interface UpdatePetUseCaseResponse {
  uploadedPetPhoto: Pet | null;
}

export class UploadPetPhotoUseCase {
  constructor(
    private logger: LoggerType,
    private photoStorage: PhotoStorage,
    private petRepository: IPetRepository,
  ) { }

  async execute({
    petId,
    files,
    isProfilePhoto,
  }: IUploadPetPhotoUseCaseRequest): Promise<UpdatePetUseCaseResponse> {
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
      const { photoPath } = await this.photoStorage.uploadFile({
        photoFile: file,
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

    let updatedPetData: Partial<Pet>;

    this.logger("Pet").info({
      message: "Getting pet photo to be uploaded",
      petId,
      isProfilePhoto,
      folder: "Upload Pet Photo UseCase",
    });

    if (isProfilePhoto) {
      updatedPetData = {
        profilePhoto: photos[0],
      };
    } else {
      updatedPetData = {
        photos: pet.photos ? [...pet.photos, ...photos] : photos,
      };
    }

    const uploadedPetPhoto = await this.petRepository.update({
      id: petId,
      data: updatedPetData,
    });

    this.logger("Pet").info({
      message: "Pet updated successfully",
      petId,
      updatedFields: {
        profilePhoto: updatedPetData.profilePhoto,
        photos: updatedPetData.photos,
      },
      folder: "Upload Pet Photo UseCase",
    });

    return {
      uploadedPetPhoto,
    };
  }
}
