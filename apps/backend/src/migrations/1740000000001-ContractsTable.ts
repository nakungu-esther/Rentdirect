import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class ContractsTable1740000000001 implements MigrationInterface {
  name = 'ContractsTable1740000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'contracts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'listing_id', type: 'uuid' },
          { name: 'tenant_id', type: 'uuid' },
          { name: 'landlord_id', type: 'uuid' },
          { name: 'title', type: 'varchar', length: '255' },
          { name: 'body', type: 'text', isNullable: true },
          {
            name: 'status',
            type: 'enum',
            enum: ['draft', 'signed'],
            enumName: 'contracts_status_enum',
            default: '\'draft\'::contracts_status_enum',
          },
          { name: 'walrus_document_cid', type: 'varchar', isNullable: true },
          { name: 'sui_object_id', type: 'varchar', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          { name: 'signed_at', type: 'timestamp', isNullable: true },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['listing_id'],
            referencedTableName: 'listings',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['tenant_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('contracts', true, true, true);
  }
}
