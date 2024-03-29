import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {scannedblocks, ScannedBlocksSchemaRelations} from '../models';
import {DbDataSource} from "../datasources";

export class ScannedBlocksSchemaRepository extends DefaultCrudRepository<
  scannedblocks,
  typeof scannedblocks.prototype._id,
  ScannedBlocksSchemaRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(scannedblocks, dataSource);
  }
}