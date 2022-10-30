import axios from "axios";
import { EffectModel } from "./types";

interface SynthesizeTextResponse {
  audioContent: string;
}

export async function getTTSAudioContent(effect: EffectModel, googleCloudAPIKey: string): Promise<string | null> {
  const url = `http://localhost:5002/api/tts?speaker_id=p376&style_wav=&text=` + effect.text;

  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'audio/wav'
    }
  });

  return response.data;
}
