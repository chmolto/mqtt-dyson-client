## Control Dyson fans directly over mqtt without server or second party software 

You'll need to sniff device credentials using wireshark and setup a mosquitto broker.

### Miniguide:

To future me or whoever reads this, to sniff the credentials youll need to have the device you want connected to the dyson app on your phone, then youll need an app to record http requests (tPacketCapture), youll need to activate the http recording and send a command (like turn on, or whatever) to the device and then, stop recording asap to reduce the noise in your record. Then use the generated record file to find requests sent to your target device ip (use wireshark). You can get this ip directly from your router, or using some programs. In this request youll find username/password and the body that the device requires. If the device is a dyson pure cool, you just have to change user/pass in constants, setup a mosquitto broker and youre ready to rock :). If it is another device/model youll have to recreate the body the device expects to receive.

[Cool jap guide](https://aakira.hatenablog.com/entry/2016/08/12/012654)