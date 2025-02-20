import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsAdoptedToPet1740006902994 implements MigrationInterface {
    name = 'AddIsAdoptedToPet1740006902994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet" ADD "isAdopted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "isAdopted"`);
    }

}
