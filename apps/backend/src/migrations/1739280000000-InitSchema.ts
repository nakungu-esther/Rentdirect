import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class InitSchema1739280000000 implements MigrationInterface {
  name = 'InitSchema1739280000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'fullName', type: 'varchar' },
          { name: 'phone', type: 'varchar', isUnique: true },
          { name: 'email', type: 'varchar', isNullable: true },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'listings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'title', type: 'varchar' },
          { name: 'description', type: 'text' },
          {
            name: 'propertyType',
            type: 'enum',
            enum: ['apartment', 'house', 'room', 'commercial', 'land'],
          },
          {
            name: 'priceUGX',
            type: 'decimal',
            precision: 12,
            scale: 2,
          },
          { name: 'location', type: 'varchar' },
          { name: 'address', type: 'varchar' },
          { name: 'latitude', type: 'varchar', isNullable: true },
          { name: 'longitude', type: 'varchar', isNullable: true },
          { name: 'bedrooms', type: 'int', default: 0 },
          { name: 'bathrooms', type: 'int', default: 0 },
          { name: 'isFurnished', type: 'boolean', default: false },
          { name: 'amenities', type: 'text', isNullable: true },
          { name: 'photos', type: 'text', isNullable: true },
          {
            name: 'status',
            type: 'enum',
            enum: ['draft', 'active', 'rented', 'suspended'],
            // PG requires a quoted literal cast; unquoted `draft` is treated as a column ref
            default: '\'draft\'::listings_status_enum',
          },
          { name: 'landlord_id', type: 'uuid' },
          { name: 'viewCount', type: 'int', default: 0 },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['landlord_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'payments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'tenant_id', type: 'uuid' },
          { name: 'listing_id', type: 'uuid' },
          {
            name: 'amountUGX',
            type: 'decimal',
            precision: 12,
            scale: 2,
          },
          {
            name: 'provider',
            type: 'enum',
            enum: ['mtn_momo', 'airtel', 'visa'],
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: '\'pending\'::payments_status_enum',
          },
          { name: 'provider_ref', type: 'varchar', isNullable: true },
          { name: 'phone_number', type: 'varchar', isNullable: true },
          { name: 'notes', type: 'text', isNullable: true },
          { name: 'paid_at', type: 'timestamp', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['tenant_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['listing_id'],
            referencedTableName: 'listings',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'user_id', type: 'uuid' },
          { name: 'title', type: 'varchar' },
          { name: 'body', type: 'text' },
          {
            name: 'type',
            type: 'enum',
            enum: ['payment', 'new_listing', 'message', 'system'],
            default: '\'system\'::notifications_type_enum',
          },
          { name: 'is_read', type: 'boolean', default: false },
          { name: 'link', type: 'varchar', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notifications', true, true, true);
    await queryRunner.dropTable('payments', true, true, true);
    await queryRunner.dropTable('listings', true, true, true);
    await queryRunner.dropTable('users', true, true, true);
  }
}
