import { useState } from "react";
import { Streamer } from "./utils/streamer";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config";

const streamer = new Streamer();
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");
  const [entity, setEntity] = useState("");
  const [isIdentifying, setIsIdentifying] = useState(false);

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
    setTranscriptText("");
    setEntity("");
  };

  const handleIdentifyEntity = async () => {
    setIsIdentifying(true);
    try {
      const data = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente médico. Tu tarea es identificar el motivo de la consulta del paciente",
          },
          {
            role: "user",
            content: `Identifica el motivo de la consulta del paciente usando esta transcripción: ${transcriptText}`,
          },
        ],
        store: true,
      });

      if (data.choices && data.choices.length > 0) {
        const entity = data.choices[0].message.content?.trim();
        if (entity) {
          setEntity(entity);
        }
      }
    } catch (error) {
      console.error("Error identifying entity:", error);
      setEntity("Error al identificar el motivo de la consulta");
    } finally {
      setIsIdentifying(false);
    }
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

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleIdentifyEntity}
          disabled={isRecording || !transcriptText || isIdentifying}
          className={`px-4 py-2 rounded-md flex items-center justify-center min-w-[220px] ${
            isRecording || !transcriptText || isIdentifying
              ? "bg-gray-400 text-gray-700 cursor-not-allowed border-gray-400 pointer-events-none"
              : "bg-purple-500 hover:bg-purple-600 text-white"
          }`}
        >
          {isIdentifying ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Identificando...
            </>
          ) : (
            "Identificar motivo de la consulta"
          )}
        </button>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="El motivo de la consulta aparecerá aquí..."
          value={entity}
          readOnly
        />
      </div>
    </div>
  );
};

export default App;
