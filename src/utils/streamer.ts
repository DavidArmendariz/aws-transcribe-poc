import {
  LanguageCode,
  StartStreamTranscriptionCommand,
} from "@aws-sdk/client-transcribe-streaming";
import { SAMPLE_RATE } from "../constants";
import { Recorder } from "./recorder";
import { Transcriber } from "./transcriber";

export class Streamer {
  recorder: Recorder | undefined;
  transcriber: Transcriber;
  language: LanguageCode;
  callback: (transcript: string) => void;

  constructor() {
    this.language = LanguageCode.ES_ES;
    this.transcriber = new Transcriber();
    this.callback = () => {};
  }

  async startStreaming() {
    this.recorder = new Recorder();
    const command = new StartStreamTranscriptionCommand({
      LanguageCode: this.language,
      MediaEncoding: "pcm",
      MediaSampleRateHertz: SAMPLE_RATE,
      AudioStream: this.recorder.getAudioStream(),
    });
    const data = await this.transcriber.transcribeClient.send(command);
    if (data.TranscriptResultStream) {
      for await (const event of data.TranscriptResultStream) {
        if (event.TranscriptEvent?.Transcript) {
          const results = event.TranscriptEvent.Transcript.Results;
          if (results) {
            if (results.length && !results[0]?.IsPartial) {
              const alternatives = results[0].Alternatives;
              if (alternatives && alternatives[0]) {
                const transcript = alternatives[0].Transcript;
                console.log(transcript);
                this.callback(transcript + " ");
              }
            }
          }
        }
      }
    }
  }

  stopRecording() {
    if (this.recorder) {
      this.recorder.microphoneStream.stop();
      this.recorder.microphoneStream.destroy();
      this.recorder = undefined;
    }
  }

  async startRecording() {
    if (this.recorder || this.transcriber) {
      this.stopRecording();
    }
    await this.startStreaming();
  }
}
