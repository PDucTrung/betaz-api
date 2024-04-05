import {BN, BN_ONE, hexToU8a, isHex, u8aToHex} from "@polkadot/util";
import {decodeAddress, encodeAddress} from "@polkadot/keyring";
import {ApiPromise} from "@polkadot/api";
import {WeightV2} from "@polkadot/types/interfaces";
import axios from "axios";
import {STATUS} from "./constant";
import {signatureVerify} from '@polkadot/util-crypto'
import {ContractPromise} from "@polkadot/api-contract";
import {convertWeight} from "@polkadot/api-contract/base/util";
import {ApiBase} from "@polkadot/api/base";
import {Response} from "@loopback/rest";
import dotenv from "dotenv";
import moment from "moment";
// import {globalApi} from "../scripts/getTimestamp";
dotenv.config();

// @ts-ignore
const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);

export function convertStringToDateTime(stringTimeStamp: string) {
  let timeStamp = stringTimeStamp;

  if (typeof stringTimeStamp === "string") {
    /* eslint-disable no-useless-escape */
    timeStamp = stringTimeStamp.replace(/\,/g, "");
  }

  return moment(parseInt(timeStamp)).format("MMM D YYYY, H:mm");
}

export async function send_message(message: string) {
    try {
        await axios({
            baseURL: process.env.TELEGRAM_URL,
            url: "/sendMessage",
            method: "post",
            data: {
                "chat_id": process.env.TELEGRAM_ID_CHAT,
                "text": `${process.env.NODE_IP}: ${message}`
            },
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (e) {
        console.log(e);
    }
}

export function send_telegram_message(message: string) {
    try {
        new Promise(async () => {
            await axios({
                baseURL: process.env.TELEGRAM_URL,
                url: "/sendMessage",
                method: "post",
                data: {
                    "chat_id": process.env.TELEGRAM_ID_CHAT,
                    "text": `${process.env.NODE_IP}: ${message}`
                },
                headers: {
                    "Content-Type": "application/json",
                    "cache-control": "no-cache",
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }).then(() => {});
    } catch (e) {
        console.log(e);
    }
}

export function send_telegram_bot(
  message: string,
  chatid: string | undefined,
  threadid: string | undefined,
) {
  try {
    new Promise(async () => {
      await axios({
        baseURL: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_NOTIFY_TOKEN}`,
        url: '/sendMessage',
        method: 'post',
        data: {
          chat_id: chatid,
          text: message,
          message_thread_id: threadid,
          parse_mode: 'html',
          disable_web_page_preview: true,
        },
        headers: {
          'Content-Type': 'application/json',
          'cache-control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }).then(() => {});
  } catch (e) {
    console.log(e);
  }
}

export function send_report_telegram_message(message: string) {
    try {
        new Promise(async () => {
            axios({
                baseURL: process.env.TELEGRAM_REPORT_URL,
                url: "/sendMessage",
                method: "post",
                data: {
                    "chat_id": process.env.TELEGRAM_REPORT_ID_CHAT,
                    "text": `${process.env.NODE_IP}: ${message}`
                },
                headers: {
                    "Content-Type": "application/json",
                    "cache-control": "no-cache",
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }).then(()=>{});
    } catch (e) {
        console.log(e);
    }
}


export function convertNumberWithoutCommas(input: string):string {
    return input.replace(/,/g, "");
}

export function splitFileName(path: string):string {
    let str = path.split('\\').pop();
    if (str) {
        str = str.split('/').pop();
    }
    return str ? str : "";
}

export function randomString(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export async function getFileTypeFromCID() {}

export function isValidAddressPolkadotAddress(address: string): boolean {
    try {
        encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));
        return true;
    } catch (error) {
        return false;
    }
}

export async function delay(timeout: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}

export function todayFolder():string {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; //months = require(1-12)
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const hour = dateObj.getHours();
    return year + "/" + month + "/" + day + "/" + hour;
}

export async function client(
    method: string,
    url: string,
    options = {},
    baseURL = process.env.REACT_APP_API_BASE_URL
) {
    const headers = {
        Accept: "*/*",
        "Content-Type": "application/x-www-form-urlencoded",
    };
    const urlencodedOptions = new URLSearchParams(
        Object.entries(options)
    ).toString();
    const { data } = await axios({
        baseURL,
        url,
        method,
        headers,
        data: urlencodedOptions,
    });
    const { status, ret, message } = data;
    if (status === STATUS.OK) {
        return ret;
    }
    if (status === STATUS.FAILED) {
        return message;
    }
    return data;
}

// @ts-ignore
export const APICall = {
    getMetadataOffChain: async (param: { tokenUri:string, tokenID: number }) => {
        try {
            const ret = await client(
                "GET",
                `/getJSON?input=${param.tokenUri}${param.tokenID}.json`,
                {}
            );
            // console.log("getMetadataOffChain ret", ret);
            return ret;
        } catch (e) {
            return null;
        }
    },
    // NFT Info by Hash API Calls
    // @ts-ignore
    getNftInfoByHash: async ({ hash }) => {
        try {
            return await client("GET", `/${hash}`, {}, process.env.IPFS_BASE_URL);
        } catch (e) {
            return null;
        }
    },
}

export function readOnlyGasLimit(api: ApiPromise):WeightV2 {
    // @ts-ignore
    return api.registry.createType('WeightV2', {
        refTime: new BN(1_000_000_000_000),
        proofSize: MAX_CALL_WEIGHT,
    });
}

export const isValidSignature = (signedMessage: string, signature: string, address: string) => {
    const publicKey = decodeAddress(address);
    const hexPublicKey = u8aToHex(publicKey);

    return signatureVerify(signedMessage, signature, hexPublicKey).isValid;
  };


const toContractAbiMessage = (
    contractPromise: ContractPromise,
    message: string
) => {
    const value = contractPromise.abi.messages.find((m) => m.method === message);

    if (!value) {
        const messages = contractPromise?.abi.messages.map((m) => m.method).join(', ');

        const error = `"${message}" not found in metadata.spec.messages: [${messages}]`;
        console.error(error);

        return { ok: false, error };
    }

    return { ok: true, value };
};

export async function getGasLimit(
    api: ApiBase<any>,
    userAddress: string,
    message: string,
    contract: ContractPromise,
    options = {},
    args: any[] = []
    // temporarily type is Weight instead of WeightV2 until polkadot-js type `ContractExecResult` will be changed to WeightV2
) {
    const abiMessage = toContractAbiMessage(contract, message)
    if (!abiMessage.ok) return abiMessage;
    // @ts-ignore
    const { value, gasLimit, storageDepositLimit } = options;
    // @ts-ignore
    const result = await api.call.contractsApi.call(
        userAddress,
        contract.address,
        value ?? new BN(0),
        gasLimit ?? null,
        storageDepositLimit ?? null,
        abiMessage?.value?.toU8a(args)
    );
    // @ts-ignore
    const {v2Weight} = convertWeight(result?.gasRequired);
    const gasRequired = api.registry.createType("WeightV2", {
        refTime: v2Weight.refTime.add(new BN(25_000_000_000)),
        proofSize: v2Weight.proofSize,
    });
    return { ok: true, value: gasRequired };
}

export function convertStringToPrice(stringPrice: string) {
    try {
        const a = stringPrice.replace(/\,/g, "");
        return parseInt(a) / 10 ** 12;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

export function formatNumberOutput(o:any) {
    const frmtRet = o.toHuman().Ok;
    return parseInt(frmtRet?.replaceAll(",", ""));
}

export function strToNumber(str:string):number {
    if (!str) return 0;
    const number = str.replace(/,/g, "");
    return parseFloat(number);
}

export async function getFile(location: string, res: Response) {
    await new Promise((resolve: any, reject: any) => {
        // @ts-ignore
        res.download(location, (err: any) => {
            if (err) reject(err);
            resolve();
        });
    });
}

export async function getTimestampFromBlockNumber(api: ApiPromise, blockNumber: number): Promise<number> {
    let timestamp = 0;
    try {
        const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
        const signedBlock = await api.rpc.chain.getBlock(blockHash);
        signedBlock?.block?.extrinsics?.forEach(
            ({ method: { args, section, method: extrinsicsMethod } }) => {
                if (section === "timestamp" && extrinsicsMethod === "set") {
                    timestamp = parseInt(args[0].toString());
                    // console.log(`blockNumber: ${blockNumber} - timestamp: ${args[0].toString()} - Time: ${(new Date(timestamp)).toUTCString()}`);
                }
            }
        );
    } catch (e) {
        console.log(`ERROR: getTimestampFromBlockNumber - ${e.message}`);
    }
    return timestamp;
}

export function isAzEnabled(azDomainAddress?: string): {
    isAzDomain: boolean,
    isEnabled: boolean
} {
    try {
        if (!azDomainAddress) {
            return {
                isAzDomain: false,
                isEnabled: false
            };
        }
        let azeroDomainConfig = process.env.AZERO_DOMAIN_LIST;
        if (azeroDomainConfig) {
            azeroDomainConfig = azeroDomainConfig.replace('[','').replace(']','');
            const tmp = azeroDomainConfig.split(',');
            for (const data of tmp) {
                const info = data.split('-');
                const address = info[0];
                const isEnable = info[1] === "true";
                // Check and return the first address that is matched
                if (azDomainAddress === address) {
                    return {
                        isAzDomain: true,
                        isEnabled: isEnable
                    };
                }
            }
            return {
                isAzDomain: false,
                isEnabled: false
            };
        }
    } catch (e) {
        console.log(`ERROR - isAzEnabled: ${e.messages}`);
    }
    return {
        isAzDomain: false,
        isEnabled: false
    };
}

export function hexToAscii(str1: string): string {
    let hex = str1?.toString().replace(`0x`,'');
    let str = "";
    for (let n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
}
