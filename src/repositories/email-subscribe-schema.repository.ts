import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from "../datasources";
import {emailSubscribeEvents, emailSubscribeEventSchemaRelations} from '../models';

export class emailSubscribeEventSchemaRepository extends DefaultCrudRepository<
  emailSubscribeEvents,
  typeof emailSubscribeEvents.prototype._id,
  emailSubscribeEventSchemaRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(emailSubscribeEvents, dataSource);
  }
}
