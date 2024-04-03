import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { corePoolManagerEvents, corePoolManagerEventSchemaRelations } from '../models';
import { DbDataSource } from "../datasources";

export class corePoolManagerEventSchemaRepository extends DefaultCrudRepository<
corePoolManagerEvents,
    typeof corePoolManagerEvents.prototype._id,
    corePoolManagerEventSchemaRelations
> {
    constructor(
        @inject('datasources.db') dataSource: DbDataSource,
    ) {
        super(corePoolManagerEvents, dataSource);
    }
}
