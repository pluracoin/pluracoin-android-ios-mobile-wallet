adb reverse tcp:19201 tcp:19201
#adb reverse tcp:81 tcp:80
#adb reverse tcp:443 tcp:443
node --max-old-space-size=8192 node_modules/react-native/local-cli/cli.js start
