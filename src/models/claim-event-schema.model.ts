import {Entity, model, property} from '@loopback/repository';

@model()
export class claimEvents extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id: string;

  @property({
    type: 'string',
  })
  staker?: string;

  @property({
    type: 'number',
  })
  staked_amount?: number;

  @property({
    type: 'number',
  })
  reward_amount?: number;

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


  constructor(data?: Partial<claimEvents>) {
    super(data);
  }
}

export interface claimEventSchemaRelations {
  // describe navigational properties here
}

export type claimEventSchemaWithRelations = claimEvents & claimEventSchemaRelations;
