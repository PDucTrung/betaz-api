import {Entity, model, property} from '@loopback/repository';

@model()
export class whitelistManagerEvents extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id: string;

  @property({
    type: 'string',
  })
  poolType?: string;

  @property({
    type: 'string',
  })
  buyer?: string;

  @property({
    type: 'number',
  })
  amount?: number;

  @property({
    type: 'number',
  })
  price?: number;

  @property({
    type: 'date',
  })
  createdTime?: Date;

  @property({
    type: 'date',
  })
  updatedTime?: Date;


  constructor(data?: Partial<whitelistManagerEvents>) {
    super(data);
  }
}

export interface whitelistManagerEventSchemaRelations {
  // describe navigational properties here
}

export type whitelistManagerEventSchemaWithRelations = whitelistManagerEvents & whitelistManagerEventSchemaRelations;
