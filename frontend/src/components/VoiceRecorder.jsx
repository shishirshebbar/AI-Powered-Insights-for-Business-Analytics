import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import api from "../services/api";
import LoadingSpinner from "./LoadingSpinner";

const VoiceRecorder = ({ onQueryComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError("Your browser does not support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  const handleStart = () => {
    resetTranscript();
    setError(null);
    SpeechRecognition.startListening({ continuous: true, interimResults: true });
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
  };

  const handleReset = () => {
    resetTranscript();
    setError(null);
  };

  const handleSubmit = async () => {
    if (!transcript.trim()) {
      setError("Please record a valid voice query.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sqlGenResponse = await api.post("/generate_sql/", {
        prompt: transcript,
      });

      const sqlQuery = sqlGenResponse.data?.sql_query?.trim();
      console.log("Generated SQL:", sqlQuery);

      if (!sqlQuery) {
        setError("No SQL query generated from your speech.");
        return;
      }

      const queryRes = await api.post("/run_query/", {
        prompt: sqlQuery,
      });

      const results = queryRes.data.results;

      if (onQueryComplete) {
        onQueryComplete({ sql: sqlQuery, data: results });
      }
    } catch (err) {
      console.error("VoiceRecorder error:", err);
      if (err.response?.data?.detail) {
        setError(`❌ Backend Error: ${err.response.data.detail}`);
      } else {
        setError("❌ Failed to process voice query. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <p className="text-red-500">Speech recognition not supported in this browser.</p>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">🎤 Voice to SQL</h2>

      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={handleStart}
          className={`px-4 py-2 rounded ${listening ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
          disabled={listening}
        >
          Start Recording
        </button>
        <button
          onClick={handleStop}
          className={`px-4 py-2 rounded ${!listening ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
          disabled={!listening}
        >
          Stop
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          Reset
        </button>
        <button
          onClick={handleSubmit}
          className={`px-4 py-2 rounded disabled:opacity-50 ${loading || !transcript ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          disabled={loading || !transcript}
        >
          {loading ? <LoadingSpinner /> : "Run Query"}
        </button>
      </div>

      {listening && <p className="text-green-600 animate-pulse mb-2">● Listening...</p>}

      <p className="text-gray-700 min-h-[2rem] mb-2">
        <strong>Recognized:</strong>{" "}
        {transcript ? transcript : <em>Say something…</em>}
      </p>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default VoiceRecorder;
