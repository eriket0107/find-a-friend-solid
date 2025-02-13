import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustPetTraits1739354063147 implements MigrationInterface {
  name = "AdjustPetTraits1739354063147";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "cnpj"`);
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "cnpj" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "whatsapp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "whatsapp" character varying(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "cep"`);
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "cep" character varying(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "traits"`);
    await queryRunner.query(
      `ALTER TABLE "pet" ADD "traits" character varying array NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "traits"`);
    await queryRunner.query(
      `ALTER TABLE "pet" ADD "traits" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "cep"`);
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "cep" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "whatsapp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "whatsapp" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "cnpj"`);
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "cnpj" character varying NOT NULL`,
    );
  }
}
