import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserProfileFields1791580000000 implements MigrationInterface {
  name = 'AddUserProfileFields1791580000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "firstName" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "lastName" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "phone" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "avatarUrl" character varying(500)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "jobTitle" character varying(150)`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "bio" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "jobTitle"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatarUrl"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
  }
}
