import { Entity, model, property } from '@loopback/repository';

@model()
export class loseEvents extends Entity {
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
    player?: string;

    @property({
        type: 'boolean',
    })
    isOver?: boolean;

    @property({
        type: 'number',
    })
    randomNumber?: number;

    @property({
        type: 'number',
    })
    betNumber?: number;

    @property({
        type: 'number',
    })
    betAmount?: number;

    @property({
        type: 'number',
    })
    rewardAmount?: number;

    @property({
        type: 'number',
    })
    oracleRound?: number;

    @property({
        type: 'date',
    })
    createdTime?: Date;

    @property({
        type: 'date',
    })
    updatedTime?: Date;


    constructor(data?: Partial<loseEvents>) {
        super(data);
    }
}

export interface loseEventSchemaRelations {
    // describe navigational properties here
}

export type loseEventSchemaWithRelations = loseEvents & loseEventSchemaRelations;
