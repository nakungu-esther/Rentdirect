import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersAuthPaymentChain1740000000000 implements MigrationInterface {
  name = 'UsersAuthPaymentChain1740000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE users
      SET email = CONCAT('user_', id::text, '@migrated.invalid')
      WHERE email IS NULL OR trim(email) = '';
    `);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN email SET NOT NULL;
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_users_email_lower"
      ON users (lower(email::text));
    `);

    await queryRunner.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash character varying;
    `);
    await queryRunner.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role character varying(32) DEFAULT 'tenant';
    `);
    await queryRunner.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false NOT NULL;
    `);
    await queryRunner.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false NOT NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE payments ADD COLUMN IF NOT EXISTS sui_tx_digest character varying;
    `);
    await queryRunner.query(`
      ALTER TABLE payments ADD COLUMN IF NOT EXISTS walrus_receipt_cid character varying;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE payments DROP COLUMN IF EXISTS walrus_receipt_cid;
    `);
    await queryRunner.query(`
      ALTER TABLE payments DROP COLUMN IF EXISTS sui_tx_digest;
    `);
    await queryRunner.query(`
      ALTER TABLE users DROP COLUMN IF EXISTS is_verified;
    `);
    await queryRunner.query(`
      ALTER TABLE users DROP COLUMN IF EXISTS phone_verified;
    `);
    await queryRunner.query(`
      ALTER TABLE users DROP COLUMN IF EXISTS role;
    `);
    await queryRunner.query(`
      ALTER TABLE users DROP COLUMN IF EXISTS password_hash;
    `);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_users_email_lower";`);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN email DROP NOT NULL;
    `);
  }
}
