import { MigrationInterface, QueryRunner } from "typeorm";

export class AdaptPet1739872240650 implements MigrationInterface {
  name = "AdaptPet1739872240650";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pet" ALTER COLUMN "profilePhoto" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" ALTER COLUMN "photos" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pet" ALTER COLUMN "photos" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" ALTER COLUMN "profilePhoto" SET NOT NULL`,
    );
  }
}
