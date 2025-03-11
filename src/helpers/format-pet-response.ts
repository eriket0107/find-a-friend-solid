import { env } from "@/env";
import { Pet } from "database/entities/Pet";

export const formatPetResponse = (pet: Pet): Pet => {
  const profilePhotoPath = pet.profilePhoto
    ? `http://${env.HOST}:${env.PORT}/${pet.profilePhoto}`
    : "";

  const photosPath = pet.photos
    ? pet.photos.map((photo) => `http://${env.HOST}:${env.PORT}/${photo}`)
    : [];

  return {
    ...pet,
    profilePhoto: profilePhotoPath,
    photos: photosPath,
  };
};
