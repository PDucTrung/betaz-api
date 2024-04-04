import {Entity, model, property} from '@loopback/repository';

@model()
export class emailSubscribeEvents extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'date',
  })
  createdTime?: Date;

  @property({
    type: 'date',
  })
  updatedTime?: Date;


  constructor(data?: Partial<emailSubscribeEvents>) {
    super(data);
  }
}

export interface emailSubscribeEventSchemaRelations {
  // describe navigational properties here
}

export type emailSubscribeEventSchemaWithRelations = emailSubscribeEvents & emailSubscribeEventSchemaRelations;
