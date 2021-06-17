// Copyright (C) 2018, Zpalmtree
//
// Please see the included LICENSE file for more information.

'use strict';

import { NativeModules } from 'react-native';
import { TransactionInput } from 'turtlecoin-wallet-backend';

export async function generateKeyImage(
    publicEphemeral,
    privateEphemeral) {
    return NativeModules.PluraCoin.generateKeyImage(
        publicEphemeral, privateEphemeral,
    );
}

export async function deriveSecretKey(
    derivation,
    outputIndex,
    privateSpendKey) {
    return NativeModules.PluraCoin.deriveSecretKey(
        derivation, { outputIndex }, privateSpendKey
    );
}

export async function derivePublicKey(
    derivation,
    outputIndex,
    publicSpendKey) {
    return NativeModules.PluraCoin.derivePublicKey(
        derivation, { outputIndex }, publicSpendKey
    );
}

export async function generateKeyDerivation(
    transactionPublicKey,
    privateViewKey) {

    return NativeModules.PluraCoin.generateKeyDerivation(
        transactionPublicKey, privateViewKey,
    );
}

export async function generateRingSignatures(
    transactionPrefixHash,
    keyImage,
    inputKeys,
    privateKey,
    realIndex) {
    return NativeModules.PluraCoin.generateRingSignatures(
        transactionPrefixHash, keyImage, inputKeys, privateKey, { realIndex }
    );
}

export async function checkRingSignature(
    transactionPrefixHash,
    keyImage,
    publicKeys,
    signatures) {
    return NativeModules.PluraCoin.checkRingSignature(
        transactionPrefixHash, keyImage, publicKeys, signatures
    );
}

export async function makePostRequest(endpoint, body) {

    if (endpoint !== '/sync') {
        console.log("Native not /sync request to endpoint=" + endpoint);
        return this.makeRequest(endpoint, 'POST', body);
    }

    const {
        count,
        checkpoints,
        skipCoinbaseTransactions,
        height,
        timestamp,
    } = body;

    const protocol = this.sslDetermined ? (this.ssl ? 'https' : 'http') : 'https';
    //const url = `${protocol}://${this.host}:${this.port}/sync`;
    const url = 'https://mw-api-eu.pluracoin.org/sync';
    console.log("native " + url);

    /* This is being executed within the Daemon module, so we can get access
       to it's class with `this` */
    var d = new Date();
    var n = d.getTime();

    let data = await NativeModules.PluraCoin.getWalletSyncData(
        count,
        checkpoints,
        skipCoinbaseTransactions,
        height,
        timestamp,
        url
    );

    var d2 = new Date();
    var n2 = d2.getTime();
    console.log(`Time taken ${(n2-n)} ms`);

    if (data.error) {
        if (this.sslDetermined) {
            throw new Error(data.error);
        }

        /* Ssl failed, lets try http */
        data = await NativeModules.PluraCoin.getWalletSyncData(
            count,
            checkpoints,
            skipCoinbaseTransactions,
            height,
            timestamp,
            `http://mw-api-eu.pluracoin.org/sync`,
        );

        if (data.error) {
            throw new Error(data.error);
        }

        try {
            data = JSON.parse(data);

            this.ssl = false;
            this.sslDetermined = true;

            return [data, 200];
        } catch (err) {
            throw new Error(err);
        }
    }

    try {
        data = JSON.parse(data)
    } catch (err) {
        throw new Error(err);
    }

    return [data, 200];
}

export async function processBlockOutputs(
    block,
    privateViewKey,
    spendKeys,
    isViewWallet,
    processCoinbaseTransactions) {

    /* We crash if we pass in something bigger than 2^64, cap it */
    capIntToSafeValue(block);

    const javaSpendKeys = spendKeys.map(([publicKey, privateKey]) => {
        return {
            'publicKey': publicKey,
            'privateKey': privateKey,
        }
    });

    console.log("\n NATIVE javaSpendKeys = " + JSON.stringify(javaSpendKeys));

    let inputs = await NativeModules.PluraCoin.processBlockOutputs(
        block, privateViewKey, javaSpendKeys, isViewWallet,
        processCoinbaseTransactions,
    );

    console.log("\n NATIVE inputs = " + JSON.stringify(inputs));

    let jsInputs = inputs.map((data) => {
        let tx = block.transactions.find((t) => t.hash === data.input.parentTransactionHash);

        console.log("\ntx > " + JSON.stringify(tx));

        if (!tx) {
            tx = block.coinbaseTransaction;
        }

        const spendHeight = 0;

        const globalIndex = data.input.globalOutputIndex === -1
                          ? undefined : data.input.globalOutputIndex;

        console.log("\nNATIVE data.input.keyImage = " + data.input.keyImage);
        console.log("\nNATIVE data.input.amount = " + data.input.amount);
        console.log("\nNATIVE block.blockHeight = " + block.blockHeight);
        console.log("\nNATIVE tx.transactionPublicKey = " + tx.transactionPublicKey);
        console.log("\nNATIVE globalIndex = " + globalIndex);
        console.log("\nNATIVE data.input.key = " + data.input.key);
        console.log("\nspendHeight = " + spendHeight);
        console.log("\ntx.unlockTime = " + tx.unlockTime);
        console.log("\ndata.input.parentTransactionHash = " + data.input.parentTransactionHash);

        const input = new TransactionInput(
            data.input.keyImage,
            data.input.amount,
            block.blockHeight,
            tx.transactionPublicKey,
            data.input.transactionIndex,
            globalIndex,
            data.input.key,
            spendHeight,
            tx.unlockTime,
            data.input.parentTransactionHash,
        );

        console.log("input > " + JSON.stringify(input));

        return [data.publicSpendKey, input];
    });

    return jsInputs;
}

/* Native code will explode if we pass in > 2^64 - 1. So, cap it to this.
   However, node can't perform math with > 2^53, so we have to cap it to that */
function capIntToSafeValue(object) {
    Object.keys(object).forEach(function(element) {
        /* Recurse if this element is also an object */
        if (typeof object[element] === 'object') {
            capIntToSafeValue(object[element]);
        } else if (typeof object[element] === 'number' && object[element] > Number.MAX_SAFE_INTEGER) {
            object[element] = Number.MAX_SAFE_INTEGER;
        }
    });
}
