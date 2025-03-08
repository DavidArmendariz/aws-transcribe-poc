import MicrophoneStream from "microphone-stream";

import { Buffer } from "buffer";
import { SAMPLE_RATE } from "../constants";

export class Recorder {
  microphoneStream: MicrophoneStream;

  constructor() {
    this.microphoneStream = new MicrophoneStream();
  }

  async setMicrophoneStream() {
    this.microphoneStream.setStream(
      await window.navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      })
    );
  }

  encodePCMChunk(chunk: Buffer) {
    const input = MicrophoneStream.toRaw(chunk);
    let offset = 0;
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return Buffer.from(buffer);
  }

  async *getAudioStream() {
    for await (const chunk of this.microphoneStream) {
      if (chunk.length <= SAMPLE_RATE) {
        yield {
          AudioEvent: {
            AudioChunk: this.encodePCMChunk(chunk),
          },
        };
      }
    }
  }
}
