import { MigrationInterface, QueryRunner } from "typeorm";

export class AdaptPet1739873009669 implements MigrationInterface {
  name = "AdaptPet1739873009669";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pet" DROP CONSTRAINT "PK_b1ac2e88e89b9480e0c5b53fa60"`,
    );
    await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "pet" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" ADD CONSTRAINT "PK_b1ac2e88e89b9480e0c5b53fa60" PRIMARY KEY ("id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pet" DROP CONSTRAINT "PK_b1ac2e88e89b9480e0c5b53fa60"`,
    );
    await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "pet" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "pet" ADD CONSTRAINT "PK_b1ac2e88e89b9480e0c5b53fa60" PRIMARY KEY ("id")`,
    );
  }
}
