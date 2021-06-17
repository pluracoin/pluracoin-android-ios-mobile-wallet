// Copyright (C) 2018, Zpalmtree
//
// Please see the included LICENSE file for more information.

import React from 'react';
import { StyleSheet } from "react-native";

import LinearGradient from 'react-native-linear-gradient';

import {
    View, Text, Button, Image, TouchableOpacity
} from 'react-native';

import { WalletBackend } from 'turtlecoin-wallet-backend';

import Config from './Config';

import { Styles } from './Styles';
import { Globals } from './Globals';
import { saveToDatabase } from './Database';
import { updateCoinPrice } from './Currency';
import { navigateWithDisabledBack } from './Utilities';
import { BottomButton, SeedComponent } from './SharedComponents';

/**
 * Create or import a wallet
 */
export class WalletOptionScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={{ flex: 1, justifyContent: 'flex-start'}}>

                <Image
                    style={Styles.background}
                    source={require('../assets/img/bg-create2.png')}
                />
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
                    <Image
                        source={this.props.screenProps.theme.logo}
                        style={Styles.logo}
                    />
                    <Text style={{
                        fontSize: 20,
                        color: this.props.screenProps.theme.slightlyMoreVisibleColour,
                    }}>
                        {Config.sloganCreateScreen}
                    </Text>
                </View>

                <View style={[Styles.buttonContainer, {alignItems: 'center', bottom: 100, position: 'absolute', alignItems: 'stretch', justifyContent: 'center', width: '100%'}]}>
                <Button
                    title='Create New Wallet'
                    onPress={() => this.props.navigation.navigate('Disclaimer', { nextRoute: 'CreateWallet' })}
                    color={this.props.screenProps.theme.primaryColour}
                    />
                </View>

                <View style={[Styles.buttonContainer, {bottom: 40, position: 'absolute', alignItems: 'stretch', justifyContent: 'center', width: '100%'}]}>
                    <Button
                        title='Recover Wallet'
                        /* Get the import data */
                        onPress={() => this.props.navigation.navigate('Disclaimer', { nextRoute: 'ImportWallet' })}
                        color={this.props.screenProps.theme.primaryColour}
                    />
                </View>

            </View>
        );
    }
}

/*<View style={[Styles.buttonContainer, {bottom: 100, position: 'absolute', alignItems: 'stretch', justifyContent: 'center', width: '70%'}]}>
    <TouchableOpacity style={Styles.gbutton}>
        <LinearGradient colors={['#43D4FF', '#38ABFD', '#2974FA']} style={Styles.gradient}
                        onPress={() => this.props.navigation.navigate('Disclaimer', { nextRoute: 'CreateWallet' })}>
            <Text style={Styles.gtext}>Gradient Button</Text>
        </LinearGradient>
    </TouchableOpacity>
</View>*/
/**
 * Create a new wallet
 */
export class CreateWalletScreen extends React.Component {
    static navigationOptions = {
        title: 'Create',
        header: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            seed: '',
        }
    };

    async componentDidMount() {
        Globals.wallet = await WalletBackend.createWallet(Globals.getDaemon(), Config);

        const [ seed ] = await Globals.wallet.getMnemonicSeed();

        this.setState({
            seed,
        });

        /* Save wallet in DB */
        saveToDatabase(Globals.wallet);
    }

    render() {
        return(
            <View style={{ flex: 1, justifyContent: 'flex-start' }}>

                <Image
                    style={Styles.background}
                    source={require('../assets/img/bg-create2.png')}
                />
                <View style={{
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 60,
                    marginLeft: 30,
                    marginRight: 10,
                }}>
                    <Text style={{ color: this.props.screenProps.theme.primaryColour, fontSize: 25, marginBottom: 40 }}>
                        Your wallet has been created!
                    </Text>

                    <Text style={{ fontSize: 15, marginBottom: 20, color: this.props.screenProps.theme.slightlyMoreVisibleColour }}>
                        Please save the following backup words somewhere safe.
                    </Text>

                    <Text style={{ fontWeight: 'bold', color: 'red', marginBottom: 20 }}>
                        Without this seed, if your phone gets lost, or your wallet gets corrupted,
                        you cannot restore your wallet, and your funds will be lost forever!
                    </Text>
                </View>

                <View style={{ alignItems: 'center', flex: 1, justifyContent: 'flex-start' }}>
                    {this.state.seed !== '' && <SeedComponent
                        seed={this.state.seed}
                        borderColour={'red'}
                        {...this.props}
                    />}

                    <BottomButton
                        title="Continue"
                        onPress={() => this.props.navigation.navigate('Home')}
                        {...this.props}
                    />
                </View>

            </View>
        );
    }
}
