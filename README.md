# mqtt-dyson-client

[![Angular 12](https://img.shields.io/badge/Angular-12-dd0031?logo=angular)](https://angular.io)
[![MQTT](https://img.shields.io/badge/protocol-MQTT-660066?logo=mqtt)](https://mqtt.org)
[![Mosquitto](https://img.shields.io/badge/broker-Mosquitto-3C5280?logo=eclipsemosquitto)](https://mosquitto.org)

Control a **Dyson Pure Cool** fan from your browser over your local network — no Dyson
app, no cloud, no backend server. The fan already speaks MQTT; this project talks to it
directly and adds a small dashboard with live air-quality charts.

## Features

- 🎛️ **Full control** — power, oscillation, auto mode, airflow direction and fan speed (1–10).
- 📈 **Live sensor chart** — temperature, humidity, NO₂ and VOC levels (last 20 readings).
- 🔄 **Stays in sync** — the fan's state is re-read every 10 seconds, so changes made with the remote or the Dyson app show up too.
- 🏠 **100% local** — everything stays on your LAN.

## How it works

Dyson fans run their own MQTT broker on port `1883`. Browsers can't open raw TCP
connections, so a local [Mosquitto](https://mosquitto.org) instance exposes a WebSocket
listener and **bridges** it to the fan:

```
┌──────────────┐  MQTT over WebSockets  ┌───────────────┐  MQTT bridge  ┌────────────┐
│ Angular app  │ ─────── :9001 ───────▶ │   Mosquitto   │ ──── :1883 ─▶ │ Dyson fan  │
│ (Paho MQTT)  │ ◀───────────────────── │ (your PC/RPi) │ ◀──────────── │  (broker)  │
└──────────────┘                        └───────────────┘               └────────────┘
```

The app publishes `STATE-SET` commands to `438/<serial>/command` and listens to
`438/<serial>/status/current` for state and sensor updates.

## Getting started

### 1. Get your fan's credentials

You need the fan's **local IP**, its **serial** (used as the MQTT username) and its **MQTT
password**. One way to get them is to capture the traffic between the Dyson app and the fan:

1. Make sure the fan is set up in the Dyson app on your phone.
2. Start a packet capture on the phone (e.g. tPacketCapture on Android).
3. Send any command to the fan from the app (turn it on, change speed…) and stop the capture right away to keep it small.
4. Open the capture in [Wireshark](https://www.wireshark.org) and filter by the fan's IP (you can find it in your router).
   The MQTT `CONNECT` packet contains the username and password, and the published messages show the payload format.

Background reading: [this (Japanese) write-up](https://aakira.hatenablog.com/entry/2016/08/12/012654)
on Dyson's MQTT protocol, and the field reference in
[iobroker.dysonairpurifier](https://www.npmjs.com/package/iobroker.dysonairpurifier).

> ⚠️ Keep these credentials private: anyone on your network who has them can control the fan.

### 2. Run the broker

```bash
cp src/app/constants/broker.conf.example src/app/constants/broker.conf
# edit broker.conf: fan IP, serial and password
mosquitto -c src/app/constants/broker.conf
```

`broker.conf` is git-ignored so your credentials never end up in the repo.

### 3. Run the app

Set your serial in [`src/app/constants/mqtt.config.ts`](src/app/constants/mqtt.config.ts):

```ts
export const USERNAME = 'YOUR-DEVICE-SERIAL';
```

Then:

```bash
npm install
npm start          # http://localhost:4200
```

The app connects to the broker at `127.0.0.1:9001` and retries every second until it's up.

## Other Dyson models

The topics and payloads are written for the **Pure Cool** tower (product type `438`).
Other models use a different product type and may expect different fields: change the
`438` prefix in `mqtt.config.ts` and adapt the payloads in
[`parser.service.ts`](src/app/services/parser.service.ts) to what your device sends.

## Tech stack

Angular 12 · Angular Material · Bootstrap 5 · Apache ECharts · Paho MQTT · Mosquitto

## Disclaimer

Unofficial project, not affiliated with or endorsed by Dyson. Dyson is a trademark of Dyson Technology Limited.
