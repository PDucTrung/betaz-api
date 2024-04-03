import {Entity, model, property} from '@loopback/repository';

@model()
export class corePoolManagerEvents extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id: string;

  @property({
    type: 'number',
  })
  blockNumber?: number;

  @property({
    type: 'string',
  })
  contract_address?: string;

  @property({
    type: 'string',
  })
  caller?: string;

  @property({
    type: 'string',
  })
  from?: string;

  @property({
    type: 'string',
  })
  to?: string;

  @property({
    type: 'number',
  })
  amount?: number;

  @property({
    type: 'number',
  })
  time?: number;

  @property({
    type: 'date',
  })
  createdTime?: Date;

  @property({
    type: 'date',
  })
  updatedTime?: Date;


  constructor(data?: Partial<corePoolManagerEvents>) {
    super(data);
  }
}

export interface corePoolManagerEventSchemaRelations {
  // describe navigational properties here
}

export type corePoolManagerEventSchemaWithRelations = corePoolManagerEvents & corePoolManagerEventSchemaRelations;
