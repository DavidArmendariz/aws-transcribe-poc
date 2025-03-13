import { TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";
import { AWS_REGION } from "../config";

export class Transcriber {
  transcribeClient: TranscribeStreamingClient;
  accessKeyId: string;
  secretAccessKey: string;

  constructor({
    accessKeyId,
    secretAccessKey,
  }: {
    accessKeyId: string;
    secretAccessKey: string;
  }) {
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.transcribeClient = new TranscribeStreamingClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
  }
}
