import BN from "bn.js";
import {convertNumberWithoutCommas, readOnlyGasLimit} from "../utils/utils";
import {ContractPromise} from "@polkadot/api-contract";

let az_nft_contract: ContractPromise;

export function setContract(c: ContractPromise) {
    az_nft_contract = c;
}

export async function totalSupply(caller_account: string) {
    if (!az_nft_contract || !caller_account) {
        return null;
    }
    const address = caller_account;
    // @ts-ignore
    const gasLimit = readOnlyGasLimit(az_nft_contract.api);
    const azero_value = 0;
    // @ts-ignore
    const {result, output} = await az_nft_contract.query["psp34::totalSupply"](
        address,
        {value: azero_value, gasLimit}
    );
    if (result.isOk && output) {
        // @ts-ignore
        return new BN(output.toHuman()?.Ok, 10, "le").toNumber();
    }
    return null;
}

export async function getLastTokenId(caller_account: string) {
    if (!az_nft_contract || !caller_account) {
        return null;
    }
    const address = caller_account;
    // @ts-ignore
    const gasLimit = readOnlyGasLimit(az_nft_contract.api);
    const azero_value = 0;
    // @ts-ignore
    const {result, output} = await az_nft_contract.query["psp34Traits::getLastTokenId"](
        address,
        {value: azero_value, gasLimit}
    );
    if (result.isOk && output) {
        // @ts-ignore
        return convertNumberWithoutCommas(output.toHuman().Ok);
    }
    return null;
}

export async function ownerOf(caller_account: string, tokenId: {u64: number}) {
    if (!az_nft_contract || !caller_account) {
        return null;
    }
    const address = caller_account;
    // @ts-ignore
    const gasLimit = readOnlyGasLimit(az_nft_contract.api);
    const azero_value = 0;
    // @ts-ignore
    const {result, output} = await az_nft_contract.query["psp34::ownerOf"](
        address,
        {value: azero_value, gasLimit},
        tokenId
    );
    if (result.isOk && output) {
        // @ts-ignore
        return output.toHuman()?.Ok;
    }
    return null;
}
