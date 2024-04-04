import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from "../datasources";
import {claimEvents, claimEventSchemaRelations} from '../models';

export class claimEventSchemaRepository extends DefaultCrudRepository<
  claimEvents,
  typeof claimEvents.prototype._id,
  claimEventSchemaRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(claimEvents, dataSource);
  }
}
