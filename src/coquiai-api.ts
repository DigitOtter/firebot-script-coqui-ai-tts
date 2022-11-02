import axios from "axios";
import { EffectModel } from "./types";

export async function getTTSAudioContent(effect: EffectModel, coquiAiTtsServer: string): Promise<string | null> {
  var url: string = coquiAiTtsServer + '/api/tts?style_wav=&text=' + effect.text;
  if(effect.speakerId && effect.speakerId.length > 0) {
    url += '&speaker_id=' + effect.speakerId;
  }

  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'audio/wav'
    }
  });

  return response.data;
}
