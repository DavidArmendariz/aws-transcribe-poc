import { TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
} from "../config";

export class Transcriber {
  transcribeClient: TranscribeStreamingClient;

  constructor() {
    this.transcribeClient = new TranscribeStreamingClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });
  }
}
