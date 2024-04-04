import * as dotenv from 'dotenv';
import {
    EmailSubscribeType,
    ReqEmailSubscribeBody,
    ResponseBody
} from "../utils/Message";
import {MESSAGE, STATUS} from "../utils/constant";
dotenv.config();

import {
    Request,
    Response,
    RestBindings,
    get,
    param,
    post,
    requestBody
} from '@loopback/rest';

import {
    ScannedBlocksSchemaRepository,
    claimEventSchemaRepository,
    corePoolManagerEventSchemaRepository,
    emailSubscribeEventSchemaRepository,
    historyStakingEventSchemaRepository,
    loseEventSchemaRepository,
    pandoraPoolManagerEventSchemaRepository,
    platformFeeManagerEventSchemaRepository,
    rewardPoolManagerEventSchemaRepository,
    stakingManagerEventSchemaRepository,
    stakingPoolManagerEventSchemaRepository,
    treasuryPoolManagerEventSchemaRepository,
    whitelistManagerEventSchemaRepository,
    winEventSchemaRepository
} from "../repositories";

import {inject} from "@loopback/core";
import {
    repository
} from '@loopback/repository';

import nodemailer from "nodemailer";

export class ApiController {
    constructor(
        @inject(RestBindings.Http.REQUEST) private request: Request,
        @inject(RestBindings.Http.RESPONSE) private response: Response,
        @repository(ScannedBlocksSchemaRepository)
        public scannedBlocksSchemaRepository: ScannedBlocksSchemaRepository,
        @repository(loseEventSchemaRepository)
        public loseEventSchemaRepository: loseEventSchemaRepository,
        @repository(winEventSchemaRepository)
        public winEventSchemaRepository: winEventSchemaRepository,
        @repository(corePoolManagerEventSchemaRepository)
        public corePoolManagerEventSchemaRepository: corePoolManagerEventSchemaRepository,
        @repository(stakingPoolManagerEventSchemaRepository)
        public stakingPoolManagerEventSchemaRepository: stakingPoolManagerEventSchemaRepository,
        @repository(pandoraPoolManagerEventSchemaRepository)
        public pandoraPoolManagerEventSchemaRepository: pandoraPoolManagerEventSchemaRepository,
        @repository(treasuryPoolManagerEventSchemaRepository)
        public treasuryPoolManagerEventSchemaRepository: treasuryPoolManagerEventSchemaRepository,
        @repository(rewardPoolManagerEventSchemaRepository)
        public rewardPoolManagerEventSchemaRepository: rewardPoolManagerEventSchemaRepository,
        @repository(platformFeeManagerEventSchemaRepository)
        public platformFeeManagerEventSchemaRepository: platformFeeManagerEventSchemaRepository,
        @repository(emailSubscribeEventSchemaRepository)
        public emailSubscribeEventSchemaRepository: emailSubscribeEventSchemaRepository,
        @repository(emailSubscribeEventSchemaRepository)
        public historyStakingEventSchemaRepository: historyStakingEventSchemaRepository,
        @repository(historyStakingEventSchemaRepository)
        public claimEventSchemaRepository: claimEventSchemaRepository,
        @repository(claimEventSchemaRepository)
        public stakingManagerEventSchemaRepository: stakingManagerEventSchemaRepository,
        @repository(whitelistManagerEventSchemaRepository)
        public whitelistManagerEventSchemaRepository: whitelistManagerEventSchemaRepository,

    ) {
    }

