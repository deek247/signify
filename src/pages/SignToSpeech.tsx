import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Upload, Video, Volume2 } from "lucide-react";
const sample = "Thank you";
export function SignToSpeech() {
  const [camera, setCamera] = useState(false),
    [cameraReady, setCameraReady] = useState(false);
  const [upload, setUpload] = useState<{ url: string; name: string } | null>(
    null,
  );
  const [result, setResult] = useState(false),
    [error, setError] = useState("");
  const speechVersion = useRef(0);
  useEffect(
    () => () => {
      speechVersion.current++;
      window.speechSynthesis?.cancel();
    },
    [],
  );
  useEffect(
    () => () => {
      if (upload) URL.revokeObjectURL(upload.url);
    },
    [upload],
  );
  function reset() {
    speechVersion.current++;
    window.speechSynthesis?.cancel();
    setResult(false);
    setError("");
  }
  function speak() {
    const version = ++speechVersion.current;
    if (!("speechSynthesis" in window)) {
      setError(
        "The sample is ready, but speech playback is unavailable in this browser.",
      );
      return;
    }
    window.speechSynthesis.cancel();
    setError("");
    const utterance = new SpeechSynthesisUtterance(sample);
    utterance.lang = "en-US";
    utterance.onerror = (event) => {
      if (
        version === speechVersion.current &&
        !["canceled", "interrupted"].includes(event.error)
      )
        setError(
          "Speech playback failed. Use Play sample speech to try again.",
        );
    };
    window.speechSynthesis.speak(utterance);
  }
  return (
    <>
      <div className="demo-banner">
        <strong>Demo mode — fixed sample output</strong>
        <p>
          This simulation always displays and speaks “Thank you.” It does not
          analyze or recognize signs in your camera or video.
        </p>
      </div>
      <div className="workspace-grid">
        <section className="panel utility-panel">
          <h2>Video input</h2>
          <p>
            Upload a video or turn on your camera to try the simulated flow.
          </p>
          <div className="camera-stage">
            {camera ? (
              <Webcam
                audio={false}
                onUserMedia={() => setCameraReady(true)}
                onUserMediaError={() => {
                  setCamera(false);
                  setCameraReady(false);
                  setError(
                    "Camera unavailable. Check permissions or upload a video instead.",
                  );
                }}
                videoConstraints={{ facingMode: "user" }}
              />
            ) : upload ? (
              <video
                src={upload.url}
                controls
                muted
                playsInline
                aria-label="Uploaded video preview"
                onError={() =>
                  setError(
                    "This video cannot be previewed in your browser. The fixed sample demo is still available.",
                  )
                }
              />
            ) : (
              <Video size={42} aria-label="No video selected" />
            )}
          </div>
          <div className="video-input-actions">
            <button
              className="primary-button"
              onClick={() => {
                reset();
                setUpload(null);
                setCameraReady(false);
                setCamera(!camera);
              }}
            >
              {camera ? "Turn camera off" : "Turn camera on"}
            </button>
            <label className="upload-button">
              <Upload size={18} />
              Upload video
              <input
                type="file"
                accept="video/*"
                aria-label="Upload video"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  if (
                    !file.type.startsWith("video/") &&
                    !/\.(mp4|webm|mov|ogv|ogg|m4v)$/i.test(file.name)
                  ) {
                    setError("Please select a video file.");
                    return;
                  }
                  reset();
                  setCamera(false);
                  setCameraReady(false);
                  setUpload({
                    url: URL.createObjectURL(file),
                    name: file.name,
                  });
                }}
              />
            </label>
          </div>
          {upload && <p className="upload-name">Selected: {upload.name}</p>}
          {camera && !cameraReady && (
            <p role="status">Waiting for camera permission…</p>
          )}
          <button
            className="primary-button convert-button"
            disabled={!upload && !cameraReady}
            onClick={() => {
              setResult(true);
              speak();
            }}
          >
            Convert video — simulated demo
          </button>
        </section>
        <section className="panel utility-panel">
          <h2>Demo output</h2>
          <span className="pill">Fixed sample · no recognition</span>
          {result ? (
            <>
              <p className="sample-result" role="status">
                {sample}
              </p>
              <button className="primary-button" onClick={speak}>
                <Volume2 size={18} />
                Play sample speech
              </button>
              <button
                className="text-button"
                onClick={() => {
                  speechVersion.current++;
                  window.speechSynthesis?.cancel();
                }}
              >
                Stop speech
              </button>
            </>
          ) : (
            <p className="empty-result">
              Choose a video input, then press the conversion button to display
              and speak the fixed sample.
            </p>
          )}
          {error && (
            <p role="alert" className="inline-error">
              {error}
            </p>
          )}
        </section>
      </div>
    </>
  );
}
