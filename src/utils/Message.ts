import {SchemaObject} from "@loopback/rest";

export type ResponseBody = {
    status: string,
    message: string,
    errorCode?: string,
    ret?: never,
    data?: object,
}

// scan block
export type ScannedBlocksType = {
    lastScanned?: boolean,
    blockNumber?: number
};

const ReqScannedBlocksSchema: SchemaObject = {
    type: 'object',
    required: [],
    properties: {
        lastScanned: {
            type: 'boolean',
        },
        blockNumber: {
            type: 'number',
        },
    },
};
export const ReqScannedBlocksBody = {
    description: 'Scanned block input',
    required: true,
    content: {
        'application/x-www-form-urlencoded': {schema: ReqScannedBlocksSchema},
        'application/json': {schema: ReqScannedBlocksSchema},
    },
};

// email
export type EmailSubscribeType = {
    email?: string,
    limit?: number,
    offset?: number,
    sort?: number,
    subject?: string,
    text?: string,
};

const ReqEmailSubscribeSchema: SchemaObject = {
    type: 'object',
    required: [],
    properties: {
        email: {
            type: 'string',
        },
    },
};
export const ReqEmailSubscribeBody = {
    description: 'Scanned block input',
    required: true,
    content: {
        'application/x-www-form-urlencoded': {schema: ReqEmailSubscribeSchema},
        'application/json': {schema: ReqEmailSubscribeSchema},
    },
};

// bet event
export type betEventType = {
    player?: string,
    limit?: number,
    offset?: number,
    sort?: number,
};

const ReqBetEventSchema: SchemaObject = {
    type: 'object',
    required: [],
    properties: {
        blockNumber: {
            type: 'number',
        },
        player: {
            type: 'string',
        },
        isOver: {
            type: 'boolean',
        },
        randomNumber: {
            type: 'number',
        },
        betNumber: {
            type: 'number',
        },
        betAmount: {
            type: 'number',
        },
        winAmount: {
            type: 'number',
        },
        rewardAmount: {
            type: 'number',
        },
        oracleRound: {
            type: 'number',
        },
    },
};
export const ReqBetEventBody = {
    description: 'Scanned block input',
    required: true,
    content: {
        'application/x-www-form-urlencoded': {schema: ReqBetEventSchema},
        'application/json': {schema: ReqBetEventSchema},
    },
};
