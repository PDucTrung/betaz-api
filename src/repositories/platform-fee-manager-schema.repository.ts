import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { platformFeeManagerEvents, platformFeeManagerEventSchemaRelations } from '../models';
import { DbDataSource } from "../datasources";

export class platformFeeManagerEventSchemaRepository extends DefaultCrudRepository<
platformFeeManagerEvents,
    typeof platformFeeManagerEvents.prototype._id,
    platformFeeManagerEventSchemaRelations
> {
    constructor(
        @inject('datasources.db') dataSource: DbDataSource,
    ) {
        super(platformFeeManagerEvents, dataSource);
    }
}
