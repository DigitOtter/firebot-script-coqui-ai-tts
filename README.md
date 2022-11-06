# CoquiAI Text-to-Speech Script for Firebot

Use Coqui-AI's Text-to-Speech service in Firebot on stream. Code modified from https://github.com/heyaapl/firebot-script-google-cloud-tts

## Overview
Firebot extension to integrate a custom CoquiAI TTS server. CoquiAI offers multiple open source TTS models and hundreds of different voices that you can run on your local machine for free.

The extension requires a separate running CoquiAI server, either locally or on a remote machine. 

![Coqui AI TTS Effect](/images/firebot-script-coqui-ai-tts-example.png "Coqui AI TTS Effect")

## Installation
- Download `coquiAiTts.js` file from [Releases](https://github.com/DigitOtter/firebot-script-coqui-ai-tts/releases)
- Add `coquiAiTts.js` as a startup script in Firebot (Settings > Advanced > Startup Scripts) and enter the URL to your CoquiAI TTS server
- Start your CoquiAI server as described below
- Restart Firebot

### Install and run your own CoquiAI TTS server

#### For Windows
- Download `coqui-tts-server-gui.exe` from [Releases](https://github.com/DigitOtter/firebot-script-coqui-ai-tts/releases)
- To start the server, launch `coqui-tts-server-gui.exe`. The included GUI automatically starts the TTS server at `http://localhost:5002`

#### For Linux
- Follow the README instructions under https://github.com/DigitOtter/coqui-tts-server-gui.git to install the CoquiAI server
- Launch the server via `coqui-tts-server-gui`

## Configuration
- Start `coqui-tts-server-gui` before launching Firebot and have it running in the background (ensure that server icon is visible in taskbar)
- After adding `coquiAiTts.js` for the first time, set the address of your CoquiAI server instance (usually `http://localhost:5002`)
- After setting the url, restart Firebot
- Now you can configure your own TTS effects

#### Notes: 
- Whenever using the TTS effects with Firebot, ensure that the CoquiAI server is running in the background
- WARNING: Should you decide to change the TTS model used by `coqui-tts-server-gui`, the Firebot effects may no longer play! Each TTS model uses their own voices, and most of the voice names are incompatible with other models. I recommend either using the default provided by `coqui-tts-server-gui` or play around with the models before deciding which one to use permanently.
