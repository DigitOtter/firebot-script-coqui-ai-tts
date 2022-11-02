import { Firebot } from "firebot-custom-scripts-types";
import { getDefaultSettings } from "http2";
import { buildCoquiAiTtsEffectType } from "./coquiai-tts-effect";
import { initLogger } from "./logger";

interface Params {
  coquiAiTtsServer: string
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "CoquiAI TTS Effect",
      description: "Adds the CoquiAI TTS effect",
      author: "DigitOtter",
      version: "1.2",
      firebotVersion: "5",
      startupOnly: true,
    };
  },
  getDefaultParameters: () => {
    return {
      coquiAiTtsServer: {
        type: "string",
        description: "CoquiAI TTS Server (Restart Firebot After Setting)",
        secondaryDescription: "Set the CoquiAI server address",
        default: "http://localhost:5002"
      }
    };
  },
  run: (runRequest) => {
    const { effectManager, frontendCommunicator, logger } = runRequest.modules;
    const fs = (runRequest.modules as any).fs;
    const path = (runRequest.modules as any).path;
    initLogger(logger);
    effectManager.registerEffect(
      buildCoquiAiTtsEffectType(frontendCommunicator, fs, path, runRequest.parameters.coquiAiTtsServer)
    );
  },
};

export default script;
