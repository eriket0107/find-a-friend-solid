import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { SavedMultipartFile } from "@fastify/multipart";
import sharp from "sharp";
import { LoggerType } from "./logger";

const pump = promisify(pipeline);
type File = SavedMultipartFile;

export class FileStorage {
  constructor(private logger: LoggerType) { }

  async uploadFile({
    file,
    id,
    isProfilePhoto,
  }: {
    file: File;
    id: string;
    isProfilePhoto: boolean;
  }) {
    this.logger("FileStorage").info({
      message: `Starting file upload process`,
      id,
      folder: "FileStorage",
      filename: file.filename,
      filepath: file.filepath,
    });

    if (!file || !file.filename) {
      const errorMsg = `Invalid file: Missing filename or filepath.`;
      console.error(errorMsg, file);
      this.logger("FileStorage").error({
        message: errorMsg,
        id,
        folder: "FileStorage",
        fileName: file?.filename,
      });
      throw new Error(errorMsg);
    }

    const fileName = isProfilePhoto
      ? `profile-${id}-${file.filename}`.split(".")[0]
      : `${id}-${file.filename}`.split(".")[0];

    const folderPath = path.join("src/uploads", id);
    await fs.promises.mkdir(folderPath, { recursive: true });

    this.logger("FileStorage").info({
      message: `Folder created or verified`,
      id,
      folderPath,
      folder: "FileStorage",
    });

    const newFilePath = path.join(folderPath, file.filename);

    try {
      await fs.promises.rename(file.filepath, newFilePath);
      console.log(`File renamed to: ${newFilePath}`);
      this.logger("FileStorage").info({
        message: `File renamed successfully`,
        id,
        oldPath: file.filepath,
        newPath: newFilePath,
        folder: "FileStorage",
      });
    } catch (error) {
      const errorMsg = `Error renaming file: ${(error as Error).message}`;
      console.error(errorMsg);
      this.logger("FileStorage").error({
        message: errorMsg,
        id,
        oldPath: file.filepath,
        newPath: newFilePath,
        folder: "FileStorage",
        error: (error as Error).message,
      });
      throw new Error(errorMsg);
    }

    if (!fs.existsSync(newFilePath)) {
      const errorMsg = `File not found at: ${newFilePath}`;
      console.error(errorMsg);
      this.logger("FileStorage").error({
        message: errorMsg,
        id,
        filePath: newFilePath,
        folder: "FileStorage",
      });
      throw new Error(errorMsg);
    }

    const uniqueName = fileName;
    const photoPath = path.join(folderPath, `${uniqueName}.webp`);
    const transformer = sharp()
      .resize({ width: 500, height: 500 })
      .toFormat("webp");

    try {
      this.logger("FileStorage").info({
        message: `Starting file transformation`,
        id,
        originalFilePath: newFilePath,
        folder: "FileStorage",
      });

      await pump(
        fs.createReadStream(newFilePath),
        transformer,
        fs.createWriteStream(photoPath),
      );

      this.logger("FileStorage").info({
        message: `File transformed and saved successfully`,
        id,
        originalFilePath: newFilePath,
        transformedFilePath: photoPath,
        folder: "FileStorage",
      });

      console.log(`File saved successfully to ${photoPath}`);

      await fs.promises.unlink(newFilePath);

      const { size } = await fs.promises.stat(photoPath);
      return {
        photoPath,
        type: "webp",
        fileSizeInMB: size / 1024 / 1024,
      };
    } catch (error) {
      const errorMsg = `Error processing file: ${(error as Error).message}`;
      console.error(errorMsg);
      this.logger("FileStorage").error({
        message: errorMsg,
        id,
        originalFilePath: newFilePath,
        transformedFilePath: photoPath,
        folder: "FileStorage",
        error: (error as Error).message,
      });
      throw error;
    }
  }

  async readFile(filePath: string): Promise<Buffer> {
    try {
      const fileBuffer = await fs.promises.readFile(filePath);
      this.logger("FileStorage").info({
        message: `File read successfully`,
        filePath,
        folder: "FileStorage",
        fileSize: fileBuffer.length,
      });

      return fileBuffer;
    } catch (error) {
      const errorMsg = `Error reading file at ${filePath}: ${(error as Error).message}`;
      console.error(errorMsg);
      this.logger("FileStorage").error({
        message: errorMsg,
        filePath,
        folder: "FileStorage",
        error: (error as Error).message,
      });
      throw error;
    }
  }
}
