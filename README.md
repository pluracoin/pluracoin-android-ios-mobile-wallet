Mobile, native PluraCoin wallet

![Screenshot](https://pluracoin.org/images/plura_mobile_wallet.jpg)

### Initial Setup

* `cd PluraWallet`
* `yarn install`

### Running

* `node --max-old-space-size=8192 node_modules/react-native/local-cli/cli.js start` (Just need to run this once to start the server, leave it running)
* `react-native run-android`

### Logging

`react-native log-android`

### Creating a release

You need to bump the version number in:

* `src/Config.js` - `appVersion`
* `android/app/build.gradle` - `versionCode` and `versionName`
* `package.json` - `version` - Not strictly required
* Update user agent in `android/app/src/main/java/com/plura/MainApplication.java` and `android/app/src/main/java/com/plura/PluraCoinModule.java`

Then either run `yarn deploy-android`, or:

`cd android`

#### Create an AAB
`./gradlew bundleRelease`

#### Create an APK
`./gradlew assembleRelease`

#### Deploy to device
`./gradlew installRelease`

### Integrating QR Codes or URIs

PluraCoin mobile wallet supports two kinds of QR codes.

* Standard addresses / integrated addresses - This is simply the address encoded as a QR code.

* pluracoin:// URI encoded as a QR code.

Your uri must begin with `pluracoin://` followed by the address to send to, for example, `pluracoin://Pv7gU9dRVKFg8y1Y3YBLzQJm3owZwhfr8aTS3JaZsJBPa6sZzzDeSE8SHiKsta4MYQWpEg8ok27ufUmoaSKu9L5c2WAgwj5G9`

There are a few optional parameters.

* `name` - This is used to add you to the users address book, and identify you on the 'Confirm' screen. A name can contain spaces, and should be URI encoded.
* `amount` - This is the amount to send you. This should be specified in atomic units.
* `paymentid` - If not using integrated address, you can specify a payment ID. Specifying an integrated address and a payment ID is illegal.

An example of a URI containing all of the above parameters:

```
pluracoin://Pv7gU9dRVKFg8y1Y3YBLzQJm3owZwhfr8aTS3JaZsJBPa6sZzzDeSE8SHiKsta4MYQWpEg8ok27ufUmoaSKu9L5c2WAgwj5G9?amount=2100000000000&name=Starbucks%20Coffee&paymentid=f13adc8ac78eb22ffcee3f82e0e9ffb251dc7dc0600ef599087a89b623ca1402
```

This would send `210 PLURA` (12700000000000 in atomic units) to the address `Pv7gU9dRVKFg8y1Y3YBLzQJm3owZwhfr8aTS3JaZsJBPa6sZzzDeSE8SHiKsta4MYQWpEg8ok27ufUmoaSKu9L5c2WAgwj5G9`, using the name `Starbucks Coffee` (Note the URI encoding), and using a payment ID of `f13adc8ac78eb22ffcee3f82e0e9ffb251dc7dc0600ef599087a89b623ca1402`

You can also just display the URI as a hyperlink. If a user clicks the link, it will open the app, and jump to the confirm screen, just as a QR code would function. (Provided all the fields are given)

### Developing

* Trigger a background sync to fire: `adb shell cmd jobscheduler run -f com.plura 999`
