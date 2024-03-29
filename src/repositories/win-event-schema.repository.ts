import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { winEvents, winEventSchemaRelations } from '../models';
import { DbDataSource } from "../datasources";

export class winEventSchemaRepository extends DefaultCrudRepository<
    winEvents,
    typeof winEvents.prototype._id,
    winEventSchemaRelations
> {
    constructor(
        @inject('datasources.db') dataSource: DbDataSource,
    ) {
        super(winEvents, dataSource);
    }
}
