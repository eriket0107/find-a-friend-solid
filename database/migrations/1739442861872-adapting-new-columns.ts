import { MigrationInterface, QueryRunner } from "typeorm";

export class AdaptingNewColumns1739442861872 implements MigrationInterface {
  name = "AdaptingNewColumns1739442861872";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "image_url"`);
    await queryRunner.query(
      `ALTER TABLE "pet" ADD "gender" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" ADD "profilePhoto" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" ADD "photos" character varying(255) array NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "photos"`);
    await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "profilePhoto"`);
    await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "gender"`);
    await queryRunner.query(
      `ALTER TABLE "pet" ADD "image_url" character varying(255) NOT NULL`,
    );
  }
}
