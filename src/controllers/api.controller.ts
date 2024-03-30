import {
    ResponseBody,
    ScannedBlocksType,
    ReqScannedBlocksBody,

} from "../utils/Message";
import { MESSAGE, STATUS } from "../utils/constant";

import {
    post,
    get,
    RestBindings,
    Request,
    Response,
    oas, requestBody, param, response, getModelSchemaRef,
} from '@loopback/rest';

import {
    ScannedBlocksSchemaRepository,
} from "../repositories";

import {
    Count,
    CountSchema,
    Filter, FilterExcludingWhere, PredicateComparison,
    repository, Where
} from '@loopback/repository';
import { inject } from "@loopback/core";

export class ApiController {
    constructor(
        @inject(RestBindings.Http.REQUEST) private request: Request,
        @inject(RestBindings.Http.RESPONSE) private response: Response,
        @repository(ScannedBlocksSchemaRepository)
        public scannedBlocksSchemaRepository: ScannedBlocksSchemaRepository,
    ) {
    }

    @post('/newScanned')
    async newScanned(
        @requestBody(ReqScannedBlocksBody) req: ScannedBlocksType
    ): Promise<ResponseBody | Response> {
        if (!req) return {
            status: STATUS.FAILED,
            message: MESSAGE.NO_INPUT
        };
        const lastScanned = req?.lastScanned;
        const blockNumber = req?.blockNumber;
        if (!lastScanned || !blockNumber) {
            return {
                status: STATUS.FAILED,
                message: MESSAGE.INVALID_INPUT
            }
        }

        await this.scannedBlocksSchemaRepository.create({
            lastScanned: lastScanned,
            blockNumber: blockNumber,
            createdTime: new Date(),
            updatedTime: new Date()
        });

        return {
            status: STATUS.OK,
            message: MESSAGE.SUCCESS,
            data: req
        }
    }

    @get('/getListScanned')
    async getListScanned(
        @param.query.boolean('lastScanned') lastScanned?: boolean,
    ): Promise<ResponseBody | Response> {
        try {
            if (!lastScanned) {
                // @ts-ignore
                return this.response.send({
                    status: STATUS.FAILED,
                    message: MESSAGE.INVALID_INPUT
                });
            }
            const listScanned = await this.scannedBlocksSchemaRepository.find({
                where: {
                    lastScanned: lastScanned
                },
            });
            // @ts-ignore
            return this.response.send({
                status: STATUS.OK,
                ret: listScanned,
                message: MESSAGE.SUCCESS,
                data: []
            });
        } catch (e) {
            console.log(`ERROR: ${e.message}`);
            // @ts-ignore
            return this.response.send({
                status: STATUS.FAILED,
                message: e.message
            });
        }
    }
}
