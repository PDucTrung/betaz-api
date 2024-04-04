import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { whitelistManagerEvents, whitelistManagerEventSchemaRelations } from '../models';
import { DbDataSource } from "../datasources";

export class whitelistManagerEventSchemaRepository extends DefaultCrudRepository<
whitelistManagerEvents,
    typeof whitelistManagerEvents.prototype._id,
    whitelistManagerEventSchemaRelations
> {
    constructor(
        @inject('datasources.db') dataSource: DbDataSource,
    ) {
        super(whitelistManagerEvents, dataSource);
    }
}
