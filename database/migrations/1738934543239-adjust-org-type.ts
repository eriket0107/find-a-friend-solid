import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustOrgType1738934543239 implements MigrationInterface {
    name = 'AdjustOrgType1738934543239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "cnpj"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "cnpj" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "whatsapp"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "whatsapp" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "cep"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "cep" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "cep"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "cep" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "whatsapp"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "whatsapp" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "cnpj"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "cnpj" bigint NOT NULL`);
    }

}
