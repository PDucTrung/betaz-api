import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { treasuryPoolManagerEvents, treasuryPoolManagerEventSchemaRelations } from '../models';
import { DbDataSource } from "../datasources";

export class treasuryPoolManagerEventSchemaRepository extends DefaultCrudRepository<
treasuryPoolManagerEvents,
    typeof treasuryPoolManagerEvents.prototype._id,
    treasuryPoolManagerEventSchemaRelations
> {
    constructor(
        @inject('datasources.db') dataSource: DbDataSource,
    ) {
        super(treasuryPoolManagerEvents, dataSource);
    }
}
