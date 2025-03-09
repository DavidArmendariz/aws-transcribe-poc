import { useState } from "react";
import { Streamer } from "./utils/streamer";

const streamer = new Streamer();

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");

  const handleStartRecording = () => {
    setIsRecording(true);
    streamer.setCallback(setTranscriptText);
    streamer.startRecording();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    streamer.stopRecording();
  };

  const handleClearTranscript = () => {
    streamer.clearTranscript();
  };

  return (
    <div className="flex flex-col p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">DeltaWits Transcriber</h2>

      <div className="flex gap-4 mb-4">
        <button
          onClick={handleStartRecording}
          disabled={isRecording}
          className={`px-4 py-2 rounded-md ${
            isRecording
              ? "bg-gray-400 text-gray-700 cursor-not-allowed border-gray-400 pointer-events-none"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          Comenzar grabación
        </button>

        <button
          onClick={handleStopRecording}
          disabled={!isRecording}
          className={`px-4 py-2 rounded-md ${
            !isRecording
              ? "bg-gray-400 text-gray-700 cursor-not-allowed border-gray-400 pointer-events-none"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          Parar grabación
        </button>

        <button
          onClick={handleClearTranscript}
          disabled={isRecording}
          className={`px-4 py-2 rounded-md ${
            isRecording
              ? "bg-gray-400 text-gray-700 cursor-not-allowed border-gray-400 pointer-events-none"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Limpiar texto
        </button>
      </div>

      <div className="relative">
        {isRecording && (
          <div className="absolute top-2 right-2">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
        )}
        <textarea
          className="w-full h-40 p-3 border border-gray-300 rounded-md"
          placeholder="El transcript aparecerá aquí..."
          value={transcriptText}
          readOnly
        ></textarea>
      </div>

      <div className="mt-2 text-sm text-gray-500">
        {isRecording ? "Grabación en proceso" : "Listo para grabar"}
      </div>
    </div>
  );
};

export default App;
