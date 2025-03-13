import { TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";
import { AWS_REGION } from "../config";

export class Transcriber {
  transcribeClient: TranscribeStreamingClient;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;

  constructor({
    accessKeyId,
    secretAccessKey,
    sessionToken,
  }: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
  }) {
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.sessionToken = sessionToken;
    this.transcribeClient = new TranscribeStreamingClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
        sessionToken: this.sessionToken,
      },
    });
  }
}
