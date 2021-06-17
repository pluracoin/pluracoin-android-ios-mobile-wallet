// Copyright (C) 2018, Zpalmtree
//
// Please see the included LICENSE file for more information.

import { Platform } from 'react-native';

import { MixinLimit, MixinLimits, Daemon } from 'turtlecoin-wallet-backend';

import {
    derivePublicKey, generateKeyDerivation, generateRingSignatures,
    deriveSecretKey, generateKeyImage, checkRingSignature,
} from './NativeCode';

const Config = new function() {
    /**
     * If you can't figure this one out, I don't have high hopes
     */
    this.coinName = 'PluraCoin';

    /**
     * Prefix for URI encoded addresses
     */
    this.uriPrefix = 'pluracoin://';

    /**
     * How often to save the wallet, in milliseconds
     */
    this.walletSaveFrequency = 60 * 1000;

    /**
     * The amount of decimal places your coin has, e.g. TurtleCoin has two
     * decimals
     */
    this.decimalPlaces = 10;
    this.decimalPlacesShown = 2;

    /**
     * The address prefix your coin uses - you can find this in CryptoNoteConfig.h.
     * In TurtleCoin, this converts to TRTL
     */
    //this.addressPrefix = 3914525;
    this.addressPrefix = 137;

    /**
     * Request timeout for daemon operations in milliseconds
     */
    this.requestTimeout = 10 * 1000;

    /**
     * The block time of your coin, in seconds
     */
    this.blockTargetTime = 120;

    /**
     * How often to process blocks, in millseconds
     */
    this.syncThreadInterval = 4;

    /**
     * How often to update the daemon info, in milliseconds
     */
    this.daemonUpdateInterval = 30 * 1000;

    /**
     * How often to check on locked transactions
     */
    this.lockedTransactionsCheckInterval = 10 * 3000;

    /**
     * The amount of blocks to process per 'tick' of the mainloop. Note: too
     * high a value will cause the event loop to be blocked, and your interaction
     * to be laggy.
     */
    this.blocksPerTick = 25;

    /**
     * Amount of blocks to request from the daemon at once
     */
    this.blocksPerDaemonRequest = 10;

    /**
     * Your coins 'ticker', generally used to refer to the coin, i.e. 123 TRTL
     */
    this.ticker = 'PLURA';

    /**
     * Most people haven't mined any blocks, so lets not waste time scanning
     * them
     */
    this.scanCoinbaseTransactions = false;

    /**
     * The minimum fee allowed for transactions, in ATOMIC units
     */
    this.minimumFee = 100000000;

    /* Fee per byte is rounded up in chunks. This helps makes estimates
         * more accurate. It's suggested to make this a power of two, to relate
         * to the underlying storage cost / page sizes for storing a transaction. */

    this.feePerByteChunkSize = 256;

    /* Fee to charge per byte of transaction. Will be applied in chunks, see
     * above. This value comes out to 1.953125. We use this value instead of
     * something like 2 because it makes for pretty resulting fees
     * - 5 TRTL vs 5.12 TRTL. You can read this as.. the fee per chunk
     * is 500 atomic units. The fee per byte is 500 / chunk size. */

    //this.feePerByte = true;
    this.minimumFeePerByte = 100000000 / this.feePerByteChunkSize;

    this.maximumOutputAmount = 100000000000000,

    /**
     * Mapping of height to mixin maximum and mixin minimum
     */
    this.mixinLimits = new MixinLimits([
        /* Height: 440,000, minMixin: 0, maxMixin: 100, defaultMixin: 3 */
        new MixinLimit(0, 0, 100, 3),

        /* At height of 620000, static mixin of 7 */
        //new MixinLimit(620000, 7),

        /* At height of 800000, static mixin of 3 */
        //new MixinLimit(800000, 3),
    ], 0 /* Default mixin of 3 before block 440,000 */);

    /**
     * The length of a standard address for your coin
     */
    //this.standardAddressLength = 99;
    this.standardAddressLength = 97;

    /**
     * The length of an integrated address for your coin - It's the same as
     * a normal address, but there is a paymentID included in there - since
     * payment ID's are 64 chars, and base58 encoding is done by encoding
     * chunks of 8 chars at once into blocks of 11 chars, we can calculate
     * this automatically
     */
    //this.integratedAddressLength = 99 + ((64 * 11) / 8);
    this.integratedAddressLength = 97 + ((64 * 11) / 8);

    /**
     * Use our native func instead of JS slowness
     */
    this.derivePublicKey = Platform.OS === 'ios' ? undefined : derivePublicKey;

    /**
     * Use our native func instead of JS slowness
     */
    this.generateKeyDerivation = Platform.OS === 'ios' ? undefined : generateKeyDerivation;

    /**
     * Use our native func instead of JS slowness
     */
    this.generateRingSignatures = Platform.OS === 'ios' ? undefined : generateRingSignatures;

    /**
     * Use our native func instead of JS slowness
     */
    this.deriveSecretKey = Platform.OS === 'ios' ? undefined : deriveSecretKey;

    /**
     * Use our native func instead of JS slowness
     */
    this.generateKeyImage = Platform.OS === 'ios' ? undefined : generateKeyImage;

    /**
     * Use our native func instead of JS slowness
     */
    this.checkRingSignatures = Platform.OS === 'ios' ? undefined: checkRingSignature;

    /**
     * Memory to use for storing downloaded blocks - 3MB
     */
    this.blockStoreMemoryLimit = 1024 * 1024 * 1;

    this.maxLastFetchedBlockInterval = 60 * 6;
    /**
     * The amount of seconds to permit not having fetched a new network height
     * from the daemon before emitting 'deadnode'.
     */
    this.maxLastUpdatedNetworkHeightInterval = 60 * 6;
    /**
     * The amount of seconds to permit not having fetched a new local height
     * from the daemon before emitting 'deadnode'.
     */
    this.maxLastUpdatedLocalHeightInterval = 60 * 6;

    /**
     * Unix timestamp of the time your chain was launched.
     *
     * Note - you may want to manually adjust this. Take the current timestamp,
     * take away the launch timestamp, divide by block time, and that value
     * should be equal to your current block count. If it's significantly different,
     * you can offset your timestamp to fix the discrepancy
     */
    this.chainLaunchTimestamp = new Date(1000 * 1513031505);

    /**
     * Fee to take on all transactions, in percentage
     */
    this.devFeePercentage = 0;

    /**
     * Address to send dev fee to
     */
    this.devFeeAddress = 'Pv7eisSU72EDq1oALXC58n8VCKxGMm3tUQjP5YifrQQiaBtgHDMone4QR4AmKEqGha7yr9LoFA1AEMMBeCg3fLrs2aG2c9ppU';

    /**
     * Base url for price API
     *
     * The program *should* fail gracefully if your coin is not supported, or
     * you just set this to an empty string. If you have another API you want
     * it to support, you're going to have to modify the code in Currency.js.
     */
    this.priceApiLink = 'https://api.coingecko.com/api/v3/simple/price';

    /**
     * Default daemon to use.
     */
    //this.defaultDaemon = new Daemon('community.pluracoin.org', 19201, undefined, false);
    this.defaultDaemon = new Daemon('https://mw-api-eu.pluracoin.org', 443, true, false);

    /**
     * A link to where a bug can be reported for your wallet. Please update
     * this if you are forking, so we don't get reported bugs for your wallet...
     *
     */
    this.repoLink = 'https://github.com/turtlecoin/turtlecoin-mobile-wallet/issues';

    /**
     * This only controls the name in the settings screen.
     */
    this.appName = 'PLURA';

    /**
     * Slogan phrase during wallet CreateScreen
     */
    this.sloganCreateScreen = 'Crypto e-Commerce Payment Solution';

    /**
     * Displayed in the settings screen
     */
    this.appVersion = 'v.0.1';

    /**
     * Base URL for us to chuck a hash on the end, and find a transaction
     */
    //this.explorerBaseURL = 'https://explorer.turtlecoin.lol/?search=';
    this.explorerBaseURL = 'https://explorer.pluracoin.org';

    /**
     * A link to your app on the Apple app store. Currently blank because we
     * haven't released for iOS yet...
     */
    this.appStoreLink = '';

    /**
     * A link to your app on the google play store
     */
    this.googlePlayLink = 'https://play.google.com/store/apps/details?id=com.plura';

    /**
     * A url to fetch node info from. Should follow the turtlepay format
     * detailed here: https://docs.turtlepay.io/blockapi/
     */
    //this.nodeListURL = 'https://blockapi.turtlepay.io/node/list/available';
    this.nodeListURL = 'https://pluracoin.org/nodes.txt';
};

module.exports = Config;
