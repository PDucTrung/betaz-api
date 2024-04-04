import {Entity, model, property} from '@loopback/repository';

@model()
export class historyStakingEvents extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id: string;

  @property({
    type: 'string',
  })
  caller?: string;

  @property({
    type: 'number',
  })
  amount?: number;

  @property({
    type: 'number',
  })
  currentTime?: number;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'date',
  })
  createdTime?: Date;

  @property({
    type: 'date',
  })
  updatedTime?: Date;


  constructor(data?: Partial<historyStakingEvents>) {
    super(data);
  }
}

export interface historyStakingEventSchemaRelations {
  // describe navigational properties here
}

export type historyStakingEventSchemaWithRelations = historyStakingEvents & historyStakingEventSchemaRelations;
