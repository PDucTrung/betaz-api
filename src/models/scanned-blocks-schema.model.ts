import {Entity, model, property} from '@loopback/repository';

@model()
export class scannedblocks extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id: string;

  @property({
    type: 'boolean',
  })
  lastScanned?: boolean;

  @property({
    type: 'number',
  })
  blockNumber?: number;

  @property({
    type: 'date',
  })
  createdTime?: Date;

  @property({
    type: 'date',
  })
  updatedTime?: Date;


  constructor(data?: Partial<scannedblocks>) {
    super(data);
  }
}

export interface ScannedBlocksSchemaRelations {
  // describe navigational properties here
}

export type ScannedBlocksSchemaWithRelations = scannedblocks & ScannedBlocksSchemaRelations;
