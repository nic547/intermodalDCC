# intermodalDCC

[Repo/Issues (Codeberg)](https://codeberg.org/nic547/intermodalDCC) | [Mirror (GitHub)](https://github.com/nic547/intermodalDCC) | [Web App](intermodaldcc.nic547.ch) | [Web App (Development)](preview.intermodaldcc.nic547.ch)

<img src="res/DesktopScreenshot.png" alt="Screenshot of the Web application on a desktop device" width="80%">
<img src="res/MobileScreenshot.png" alt="Screenshot of the Web application on a mobile device" width="50%">

intermodalDCC is an experimental project for a DCC command station to combine cheap and widely available Bluetooth enabled microcontroller boards with a WebBluetooth based web application.

It's not intended to be a one-size-fits-all solution, rather focusing on the Bluetooth aspect.
Support for DC via Zero-Stretching, RailCom, s88 feedback and many other features are not planned.
If you need a more complete solution or one that doesn't rely on Bluetooth, I can wholeheartedly recommend the [DCC-EX (Website)](https://dcc-ex.com/) | [(GitHub)](https://github.com/DCC-EX/CommandStation-EX) project.

## Supported Hardware

### Microcontroller Boards

- Arduino Uno R4 WiFi

### H-Bridge

- Arduino Motor Shield Rev3 (or similar clones)

### Client Devices

Unfortunately the WebBluetooth API is only supported in chromium based browsers like Chrome, Edge, Brave and others, but should work across Windows, macOS, Linux and Android.

## Plans

Initial plans:

- Support for controlling locomotives (speed 128 steps and 68 functions)
- Support for basic accessory decoders (turnouts and signals)
- Support for reading and writing CVs on a programming track
- Support for Arduino BLE platforms (mostly the Uno WiFi R4 and the Arduino Connect RP2040)
- Basic WebApp for controlling the command station

Further plans:

- Support for 28 and 14 speed steps
- Support for PoM (Programming on Main)
- Support for "joint" operations (combining the main and programming track)
- Support for the Raspberry Pi Pico and/or ESP32 platforms
- Apps for controlling the command station (probably via Tauri or similar)
- Support for extended accessory decoders
- etc ...
