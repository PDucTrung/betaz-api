import {ApiPromise} from "@polkadot/api";
import {Abi} from "@polkadot/api-contract";
import * as dotenv from 'dotenv';
import betaz_core_contract from "../contracts/betaz_core_contract";
import {
  ScannedBlocksSchemaRepository,
  corePoolManagerEventSchemaRepository,
  loseEventSchemaRepository,
  pandoraPoolManagerEventSchemaRepository,
  platformFeeManagerEventSchemaRepository,
  rewardPoolManagerEventSchemaRepository,
  stakingPoolManagerEventSchemaRepository,
  treasuryPoolManagerEventSchemaRepository,
  winEventSchemaRepository
} from "../repositories";
import {CONFIG_TYPE_NAME, global_vars} from "../utils/constant";
import {convertToUTCTime} from "../utils/tools";
dotenv.config();

const decimal: number = 10 ** 12;
let obj: object;

export async function scanBlocks(blocknumber: number, api: ApiPromise, abi_betaz_core: Abi, winRepo: winEventSchemaRepository, loseRepo: loseEventSchemaRepository, scannedBlocksRepo: ScannedBlocksSchemaRepository, corePoolManagerRepo: corePoolManagerEventSchemaRepository, stakingPoolManagerRepo: stakingPoolManagerEventSchemaRepository, pandoraPoolManagerRepo: pandoraPoolManagerEventSchemaRepository, treasuryPoolManagerRepo: treasuryPoolManagerEventSchemaRepository, rewardPoolManagerRepo: rewardPoolManagerEventSchemaRepository, platformFeeManagerRepo: platformFeeManagerEventSchemaRepository) {
  if (global_vars.isScanning) {
    //This to make sure always process the latest block in case still scanning old blocks
    // console.log('Process latest block: ', blocknumber);
    const blockHash = await api.rpc.chain.getBlockHash(blocknumber);
    // @ts-ignore
    const eventRecords = await api.query.system.events.at(blockHash);
    console.log(`${CONFIG_TYPE_NAME.AZ_EVENTS_COLLECTOR} - Start processEventRecords at ${blocknumber} now: ${convertToUTCTime(new Date())}`);
    await processEventRecords(
      eventRecords, blocknumber, abi_betaz_core, winRepo, loseRepo, corePoolManagerRepo, stakingPoolManagerRepo, pandoraPoolManagerRepo, treasuryPoolManagerRepo, rewardPoolManagerRepo, platformFeeManagerRepo
    );
    console.log(`${CONFIG_TYPE_NAME.AZ_EVENTS_COLLECTOR} - Stop processEventRecords at ${blocknumber} now: ${convertToUTCTime(new Date())}`);
    return;
  }
  global_vars.isScanning = true;
  const isDebug = false;
  if (!isDebug) {
    try {
      console.log(`${CONFIG_TYPE_NAME.AZ_EVENTS_COLLECTOR} - Start processEventRecords history at ${blocknumber} now: ${convertToUTCTime(new Date())}`);
      //Check database to see the last checked blockNumber
      let lastBlock_db = await scannedBlocksRepo.findOne({
        where: {
          lastScanned: true
        }
      });
      let last_scanned_blocknumber = 0;
      if (lastBlock_db && lastBlock_db?.blockNumber) {
        last_scanned_blocknumber = lastBlock_db.blockNumber;
      } else {
        try {
          await scannedBlocksRepo.create({
            lastScanned: true,
            blockNumber: 0,
            createdTime: new Date(),
            updatedTime: new Date()
          });
        } catch (e) {
          console.log(`${CONFIG_TYPE_NAME.AZ_EVENTS_COLLECTOR} - ERROR: ${e.message}`);
        }
      }
      if (last_scanned_blocknumber == 0) last_scanned_blocknumber = blocknumber;
      for (let to_scan = last_scanned_blocknumber; to_scan <= blocknumber; to_scan++) {
        // console.log('Scanning block', to_scan);
        const blockHash = await api.rpc.chain.getBlockHash(to_scan);
        // @ts-ignore
        const eventRecords = await api.query.system.events.at(blockHash);
        console.log(`${CONFIG_TYPE_NAME.AZ_EVENTS_COLLECTOR} - Start processEventRecords at ${to_scan} now: ${convertToUTCTime(new Date())}`);
        await processEventRecords(
          eventRecords, to_scan, abi_betaz_core, winRepo, loseRepo, corePoolManagerRepo, stakingPoolManagerRepo, pandoraPoolManagerRepo, treasuryPoolManagerRepo, rewardPoolManagerRepo, platformFeeManagerRepo
        );
        console.log(`${CONFIG_TYPE_NAME.AZ_EVENTS_COLLECTOR} - Stop processEventRecords at ${to_scan} now: ${convertToUTCTime(new Date())}`);
        try {
          await scannedBlocksRepo.updateAll({
            lastScanned: true,
            blockNumber: to_scan,
            updatedTime: new Date()
          });
        } catch (e) {
          console.log(`${CONFIG_TYPE_NAME.AZ_EVENTS_COLLECTOR} - ERROR: ${e.message}`);
        }
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  global_vars.isScanning = false;
};

export async function processEventRecords(eventRecords: any, to_scan: number, abi_betaz_core: Abi, winRepo: winEventSchemaRepository, loseRepo: loseEventSchemaRepository, corePoolManagerRepo: corePoolManagerEventSchemaRepository, stakingPoolManagerRepo: stakingPoolManagerEventSchemaRepository, pandoraPoolManagerRepo: pandoraPoolManagerEventSchemaRepository, treasuryPoolManagerRepo: treasuryPoolManagerEventSchemaRepository, rewardPoolManagerRepo: rewardPoolManagerEventSchemaRepository, platformFeeManager: platformFeeManagerEventSchemaRepository) {
  for (const record of eventRecords) {
    // Extract the phase, event and the event types
    const {phase, event: {data, method, section}} = record;
    if (section == "contracts" && method == "ContractEmitted") {
      // console.log({
      //   record: {
      //     section: section,
      //     method: method
      //   }
      // });
      const [accId, bytes] = data.map((data: any, _: any) => data).slice(0, 2);
      const contract_address = accId.toString();
      if (contract_address == betaz_core_contract.CONTRACT_ADDRESS) {
        try {
          console.log(`${CONFIG_TYPE_NAME.AZ_EVENTS_COLLECTOR} - Event from Betaz core Contract...`);
          const decodedEvent = abi_betaz_core.decodeEvent(bytes);
          let event_name = decodedEvent.event.identifier;
          const eventValues = [];

          for (let i = 0; i < decodedEvent.args.length; i++) {
            const value = decodedEvent.args[i];
            eventValues.push(value.toString());
          }
          if (event_name == "WinEvent") {
            obj = {
              blockNumber: to_scan,
              player: eventValues[0],
              isOver: parseFloat(eventValues[1]) === 1,
              randomNumber: eventValues[2],
              betNumber: eventValues[3],
              betAmount: eventValues[4] ? parseFloat(eventValues[4]) / decimal : 0,
              winAmount: eventValues[5] ? parseFloat(eventValues[5]) / decimal : 0,
              rewardAmount: eventValues[6] ? parseFloat(eventValues[6]) / decimal : 0,
              oracleRound: eventValues[7],
            };
            let found = await winRepo.findOne({
              where: obj
            });
            if (!found) {
              await winRepo.create(obj).catch((e) => {
                console.log(`${CONFIG_TYPE_NAME.AZ_EVENTS_COLLECTOR} - ERROR: ${e.message}`);
              });;
              console.log(`${CONFIG_TYPE_NAME.AZ_EVENTS_COLLECTOR} - added winEvent: `, obj);
            }
          } else if (event_name == "LoseEvent") {
            obj = {
              blockNumber: to_scan,
              player: eventValues[0],
              isOver: parseFloat(eventValues[1]) === 1,
              randomNumber: eventValues[2],
              betNumber: eventValues[3],
              betAmount: eventValues[4] ? parseFloat(eventValues[4]) / decimal : 0,
              rewardAmount: eventValues[5] ? parseFloat(eventValues[5]) / decimal : 0,
              oracleRound: eventValues[6],
            };
            let found = await loseRepo.findOne({
              where: obj
            });
            if (!found) {
              await loseRepo.create(obj).catch((e) => {
                console.log(`${CONFIG_TYPE_NAME.AZ_EVENTS_COLLECTOR} - ERROR: ${e.message}`);
              });
              console.log(`${CONFIG_TYPE_NAME.AZ_EVENTS_COLLECTOR} - added loseEvent: `, obj);
            }
          } else if (event_name == "UpdateCorePoolAmount") {
            obj = {
              blockNumber: to_scan,
              contract_address: eventValues[0],
              caller: eventValues[1],
              from: eventValues[2],
              to: eventValues[3],
              amount: eventValues[4] ? parseFloat(eventValues[4]) / decimal : 0,
              time: eventValues[5],
            };
            let found = await corePoolManagerRepo.findOne(obj);
            if (!found) {
              await corePoolManagerRepo.create(obj);
              console.log("added CorePoolManager", obj);
            }
          } else if (event_name == "UpdateStakingPoolAmount") {
            obj = {
              blockNumber: to_scan,
              contract_address: eventValues[0],
              caller: eventValues[1],
              from: eventValues[2],
              to: eventValues[3],
              amount: eventValues[4] ? parseFloat(eventValues[4]) / decimal : 0,
              time: eventValues[5],
            };
            let found = await stakingPoolManagerRepo.findOne(obj);
            if (!found) {
              await stakingPoolManagerRepo.create(obj);
              console.log("added StakingPoolManager", obj);
            }
          } else if (event_name == "UpdatePandoraPoolAmount") {
            obj = {
              blockNumber: to_scan,
              contract_address: eventValues[0],
              caller: eventValues[1],
              from: eventValues[2],
              to: eventValues[3],
              amount: eventValues[4] ? parseFloat(eventValues[4]) / decimal : 0,
              time: eventValues[5],
            };
            let found = await pandoraPoolManagerRepo.findOne(obj);
            if (!found) {
              await pandoraPoolManagerRepo.create(obj);
              console.log("added PandoraPoolManager", obj);
            }
          } else if (event_name == "UpdateTreasuryPoolAmount") {
            obj = {
              blockNumber: to_scan,
              contract_address: eventValues[0],
              caller: eventValues[1],
              from: eventValues[2],
              to: eventValues[3],
              amount: eventValues[4] ? parseFloat(eventValues[4]) / decimal : 0,
              time: eventValues[5],
            };
            let found = await treasuryPoolManagerRepo.findOne(obj);
            if (!found) {
              await treasuryPoolManagerRepo.create(obj);
              console.log("added TreasuryPoolManager", obj);
            }
          } else if (event_name == "UpdateRewardPoolAmount") {
            obj = {
              blockNumber: to_scan,
              contract_address: eventValues[0],
              caller: eventValues[1],
              from: eventValues[2],
              to: eventValues[3],
              amount: eventValues[4] ? parseFloat(eventValues[4]) / decimal : 0,
              time: eventValues[5],
            };
            let found = await rewardPoolManagerRepo.findOne(obj);
            if (!found) {
              await rewardPoolManagerRepo.create(obj);
              console.log("added RewardPoolManager", obj);
            }
          } else if (event_name == "UpdatePlatformFeeAmount") {
            obj = {
              blockNumber: to_scan,
              contract_address: eventValues[0],
              caller: eventValues[1],
              from: eventValues[2],
              to: eventValues[3],
              amount: eventValues[4] ? parseFloat(eventValues[4]) / decimal : 0,
              time: eventValues[5],
            };
            let found = await platformFeeManager.findOne(obj);
            if (!found) {
              await platformFeeManager.create(obj);
              console.log("added PlatformFeeManager", obj);
            }
          }
          console.log(to_scan, contract_address, event_name, eventValues);
        } catch (e) {
          console.log(`${CONFIG_TYPE_NAME.AZ_EVENTS_COLLECTOR} - ERROR: ${e.message}`);
        }
      }
    }
  }
};

