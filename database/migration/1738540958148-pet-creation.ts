import { MigrationInterface, QueryRunner } from "typeorm";

export class PetCreation1738540958148 implements MigrationInterface {
    name = 'PetCreation1738540958148';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "age"`);
        await queryRunner.query(`ALTER TABLE "pet" ADD "age" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "age"`);
        await queryRunner.query(`ALTER TABLE "pet" ADD "age" character varying(255) NOT NULL`);
    }

}
