// Copyright (C) 2019, Zpalmtree
//
// Please see the included LICENSE file for more information.

import * as Sentry from '@sentry/react-native';

import * as _ from 'lodash';

import Config from './Config';

/* Manually comparing to TurtleCoin to try and prevent getting errors reported
   for forks... */
/* DO NOT CHANGE THIS LINE WITHOUT ALSO ALTERING THE Sentry.config() LINE - See readme and sentry docs. */
const sentryIsEnabled = !__DEV__ && Config.coinName === 'TurtleCoin';

export function reportCaughtException(err) {
    /* Sentry doesn't properly report arbitary objects. Convert to string if
       it ain't a string or an error. */
    if (!_.isString(err) && !(err instanceof Error)) {
        err = JSON.stringify(err, null, 4);
    }

    if (sentryIsEnabled) {
        try {
            Sentry.captureException(err);
        } catch (e) {
        }
    }
}

export function initSentry() {
    if (sentryIsEnabled) {
        /* CHANGE THIS IF YOU ARE FORKING! */
        Sentry.init({ 
          dsn: 'https://c13da65f903249008565b00d683bc707@o726723.ingest.sentry.io/578270',
        });

        Sentry.setRelease('com.plura-' + Config.appVersion);
    }
}
