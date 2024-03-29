import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { loseEvents, loseEventSchemaRelations } from '../models';
import { DbDataSource } from "../datasources";

export class loseEventSchemaRepository extends DefaultCrudRepository<
    loseEvents,
    typeof loseEvents.prototype._id,
    loseEventSchemaRelations
> {
    constructor(
        @inject('datasources.db') dataSource: DbDataSource,
    ) {
        super(loseEvents, dataSource);
    }
}
