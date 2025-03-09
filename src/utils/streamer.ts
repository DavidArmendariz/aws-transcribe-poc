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
  fullTranscript: string;

  constructor() {
    this.language = LanguageCode.ES_ES;
    this.transcriber = new Transcriber();
    this.recorder = undefined;
    this.fullTranscript = "";
    this.callback = (transcript: string) => {
      console.log(transcript);
    };
    console.log("Streamer initialized");
  }

  setCallback(callback: (transcript: string) => void) {
    this.callback = callback;
  }

  async startStreaming() {
    this.recorder = new Recorder();
    await this.recorder.setMicrophoneStream();
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
          if (results && results.length) {
            const alternatives = results[0].Alternatives;
            if (alternatives && alternatives[0]) {
              const transcript = alternatives[0].Transcript;
              // Display both partial and final results
              this.callback(this.fullTranscript + transcript);
              // Only append final results (not partial)
              if (!results[0].IsPartial) {
                this.fullTranscript += transcript + " ";
              }
            }
          }
        }
      }
    }
  }

  clearTranscript() {
    this.fullTranscript = "";
    this.callback(this.fullTranscript);
  }

  stopRecording() {
    if (this.recorder) {
      this.recorder.microphoneStream.stop();
      this.recorder.microphoneStream.destroy();
      this.recorder = undefined;
    }
  }

  async startRecording() {
    if (this.recorder) {
      this.stopRecording();
    }
    await this.startStreaming();
  }
}
