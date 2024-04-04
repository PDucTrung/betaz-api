import {Entity, model, property} from '@loopback/repository';

@model()
export class stakingManagerEvents extends Entity {
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
  callerIndex?: number;

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


  constructor(data?: Partial<stakingManagerEvents>) {
    super(data);
  }
}

export interface stakingManagerEventSchemaRelations {
  // describe navigational properties here
}

export type stakingManagerEventSchemaWithRelations = stakingManagerEvents & stakingManagerEventSchemaRelations;
