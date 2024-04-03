import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { pandoraPoolManagerEvents, pandoraPoolManagerEventSchemaRelations } from '../models';
import { DbDataSource } from "../datasources";

export class pandoraPoolManagerEventSchemaRepository extends DefaultCrudRepository<
pandoraPoolManagerEvents,
    typeof pandoraPoolManagerEvents.prototype._id,
    pandoraPoolManagerEventSchemaRelations
> {
    constructor(
        @inject('datasources.db') dataSource: DbDataSource,
    ) {
        super(pandoraPoolManagerEvents, dataSource);
    }
}
