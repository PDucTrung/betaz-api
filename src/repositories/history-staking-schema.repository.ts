import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from "../datasources";
import {historyStakingEvents, historyStakingEventSchemaRelations} from '../models';

export class historyStakingEventSchemaRepository extends DefaultCrudRepository<
  historyStakingEvents,
  typeof historyStakingEvents.prototype._id,
  historyStakingEventSchemaRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(historyStakingEvents, dataSource);
  }
}
