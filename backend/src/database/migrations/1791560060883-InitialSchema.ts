import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1791560060883 implements MigrationInterface {
  name = 'InitialSchema1791560060883';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permissions" ("id" uuid NOT NULL, "action" character varying NOT NULL, "resource" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "passwordRecoveryToken" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_permissions" ("rolesId" uuid NOT NULL, "permissionsId" uuid NOT NULL, CONSTRAINT "PK_7931614007a93423204b4b73240" PRIMARY KEY ("rolesId", "permissionsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0cb93c5877d37e954e2aa59e52" ON "role_permissions"  ("rolesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d422dabc78ff74a8dab6583da0" ON "role_permissions"  ("permissionsId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("usersId" uuid NOT NULL, "rolesId" uuid NOT NULL, CONSTRAINT "PK_38ffcfb865fc628fa337d9a0d4f" PRIMARY KEY ("usersId", "rolesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_99b019339f52c63ae615358738" ON "user_roles"  ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_13380e7efec83468d73fc37938" ON "user_roles"  ("rolesId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_permissions" ("usersId" uuid NOT NULL, "permissionsId" uuid NOT NULL, CONSTRAINT "PK_95afc35336c4cf91726a781e12b" PRIMARY KEY ("usersId", "permissionsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_440db3d6dd15ea8bfb0af41703" ON "user_permissions"  ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d68e45e4cd82c8fa4730e30cac" ON "user_permissions"  ("permissionsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_0cb93c5877d37e954e2aa59e52c" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_d422dabc78ff74a8dab6583da02" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_99b019339f52c63ae6153587380" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_13380e7efec83468d73fc37938e" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permissions" ADD CONSTRAINT "FK_440db3d6dd15ea8bfb0af417033" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permissions" ADD CONSTRAINT "FK_d68e45e4cd82c8fa4730e30cacd" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_permissions" DROP CONSTRAINT "FK_d68e45e4cd82c8fa4730e30cacd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permissions" DROP CONSTRAINT "FK_440db3d6dd15ea8bfb0af417033"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_13380e7efec83468d73fc37938e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_99b019339f52c63ae6153587380"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_d422dabc78ff74a8dab6583da02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_0cb93c5877d37e954e2aa59e52c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d68e45e4cd82c8fa4730e30cac"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_440db3d6dd15ea8bfb0af41703"`,
    );
    await queryRunner.query(`DROP TABLE "user_permissions"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_13380e7efec83468d73fc37938"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_99b019339f52c63ae615358738"`,
    );
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d422dabc78ff74a8dab6583da0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0cb93c5877d37e954e2aa59e52"`,
    );
    await queryRunner.query(`DROP TABLE "role_permissions"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
  }
}
