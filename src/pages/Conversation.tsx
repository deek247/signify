import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Mic,
  StopCircle,
  Video,
  Info,
} from "lucide-react";
import { Playback } from "../components/Playback";
import {
  loadCatalog,
  resolveInput,
  type Catalog,
  type Plan,
} from "../signing/pipeline";
import { useSpeechInput } from "../hooks/useSpeechInput";
import { SignToSpeech } from "./SignToSpeech";
export function Conversation() {
  const [text, setText] = useState(""),
    [plan, setPlan] = useState<Plan | null>(null),
    [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState(""),
    [catalogError, setCatalogError] = useState(""),
    [unsupported, setUnsupported] = useState<string[]>([]);
  const [revision, setRevision] = useState(0),
    [attempt, setAttempt] = useState(0),
    [mode, setMode] = useState<Plan["mode"]>("phrases");
  const [tab, setTab] = useState<"sign" | "camera">("sign");
  useEffect(() => {
    const controller = new AbortController();
    setCatalogError("");
    setCatalog(null);
    const timeout = setTimeout(() => {
      controller.abort();
      setCatalogError("Signing catalog loading timed out. Retry to reconnect.");
    }, 15000);
    void loadCatalog(controller.signal)
      .then(setCatalog)
      .catch((e) => {
        if (!controller.signal.aborted)
          setCatalogError(
            e instanceof Error ? e.message : "Catalog failed to load.",
          );
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);
  function clearPlan(force = false) {
    if (plan || force) setRevision((v) => v + 1);
    setPlan(null);
    setError("");
    setUnsupported([]);
  }
  function submit(input: string) {
    setText(input);
    clearPlan(true);
    if (!catalog) {
      setError(
        "Signing catalog is not ready. Retry loading it before preparing input.",
      );
      return;
    }
    const result = resolveInput(input, catalog, mode);
    if (result.ok) setPlan(result.plan);
    else {
      setError(result.error);
      setUnsupported(result.unsupported);
    }
  }
  const speech = useSpeechInput(submit);
  return (
    <main id="main" className="workspace">
      <div className="conversation-title">
        <h1>Start a Conversation</h1>
        <p>
          Speak or type your message. Play it back through a signing avatar.
        </p>
      </div>
      <div className="workspace-toolbar">
        <div className="mode-tabs">
          <button
            aria-pressed={tab === "sign"}
            disabled={speech.listening}
            onClick={() => setTab("sign")}
          >
            <Mic size={18} />
            Speech to Sign <ArrowRight size={16} />
          </button>
          <button
            aria-pressed={tab === "camera"}
            disabled={speech.listening}
            onClick={() => {
              clearPlan();
              setTab("camera");
            }}
          >
            <ArrowLeft size={16} />
            Sign to Speech <Video size={18} />
            <span className="tiny-tag">Preview</span>
          </button>
        </div>
      </div>
      {tab === "sign" ? (
        <>
          <div className="workspace-grid">
            <section className="panel composer">
              <label className="field-label" htmlFor="sign-language">
                Select Sign Language
              </label>
              <select
                id="sign-language"
                disabled
                value={catalog?.language || ""}
              >
                <option value={catalog?.language || ""}>
                  {catalog?.language || "Awaiting target-language confirmation"}
                </option>
              </select>
              <div className="microphone-section">
                <button
                  className={`microphone-button ${speech.listening ? "recording" : ""}`}
                  disabled={!catalog || Boolean(catalogError)}
                  onClick={() => {
                    if (speech.listening) speech.stop();
                    else {
                      clearPlan();
                      speech.start();
                    }
                  }}
                  aria-label={
                    speech.listening ? "Stop listening" : "Start microphone"
                  }
                >
                  {speech.listening ? (
                    <StopCircle size={35} />
                  ) : (
                    <Mic size={35} />
                  )}
                </button>
                <div>
                  <h3>
                    {speech.listening ? "Listening…" : "Tap to Start Speaking"}
                  </h3>
                  <p>
                    {speech.listening
                      ? "Press stop when you are finished."
                      : "Or type below — both use the same signing pipeline."}
                  </p>
                </div>
              </div>
              <p className="mic-disclosure">
                English speech input. Your browser may send audio to its
                recognition service. Microphone access starts only when you
                press the button.
              </p>
              {speech.interim && (
                <p className="interim" role="status">
                  Hearing: {speech.interim}
                </p>
              )}
              {speech.error && (
                <p role="alert" className="inline-error">
                  {speech.error}
                </p>
              )}
              <div className="label-row">
                <label htmlFor="message" className="field-label">
                  Your message / transcript
                </label>
                <button
                  className="text-button"
                  disabled={speech.listening || !text}
                  onClick={() => {
                    setText("");
                    clearPlan();
                  }}
                >
                  Clear
                </button>
              </div>
              <textarea
                id="message"
                disabled={speech.listening}
                maxLength={500}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  clearPlan();
                }}
                placeholder="Type what you would like to sign…"
                aria-describedby="message-help"
              />
              <div className="input-meta" id="message-help">
                <span>You can edit the transcript before playback.</span>
                <span>{text.length}/500</span>
              </div>
              <label className="field-label output-label" htmlFor="sign-mode">
                Signing mode
              </label>
              <select
                id="sign-mode"
                value={mode}
                disabled={speech.listening}
                onChange={(e) => {
                  setMode(e.target.value as Plan["mode"]);
                  clearPlan();
                }}
              >
                <option value="phrases">Reviewed phrases</option>
                <option value="vocabulary">
                  Vocabulary practice — not sentence translation
                </option>
              </select>
              {catalogError && (
                <div className="inline-error" role="alert">
                  {catalogError}
                  <button
                    className="text-button"
                    onClick={() => setAttempt((v) => v + 1)}
                  >
                    Retry catalog
                  </button>
                </div>
              )}
              {error && (
                <div className="inline-error" role="alert">
                  <Info size={18} />
                  <div>
                    {error}
                    {unsupported.length > 0 && (
                      <p>Unsupported: {unsupported.join(", ")}</p>
                    )}
                  </div>
                </div>
              )}
              <button
                className="primary-button"
                disabled={!catalog || speech.listening}
                onClick={() => submit(text)}
              >
                Prepare signing <ArrowRight size={18} />
              </button>
              <p className="local-note">
                {catalog
                  ? `${catalog.signs.length} reviewed animations · ${catalog.phrases.length} supported phrases`
                  : "Loading signing catalog…"}
              </p>
            </section>
            <Playback key={revision} catalog={catalog} plan={plan} />
          </div>
          <section className="panel supported">
            <h2>Signing coverage</h2>
            {catalog?.phrases.length ? (
              <>
                <p>Select a reviewed phrase to prepare its sign sequence.</p>
                <div className="example-list">
                  {catalog.phrases.map((phrase) => (
                    <button
                      key={phrase.text}
                      disabled={speech.listening}
                      onClick={() => {
                        setMode("phrases");
                        setText(phrase.text);
                        clearPlan();
                        const result = resolveInput(
                          phrase.text,
                          catalog,
                          "phrases",
                        );
                        if (result.ok) setPlan(result.plan);
                      }}
                    >
                      {phrase.text}
                      <ArrowRight size={14} />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p>
                No validated signing animations are included in this checkout. A
                language-specific motion pack, mapped to this rig or a
                compatible human GLB rig, is required. No fallback gestures or
                text playback are substituted.
              </p>
            )}
            {catalog && catalog.signs.length > 0 && (
              <details>
                <summary>
                  Supported vocabulary (
                  {catalog.signs.filter((s) => s.kind === "sign").length})
                </summary>
                <p>
                  {catalog.signs
                    .filter((s) => s.kind === "sign")
                    .map((s) => s.label)
                    .join(" · ")}
                </p>
                <p>
                  Fingerspelling assets, if present, are labeled separately and
                  used only in reviewed phrase plans. There is no automatic
                  fallback.
                </p>
              </details>
            )}
          </section>
        </>
      ) : (
        <SignToSpeech />
      )}
    </main>
  );
}
