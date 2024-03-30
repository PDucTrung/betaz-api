import {SchemaObject} from "@loopback/rest";

export type ResponseBody = {
    status: string,
    message: string,
    errorCode?: string,
    ret?: never,
    data?: object,
}

export type ScannedBlocksType = {
    lastScanned: boolean,
    blockNumber: number
};

const ReqScannedBlocksSchema: SchemaObject = {
    type: 'object',
    required: ['lastScanned', 'number'],
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