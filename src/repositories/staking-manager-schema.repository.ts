import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { stakingManagerEvents, stakingManagerEventSchemaRelations } from '../models';
import { DbDataSource } from "../datasources";

export class stakingManagerEventSchemaRepository extends DefaultCrudRepository<
stakingManagerEvents,
    typeof stakingManagerEvents.prototype._id,
    stakingManagerEventSchemaRelations
> {
    constructor(
        @inject('datasources.db') dataSource: DbDataSource,
    ) {
        super(stakingManagerEvents, dataSource);
    }
}
