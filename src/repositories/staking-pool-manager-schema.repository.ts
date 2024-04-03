import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from "../datasources";
import {stakingPoolManagerEvents, stakingPoolManagerEventSchemaRelations} from '../models';

export class stakingPoolManagerEventSchemaRepository extends DefaultCrudRepository<
stakingPoolManagerEvents,
  typeof stakingPoolManagerEvents.prototype._id,
  stakingPoolManagerEventSchemaRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(stakingPoolManagerEvents, dataSource);
  }
}