    @get('/getBlockScanned')
    async getBlockScanned(
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

    @get('/statistic')
    async statistic(): Promise<ResponseBody | Response> {
        try {
            const [winData, loseData] = await Promise.all([
                this.winEventSchemaRepository.find(),
                this.loseEventSchemaRepository.find()
            ]);
            const result = [...winData, ...loseData];

            // Calculate unique players
            const uniquePlayers = new Set(result.map(record => record.player));
            const totalPlayers = uniquePlayers.size;

            // Calculate total bet amount, win amount, and reward amount
            const totalBetAmount = result.reduce((total, record) => total + (record.betAmount ?? 0), 0);
            const totalWinAmount = winData.reduce((total, record) => total + (record.winAmount ?? 0), 0);
            const totalRewardAmount = result.reduce((total, record) => total + (record.rewardAmount ?? 0), 0);

            // Calculate win and lose rates
            const winRate = (winData.length / result.length) * 100;
            const loseRate = 100 - winRate;

            const statistics = {
                totalPlayers,
                totalBetAmount,
                totalRewardAmount,
                totalWinAmount,
                winRate,
                loseRate,
            };

            // Send success response
            return this.response.send({
                status: STATUS.OK,
                ret: statistics,
                message: MESSAGE.SUCCESS,
                data: []
            });
        } catch (e) {
            console.log(`ERROR: ${e.message}`);
            // Send error response
            return this.response.send({
                status: STATUS.FAILED,
                message: e.message
            });
        }

    }

    @post('/getSubcribeEmail')
    async getSubcribeEmail(
        @requestBody(ReqEmailSubscribeBody) req: EmailSubscribeType
    ): Promise<ResponseBody | Response> {
        try {
            if (!req) {
                // @ts-ignore
                return this.response.send({status: STATUS.FAILED, message: MESSAGE.NO_INPUT});
            }
            let email = req?.email;
            let limit = req?.limit;
            let offset = req?.offset;
            if (!limit) limit = 15;
            if (!offset) offset = 0;
            if (!email) {
                // @ts-ignore
                return this.response.send({status: STATUS.FAILED, message: MESSAGE.NO_INPUT});
            }

            let data = await this.emailSubscribeEventSchemaRepository.find();

            let total = data.length;

            // pagination
            data = data.slice(offset, offset + limit);

            // format result
            const dataTable = data.map((data) => ({
                email: data.email,
                subcribeAt: data.createdTime,
            }));

            // @ts-ignore
            return this.response.send({
                status: STATUS.OK,
                message: MESSAGE.SUCCESS,
                ret: dataTable,
                total: total
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

    @post('/getEmailExist')
    async getEmailExist(
        @requestBody(ReqEmailSubscribeBody) req: EmailSubscribeType
    ): Promise<ResponseBody | Response> {
        try {
            if (!req) {
                // @ts-ignore
                return this.response.send({status: STATUS.FAILED, message: MESSAGE.NO_INPUT});
            }
            let email = req?.email;
            if (!email) {
                // @ts-ignore
                return this.response.send({status: STATUS.FAILED, message: MESSAGE.NO_INPUT});
            }
            const existingEmail = await this.emailSubscribeEventSchemaRepository.findOne({
                where: {email: email}
            });

            // @ts-ignore
            return this.response.send({
                status: STATUS.OK,
                message: MESSAGE.SUCCESS,
                ret: existingEmail?.email,
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

    @post('/sendEmail')
    async sendEmail(
        @requestBody(ReqEmailSubscribeBody) req: EmailSubscribeType
    ): Promise<ResponseBody | Response> {
        try {
            if (!req) {
                // @ts-ignore
                return this.response.send({status: STATUS.FAILED, message: MESSAGE.NO_INPUT});
            }
            let email = req?.email;
            let subject = req?.subject;
            let text = req?.text;
            if (!email) {
                // @ts-ignore
                return this.response.send({status: STATUS.FAILED, message: MESSAGE.NO_INPUT});
            }

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.ADMIN_EMAIL_USER,
                    pass: process.env.ADMIN_EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: process.env.ADMIN_EMAIL_USER,
                to: email,
                subject: subject,
                text: text,
            };

            const existingEmail = await this.emailSubscribeEventSchemaRepository.findOne({
                where: {email: email}
            });
            if (!existingEmail) {
                await this.emailSubscribeEventSchemaRepository.create({email});

                transporter.sendMail(mailOptions, (error: any, info: any) => {
                    if (error) {
                        return this.response.send({
                            status: STATUS.FAILED,
                            message: error.message
                        });
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });
            } else {
                return this.response.send({
                    status: STATUS.FAILED,
                    message: MESSAGE.INVALID_INPUT
                });
            }


            return this.response.send({
                status: STATUS.OK,
                message: MESSAGE.SUCCESS,
                ret: email,
            });

        } catch (e) {
            return this.response.send({
                status: STATUS.FAILED,
                message: e.message
            });
        }
    }

}
