# Signify

React 18 + TypeScript + Vite + Three.js. The original dark purple/pink/blue visual style, home feature grid, and two-column conversation layout are restored. No repository reset was used.

## Run

```sh
npm install
npm run dev
```

Open the printed URL and choose **Start a Conversation** (`/conversation`). On Windows with PowerShell script restrictions, use `npm.cmd` and `npx.cmd`.

```sh
npm run build
npm run preview
npx tsc --noEmit
npm run lint
npm test
```

Browser tests use Playwright with an installed Google Chrome (`channel: 'chrome'`). Three.js is lazy-loaded only for the avatar viewer. Its initial download is larger than the rest of the interface.

## What was actually recoverable

Git has one original commit (`3f77fda`). Its microphone captured audio, then ignored it and selected a random transcript. The avatar used an emoji and sine-wave hand motion; it did not select language-specific signs. Camera recognition also generated random results. There is no three-gesture implementation, sign dictionary, human model, or signing dataset in that commit or the supplied working tree.

A separate checkout was found at `C:\Users\deeks\Signify` through an existing Playwright cache reference. That project contains an ASL HELLO/YES/NO reference-video lookup and a camera-training workflow, which matches the reported three-sign coverage. Its status file also says there is no verified avatar motion rig. It was inspected read-only and was not modified or merged into this workspace. Confirm which checkout is intended before transferring changes or assets between these distinct projects.

The previous edit removed the original visual personality and replaced signing with text rehearsal. That substitution is now removed. Camera preview, separately labeled browser text-to-speech, contrast controls, and the honest hashing demonstration remain available.

## Current capability and limits

- Typed text and **real browser speech recognition** reach the same `resolveInput` function. Final recognized speech fills the editable transcript and prepares the plan; playback starts only when you press Play. Interim text is never animated. English speech input is separate from the target sign language.
- Browser recognition requires support and microphone permission; availability varies. Permission, network, no-speech, and unsupported-browser errors are visible. Browser recognition may send audio to a browser-provided service. It is not claimed to run locally. Use localhost or HTTPS.
- The viewer renders a coherent, stylized neutral 3D upper body, connected arms, wrists and articulated fingers, plus head, brow and jaw joints. It is a **procedural presentation rig**, not a professionally skinned or linguistically validated signing character. No arbitrary idle movements are labeled as signs.
- A production GLB/glTF human rig and its compatible animations can replace the neutral rig through the manifest. Automatic retargeting across skeletons is **not** implemented.
- The installed catalog has **zero signs and zero phrases**. Language remains `null` pending owner confirmation. Original ASL defaults and other language options were labels, not evidence of established support.
- No real sign language, arbitrary sentence translation, fingerspelling fallback, emotion recognition, or camera sign recognition is currently available. Captions support actual animation playback; there is no text-only playback mode.

## Pipeline

`typed message / recognized speech → normalize → reviewed phrase plan OR explicit vocabulary practice → validate all asset references → load compatible motion → one animation clock → pose + current sign + caption + progress`

`src/signing/pipeline.ts` validates catalog metadata and resolves input atomically:

- **Reviewed phrases:** exact whole-phrase lookup, ignoring case and repeated whitespace only. Each reviewed plan provides the ordered sign IDs. It can cover single signs or an authored sentence sequence. It never generates a plan from English word order.
- **Vocabulary practice:** explicit user-selected mode, using longest matching multiword labels in input order. This is not sentence translation. Punctuation and any other unmatched tokens are reported rather than silently removed. Unknown tokens block the whole sequence.
- **Fingerspelling:** assets may be marked `kind: "fingerspelling"` and referenced explicitly in reviewed phrase plans. The viewer labels them as fingerspelling. There is no automatic fallback or invented alphabet.

`src/signing/motion.ts` loads authored Three.js AnimationClip JSON or a named animation from GLB/glTF, validates duration, tracks, target nodes and caption ranges, and creates a sequence timeline. Play/pause, replay, speed, captions and progress use this same clock. Repeated signs use distinct action instances. Phrase authors may specify a reviewed transition duration; the player interpolates held end/start poses without truncating either sign. Set it to zero unless the transitions have been reviewed. Isolated vocabulary clips use zero added transition; include authored entry/exit motion in those clips.

Input edits invalidate old playback; asset failures block playback with retry. Loading requests are aborted on replacement/unmount and have timeouts. The renderer, geometry, materials and animation mixer are cleaned up when replaced. Playback does not advance in hidden tabs.

## Exact dependencies still needed

1. Confirmation of the target sign language and regional variety.
2. A licensed motion library reviewed by qualified signers for that language, including handshape, palm orientation, location, movement and nonmanual grammar. Video alone is not sufficient for this 3D pipeline without separately validated motion capture/retargeting.
3. Either animation authored to `signify-neutral-v1` or a licensed, properly skinned human GLB model and matching animation skeleton, with fingers and facial expression channels. No professional production rig is bundled.
4. Reviewed phrase-to-sign plans and transitions. Broad sentence translation needs a separately evaluated language-specific translation service/pipeline; none is bundled or implied.

### Connecting assets

Use `public/signing/catalog.json`. It is intentionally empty, not populated with sample gestures. Type definitions are in `src/signing/pipeline.ts`.

A catalog has:

- `version: 1`, a confirmed `language` string, and `rig: { id, url }`. `url: null` selects the built-in neutral rig. For a production avatar, use a self-contained, uncompressed GLB URL. Export upright in metres, facing +Z; frame the upper-body mesh. Test the complete motion range on narrow screens.
- `signs`: each entry has unique `id`, `label`, `kind` (`sign` or `fingerspelling`), matching `rigId`, `url`, optional `animationName` (required for GLB motion), `cues: [{ start, caption }]`, and `source`, `license`, `reviewedBy`, `reviewedOn`. Cues use animation-local seconds, in ascending order.
- `phrases`: each has `text`, ordered `signIds`, `transitionSeconds` (0–1), and the same source/license/reviewer/date fields. Include separately reviewed spoken variants when recognition punctuation differs.

Place files under `public/signing/` and use URLs such as `/signing/your-reviewed-asset.glb`. For Three.js JSON export, use `AnimationClip.toJSON`. The built-in rig exposes `Spine`, `Neck`, `Head`, `Jaw`, `LeftBrow`, `RightBrow`; on both `Left` and `Right`: `Shoulder`, `UpperArm`, `Forearm`, `Hand`, and `Thumb/Index/Middle/Ring/Little` joints `1`, `2`, `3`. Positions are parent-local; rotations are quaternions. Use the source rig to author, not guessed movement descriptions.

A populated manifest is checked for completeness, not independently certified for linguistic accuracy. Qualified human review is still essential. Skeletal naming, rest pose, hand visibility, facial tracks, transitions, and sign meaning must be checked with real assets. Generic character animations are not signing assets.

## Verification scope

Tests exercise three different phrase plans and four distinct **synthetic test motions**, actual bone transformation and transition interpolation, synchronized captions, pause/replay/speed, unknown input, a mocked microphone final transcript entering the identical resolver, missing assets, unsupported speech recognition, and mobile layout. Synthetic motions exist only inside tests, are explicitly labeled as non-sign data, and never ship in the production catalog. They establish mechanical correctness, not signing accuracy. Live microphone recognition, production human rigs and real sign sequences still require device/asset-specific validation.

## API references

- [Three.js animation system](https://threejs.org/manual/pages/animation-system.html)
- [Three.js AnimationAction](https://threejs.org/docs/pages/AnimationAction.html)
- [Three.js GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html)
- [Browser SpeechRecognition support and service behavior](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
