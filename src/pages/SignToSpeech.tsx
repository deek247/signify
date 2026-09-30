import { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Video, Volume2 } from "lucide-react";
export function SignToSpeech() {
  const [camera, setCamera] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  function speak() {
    if (!("speechSynthesis" in window)) {
      setError("Speech playback is unavailable in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onerror = () =>
      setError("Speech playback failed. Please try again.");
    window.speechSynthesis.speak(utterance);
  }
  return (
    <div className="workspace-grid">
      <section className="panel utility-panel">
        <h2>Camera preview</h2>
        <p>
          Practice framing your hands and upper body. Sign recognition is not
          connected; the camera does not generate text.
        </p>
        <div className="camera-stage">
          {camera ? (
            <Webcam
              audio={false}
              onUserMediaError={() => {
                setCamera(false);
                setError(
                  "Camera unavailable. Check browser permissions and try again.",
                );
              }}
              videoConstraints={{ facingMode: "user" }}
            />
          ) : (
            <Video size={42} aria-label="Camera off" />
          )}
        </div>
        <button
          className="primary-button"
          onClick={() => {
            setError("");
            setCamera(!camera);
          }}
        >
          {camera ? "Turn camera off" : "Turn camera on"}
        </button>
      </section>
      <section className="panel utility-panel">
        <h2>Text to speech</h2>
        <p>
          Read your own typed message aloud using your browser's voice. This is
          not sign recognition.
        </p>
        <label className="field-label" htmlFor="speech-text">
          Message to read aloud
        </label>
        <textarea
          id="speech-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
        />
        <button
          className="primary-button"
          disabled={!text.trim()}
          onClick={speak}
        >
          <Volume2 size={18} />
          Read aloud
        </button>
        <button
          className="text-button"
          onClick={() => window.speechSynthesis?.cancel()}
        >
          Stop speech
        </button>
        {error && (
          <p role="alert" className="inline-error">
            {error}
          </p>
        )}
      </section>
    </div>
  );
}
