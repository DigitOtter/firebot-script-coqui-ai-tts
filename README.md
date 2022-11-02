# CoquiAI Text-to-Speech Script for Firebot

## Overview
Firebot extension to integrate a custom CoquiAI TTS server. Can be used to run a

The extension requires a separate running CoquiAI server, either locally or on a remote machine. 

## Installation
- Download `coquiAiTts.js` file from [Releases](https://github.com/DigitOtter/firebot-script-coqui-ai-tts/releases)
- Add `coquiAiTts.js` as a startup script in Firebot (Settings > Advanced > Startup Scripts) and enter the URL to your CoquiAI TTS server
- Start your CoquiAI server
- Restart Firebot

### Install and run your own CoquiAI TTS server

#### For Windows
- Download `coqui-tts-server-gui-win.zip` from [Releases](https://github.com/DigitOtter/firebot-script-coqui-ai-tts/releases)
- Extract the included `coqui-tts-server-gui.exe`
- To start the server, launch `coqui-tts-server-gui.exe`. The included GUI automatically starts the TTS server at `http://localhost:5002`

#### For Linux
- Follow the README instructions under https://github.com/DigitOtter/coqui-tts-server-gui.git to install the CoquiAI server
- Launch the server via `coqui-tts-server-gui`
