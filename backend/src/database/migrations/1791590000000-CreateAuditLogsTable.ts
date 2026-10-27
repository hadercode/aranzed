import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuditLogsTable1791590000000 implements MigrationInterface {
  name = 'CreateAuditLogsTable1791590000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "audit_logs" (
                "id" uuid NOT NULL,
                "userId" uuid,
                "userEmail" character varying(150),
                "userName" character varying(150),
                "action" character varying(50) NOT NULL,
                "model" character varying(100) NOT NULL,
                "entityId" character varying(255),
                "description" character varying(500),
                "previousState" jsonb,
                "newState" jsonb,
                "changes" jsonb,
                "ipAddress" character varying(100) NOT NULL DEFAULT '127.0.0.1',
                "userAgent" text,
                "method" character varying(10) NOT NULL,
                "endpoint" character varying(500) NOT NULL,
                "statusCode" integer NOT NULL DEFAULT 200,
                "status" character varying(20) NOT NULL DEFAULT 'SUCCESS',
                "errorMessage" text,
                "durationMs" integer NOT NULL DEFAULT 0,
                "metadata" jsonb,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_audit_logs_id" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(
      `CREATE INDEX "IDX_audit_logs_createdAt" ON "audit_logs" ("createdAt" DESC)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_audit_logs_model" ON "audit_logs" ("model")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_audit_logs_action" ON "audit_logs" ("action")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_audit_logs_userId" ON "audit_logs" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_audit_logs_status" ON "audit_logs" ("status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_audit_logs_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_audit_logs_userId"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_audit_logs_action"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_audit_logs_model"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_audit_logs_createdAt"`);
    await queryRunner.query(`DROP TABLE "audit_logs"`);
  }
}
