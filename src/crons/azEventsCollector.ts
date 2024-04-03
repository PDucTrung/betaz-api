import {Provider} from '@loopback/core';
import {CronJob, cronJob} from '@loopback/cron';
import {repository} from "@loopback/repository";
import {ApiPromise, WsProvider} from "@polkadot/api";
import {Abi} from "@polkadot/api-contract";
import jsonrpc from "@polkadot/types/interfaces/jsonrpc";
import betaz_core_contract from "../contracts/betaz_core_contract";
import {
    ScannedBlocksSchemaRepository,
    loseEventSchemaRepository,
    winEventSchemaRepository,
    corePoolManagerEventSchemaRepository,
    pandoraPoolManagerEventSchemaRepository,
    platformFeeManagerEventSchemaRepository,
    rewardPoolManagerEventSchemaRepository,
    stakingPoolManagerEventSchemaRepository,
    treasuryPoolManagerEventSchemaRepository,
} from "../repositories";
import {
    CONFIG_TYPE_NAME,
    CRONJOB_ENABLE,
    CRONJOB_TIME,
    SOCKET_STATUS,
    global_vars,
} from "../utils/constant";
import {convertToUTCTime} from "../utils/tools";
import {scanBlocks} from "./actions";
@cronJob()
export class CronJobAzEventsCollector implements Provider<CronJob> {
    private isJobStarted: boolean = false;

    constructor(
        @repository(ScannedBlocksSchemaRepository)
        public scannedBlocksSchemaRepository: ScannedBlocksSchemaRepository,
        @repository(winEventSchemaRepository)
        public winEventSchemaRepository: winEventSchemaRepository,
        @repository(loseEventSchemaRepository)
        public loseEventSchemaRepository: loseEventSchemaRepository,
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
    ) {
    }

    value() {
        return new CronJob({
            cronTime: CRONJOB_TIME.AZ_EVENTS_COLLECTOR,
            name: CONFIG_TYPE_NAME.AZ_EVENTS_COLLECTOR,
            onTick: async () => {
                if (!this.isJobStarted) {
                    this.isJobStarted = true;
                    try {
                        let getConfig: boolean = CRONJOB_ENABLE.AZ_EVENTS_COLLECTOR;
                        if (getConfig) {
                            const currentTime = convertToUTCTime(new Date());
                            console.log(`${CONFIG_TYPE_NAME.AZ_EVENTS_COLLECTOR} - RUN JOB AZ_EVENTS_COLLECTOR NOW: ${currentTime}`);

                            try {
                                const scannedBlocksRepo = this.scannedBlocksSchemaRepository;
                                const winRepo = this.winEventSchemaRepository;
                                const loseRepo = this.loseEventSchemaRepository;
                                const corePoolManagerRepo = this.corePoolManagerEventSchemaRepository;
                                const stakingPoolManagerRepo = this.stakingPoolManagerEventSchemaRepository;
                                const pandoraPoolManagerRepo = this.pandoraPoolManagerEventSchemaRepository;
                                const treasuryPoolManagerRepo = this.treasuryPoolManagerEventSchemaRepository;
                                const rewardPoolManagerRepo = this.rewardPoolManagerEventSchemaRepository;
                                const platformFeeManagerRepo = this.platformFeeManagerEventSchemaRepository;

                                const rpc = process.env.ALEPHZERO_PROVIDER_URL;
                                if (!rpc) {
                                    console.log(`RPC not found! ${rpc}`);
                                    return;
                                }
                                const provider = new WsProvider(rpc);
                                const eventApi = new ApiPromise({
                                    provider,
                                    rpc: jsonrpc,
                                    types: {
                                        ContractsPsp34Id: {
                                            _enum: {
                                                U8: "u8",
                                                U16: "u16",
                                                U32: "u32",
                                                U64: "u64",
                                                U128: "u128",
                                                Bytes: "Vec<u8>",
                                            },
                                        },
                                    },
                                });
                                eventApi.on("connected", () => {
                                    eventApi.isReady.then(async (api: any) => {
                                        console.log(`Global RPC Connected: ${rpc}`);
                                    });
                                });
                                eventApi.on("ready", async () => {
                                    console.log("Global RPC Ready");
                                    global_vars.socketStatus = SOCKET_STATUS.READY;

                                    // TODO: Start scanBlocks
                                    console.log(`${CONFIG_TYPE_NAME.AZ_EVENTS_COLLECTOR} - Smartnet AZERO Ready`);
                                    global_vars.isScanning = false;

                                    const abi_betaz_core = new Abi(betaz_core_contract.CONTRACT_ABI);
                                    console.log(`${CONFIG_TYPE_NAME.AZ_EVENTS_COLLECTOR} - Betaz core Contract ABI is ready`);

                                    // @ts-ignore
                                    await eventApi.rpc.chain.subscribeNewHeads((header: any) => {
                                        try {
                                            scanBlocks(
                                                parseInt(header.number.toString()),
                                                eventApi,
                                                abi_betaz_core,
                                                winRepo,
                                                loseRepo,
                                                scannedBlocksRepo,
                                                corePoolManagerRepo, stakingPoolManagerRepo, pandoraPoolManagerRepo, treasuryPoolManagerRepo, rewardPoolManagerRepo, platformFeeManagerRepo
                                            );
                                        } catch (e) {
                                            console.log(`${CONFIG_TYPE_NAME.AZ_EVENTS_COLLECTOR} - ERROR: ${e.message}`);
                                        }
                                    });
                                });
                                eventApi.on("error", (err: any) => {
                                    console.log('error', err);
                                    global_vars.socketStatus = SOCKET_STATUS.ERROR;
                                });
                            } catch (e) {
                                console.log(`API GLOBAL - ERROR: ${e.message}`);
                            }
                        }
                    } catch (e) {
                        console.log(`${CONFIG_TYPE_NAME.AZ_EVENTS_COLLECTOR} - ERROR: ${e.message}`);
                    }
                }
            },
            start: true,
        });
    }
}
