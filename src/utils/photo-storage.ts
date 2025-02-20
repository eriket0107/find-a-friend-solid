import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { MultipartFile } from "@fastify/multipart";
import sharp from "sharp";
import { LoggerType } from "./logger";
import dayjs from "dayjs";

const pump = promisify(pipeline);
type PhotoFile = MultipartFile;

export class PhotoStorage {
  constructor(private logger: LoggerType) { }

  async uploadFile({
    photoFile,
    id,
    isProfilePhoto,
  }: {
    photoFile: PhotoFile;
    id: string;
    isProfilePhoto: boolean;
  }) {
    this.logger("PhotoStorage").info({
      message: `Starting file upload process`,
      id,
      folder: "PhotoStorage",
      filename: photoFile.filename,
    });

    if (!photoFile || !photoFile.filename || !photoFile.file) {
      const errorMsg = `Invalid file: Missing filename or file stream.`;
      console.error(errorMsg, photoFile);
      this.logger("PhotoStorage").error({
        message: errorMsg,
        id,
        folder: "PhotoStorage",
        fileName: photoFile?.filename,
      });
      throw new Error(errorMsg);
    }

    const fileName = isProfilePhoto
      ? `profile-${dayjs().format("YYYY-MM-DD-HH-mm-ss-SSS")}-${id}`.split(
        ".",
      )[0]
      : `${dayjs().format("YYYY-MM-DD-HH-mm-ss-SSS")}-${id}`.split(".")[0];

    const folderPath = path.join("src/uploads", id);
    await fs.promises.mkdir(folderPath, { recursive: true });

    this.logger("PhotoStorage").info({
      message: `Folder created or verified`,
      id,
      folderPath,
      folder: "PhotoStorage",
    });

    const originalFilePath = path.join(folderPath, photoFile.filename);

    try {
      const writeStream = fs.createWriteStream(originalFilePath);
      await pump(photoFile.file, writeStream);
      console.log(`PhotoFile saved to: ${originalFilePath}`);
      this.logger("PhotoStorage").info({
        message: `PhotoFile saved successfully`,
        id,
        newPath: originalFilePath,
        folder: "PhotoStorage",
      });
    } catch (error) {
      const errorMsg = `Error saving file: ${(error as Error).message}`;
      console.error(errorMsg);
      this.logger("PhotoStorage").error({
        message: errorMsg,
        id,
        newPath: originalFilePath,
        folder: "PhotoStorage",
        error: (error as Error).message,
      });
      throw new Error(errorMsg);
    }

    const uniqueName = fileName;
    const photoPath = path.join(folderPath, `${uniqueName}.webp`);
    const transformer = sharp()
      .resize({ width: 500, height: 500 })
      .toFormat("webp");

    try {
      this.logger("PhotoStorage").info({
        message: `Starting file transformation`,
        id,
        originalFilePath: originalFilePath,
        folder: "PhotoStorage",
      });

      await pump(
        fs.createReadStream(originalFilePath),
        transformer,
        fs.createWriteStream(photoPath),
      );

      this.logger("PhotoStorage").info({
        message: `PhotoFile transformed and saved successfully`,
        id,
        originalFilePath: originalFilePath,
        transformedFilePath: photoPath,
        folder: "PhotoStorage",
      });

      console.log(`PhotoFile saved successfully to ${photoPath}`);

      await fs.promises.unlink(originalFilePath);

      const { size } = await fs.promises.stat(photoPath);
      return {
        photoPath,
        type: "webp",
        fileSizeInMB: size / 1024 / 1024,
      };
    } catch (error) {
      const errorMsg = `Error processing file: ${(error as Error).message}`;
      console.error(errorMsg);
      this.logger("PhotoStorage").error({
        message: errorMsg,
        id,
        originalFilePath: originalFilePath,
        transformedFilePath: photoPath,
        folder: "PhotoStorage",
        error: (error as Error).message,
      });
      throw error;
    }
  }

  async readFile(filePath: string): Promise<Buffer> {
    try {
      const fileBuffer = await fs.promises.readFile(filePath);
      this.logger("PhotoStorage").info({
        message: `PhotoFile read successfully`,
        filePath,
        folder: "PhotoStorage",
        fileSize: fileBuffer.length,
      });

      return fileBuffer;
    } catch (error) {
      const errorMsg = `Error reading file at ${filePath}: ${(error as Error).message}`;
      console.error(errorMsg);
      this.logger("PhotoStorage").error({
        message: errorMsg,
        filePath,
        folder: "PhotoStorage",
        error: (error as Error).message,
      });
      throw error;
    }
  }
}
