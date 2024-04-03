import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { rewardPoolManagerEvents, rewardPoolManagerEventSchemaRelations } from '../models';
import { DbDataSource } from "../datasources";

export class rewardPoolManagerEventSchemaRepository extends DefaultCrudRepository<
rewardPoolManagerEvents,
    typeof rewardPoolManagerEvents.prototype._id,
    rewardPoolManagerEventSchemaRelations
> {
    constructor(
        @inject('datasources.db') dataSource: DbDataSource,
    ) {
        super(rewardPoolManagerEvents, dataSource);
    }
}
