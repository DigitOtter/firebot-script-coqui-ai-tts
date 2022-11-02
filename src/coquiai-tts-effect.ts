import { Firebot, ScriptModules } from "firebot-custom-scripts-types";
import { v4 as uuid } from "uuid";
import { getTTSAudioContent } from "./coquiai-api";
import { logger } from "./logger";
import { wait } from "./utils";
import { EffectModel } from "./types";
import { stringify } from "querystring";


export function buildCoquiAiTtsEffectType(
  frontendCommunicator: ScriptModules["frontendCommunicator"],
  fs: ScriptModules["fs"],
  path: ScriptModules["path"],
  coquiAiTtsServer: string
) {
  var coquiAiTtsEffectType: Firebot.EffectType<EffectModel> = {
    definition: {
      id: "digitotter:coquiai-tts",
      name: "CoquiAI Text-to-Speech",
      description: "TTS via CoquiAI server",
      icon: "fad fa-microphone-alt",
      categories: ["fun"],
      dependencies: [],
    },
    optionsTemplate: `
      <eos-container header="Text">
          <textarea ng-model="effect.text" class="form-control" name="text" placeholder="Enter text" rows="4" cols="40" replace-variables menu-position="under"></textarea>
      </eos-container>

      <eos-container header="Voice" pad-top="true">
        <ui-select ng-model="effect.speakerId" theme="bootstrap">
            <ui-select-match placeholder="Select or search for a voice...">{{$select.selected.name}}</ui-select-match>
            <ui-select-choices repeat="voice.name as voice in voices | filter: { language: $select.search }" style="position:relative;">
                <div ng-bind-html="voice.name | highlight: $select.search"></div>
                <small class="muted"><strong>{{voice.language}}</small>
            </ui-select-choices>
        </ui-select>
      </eos-container>
      <!--
      <eos-container header="Gender" pad-top="true">
            <dropdown-select options="{ MALE: 'Male', FEMALE: 'Female'}" selected="effect.voiceGender"></dropdown-select>
      </eos-container>
      -->
      <eos-container header="Pitch & Speed" pad-top="true">
        <div>Pitch</div>
        <rzslider rz-slider-model="effect.pitch" rz-slider-options="{floor: -20, ceil: 20, hideLimitLabels: true, showSelectionBar: true, step: 0.5, precision: 1}"></rzslider>
        <div>Speed</div>
        <rzslider rz-slider-model="effect.speakingRate" rz-slider-options="{floor: 0.25, ceil: 4, hideLimitLabels: true, showSelectionBar: true, step: 0.05, precision: 2}"></rzslider>
      </eos-container>

      <eos-container header="Volume" pad-top="true">
          <div class="volume-slider-wrapper">
              <i class="fal fa-volume-down volume-low"></i>
                <rzslider rz-slider-model="effect.volume" rz-slider-options="{floor: 1, ceil: 10, hideLimitLabels: true, showSelectionBar: true}"></rzslider>
              <i class="fal fa-volume-up volume-high"></i>
          </div>
      </eos-container>

      <!--<eos-container header="CoquiAI URL">
        <input type="text" ng-model="effect.url" size="10" maxlength="100" value="${coquiAiTtsServer}" class="form-control" menu-position="under" read-only></input>
      </eos-container>-->

      <eos-audio-output-device effect="effect" pad-top="true"></eos-audio-output-device>
    `,
    optionsController: ($scope) => {
      if ($scope.effect.volume == null) {
        $scope.effect.volume = 10;
      }
      $scope.voices = []as Array<{name:string;language:string}>;
  
      if ($scope.effect.voiceGender == null) {
        $scope.effect.voiceGender = "MALE";
      }
      if ($scope.effect.pitch == null) {
        $scope.effect.pitch = 0;
      }
      if ($scope.effect.speakingRate == null) {
        $scope.effect.speakingRate = 1;
      }
  
      fetch(coquiAiTtsServer + "/speaker_ids")
      .then(response => {
        if(response.ok) {
          try {
            return response.json();
          } catch (error) {
            return Object();
          }
        } 
        else {
          return Object();
        }
      })
      .then(data => {
        var ids = [];
        for(const key in data) {
          if(!key.includes("\n")) {
            ids.push({name: key, language: data[key]});
          }
        }
        $scope.voices = ids as Array<{name:string;language:string}>;
  
        if ($scope.effect.speakerId == null) {
          if(($scope.voices as Array<{name:string;language:string}>).length > 0) {
            $scope.effect.speakerId = ($scope.voices as any)[0].name;
          }
        }
  
        console.log($scope.effect);
      });
    },
    optionsValidator: (effect) => {
      const errors = [];
      if (effect.text == null || effect.text.length < 1) {
        errors.push("Please input some text.");
      }
      return errors;
    },
    onTriggerEvent: async (event) => {
      const effect = event.effect;

      try {
        //  synthesize text via CoquiAI tts
        const audioContent = await getTTSAudioContent(effect, coquiAiTtsServer);

        if (audioContent == null) {
          // call to CoquiAI tts api failed
          return true;
        }

        const filePath = path.join(process.cwd(), `tts${uuid()}.wav`);

        // save audio content to file
        await fs.writeFile(filePath, Buffer.from(audioContent, "base64"));

        // get the duration of this tts sound duration
        const soundDuration = await frontendCommunicator.fireEventAsync<number>(
          "getSoundDuration",
          {
            path: filePath,
            format: "wav",
          }
        );

        // play the TTS audio
        frontendCommunicator.send("playsound", {
          volume: effect.volume || 10,
          audioOutputDevice: effect.audioOutputDevice,
          format: "wav",
          filepath: filePath,
        });
        
        // wait for the sound to finish (plus 1.5 sec buffer)
        await wait((soundDuration + 1.5) * 1000);

        // remove the audio file
        await fs.unlink(filePath);
      } catch (error) {
        logger.error("CoquiAI TTS Effect failed", error);
      }

      // returning true tells the firebot effect system this effect has completed
      // and that it can continue to the next effect
      return true;
    },
  };

  // Hack to directly insert server URL (coquiAiTtsServer) directly into function. 
  // Required because optionsController is called from frontend where variable is not defined
  var str = coquiAiTtsEffectType.optionsController.toString();
  str = str.replace('coquiAiTtsServer', `"${coquiAiTtsServer}"`);
  coquiAiTtsEffectType.optionsController = eval(str);

  console.log(str);

  return coquiAiTtsEffectType;
}
