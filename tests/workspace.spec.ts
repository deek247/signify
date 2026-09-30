import { test, expect } from "@playwright/test";
import * as THREE from "three";
import {
  resolveInput,
  validateCatalog,
  type Catalog,
} from "../src/signing/pipeline";
import { SequencePlayer } from "../src/signing/motion";
const review = {
  source: "Synthetic automated test fixture — not sign data",
  license: "Test only",
  reviewedBy: "Automated test, not language validation",
  reviewedOn: "2026-09-30",
};
const pack: Catalog = {
  version: 1,
  language: "TEST FIXTURES — NOT SIGN LANGUAGE",
  rig: { id: "signify-neutral-v1", url: null },
  signs: [
    "fixture alpha",
    "fixture beta",
    "fixture gamma",
    "fixture delta",
  ].map((label, index) => ({
    id: `test-${index}`,
    label,
    kind: "sign",
    rigId: "signify-neutral-v1",
    url: `/signing/test-${index}.json`,
    cues: [
      { start: 0, caption: label },
      { start: 0.5, caption: `${label} hold` },
    ],
    ...review,
  })),
  phrases: [
    {
      text: "First fixture",
      signIds: ["test-0", "test-1"],
      transitionSeconds: 0.2,
      ...review,
    },
    {
      text: "Second fixture",
      signIds: ["test-2", "test-3"],
      transitionSeconds: 0.2,
      ...review,
    },
    {
      text: "Third fixture",
      signIds: ["test-1", "test-0", "test-3"],
      transitionSeconds: 0.2,
      ...review,
    },
  ],
};
function motion(index: number) {
  const axis = new THREE.Vector3(index % 2 ? 1 : 0, index % 2 ? 0 : 1, 0);
  const q = new THREE.Quaternion().setFromAxisAngle(axis, (index + 1) * 0.1);
  return new THREE.AnimationClip(`test-${index}`, 1, [
    new THREE.QuaternionKeyframeTrack(
      "Head.quaternion",
      [0, 1],
      [...q.toArray(), ...q.toArray()],
    ),
  ]);
}
async function installFixtureRoutes(page: import("@playwright/test").Page) {
  await page.route("**/signing/catalog.json", (route) =>
    route.fulfill({ json: pack }),
  );
  await page.route(/\/signing\/test-\d.json$/, (route) => {
    const i = Number(
      route
        .request()
        .url()
        .match(/test-(\d)/)?.[1],
    );
    return route.fulfill({ json: THREE.AnimationClip.toJSON(motion(i)) });
  });
}

test("phrase plans differ, vocabulary matches longest entries, unsupported input is atomic", () => {
  expect(validateCatalog(pack)).toEqual(pack);
  const inputs = ["First fixture", "Second fixture", "Third fixture"];
  const ids = inputs.map((input) => {
    const result = resolveInput(input, pack, "phrases");
    expect(result.ok).toBeTruthy();
    return result.ok ? result.plan.signs.map((s) => s.id) : [];
  });
  expect(ids).toEqual([
    ["test-0", "test-1"],
    ["test-2", "test-3"],
    ["test-1", "test-0", "test-3"],
  ]);
  const vocabulary = resolveInput(
    "fixture delta fixture alpha",
    pack,
    "vocabulary",
  );
  expect(vocabulary.ok && vocabulary.plan.signs.map((s) => s.id)).toEqual([
    "test-3",
    "test-0",
  ]);
  const unknown = resolveInput("fixture alpha unknown 🖐", pack, "vocabulary");
  expect(unknown).toMatchObject({ ok: false, unsupported: ["unknown", "🖐"] });
  expect(resolveInput("an arbitrary sentence", pack, "phrases").ok).toBeFalsy();
  expect(() =>
    validateCatalog({ ...pack, signs: [{ ...pack.signs[0], reviewedBy: "" }] }),
  ).toThrow();
});

test("the motion clock changes actual joints, interpolates transitions and resets", () => {
  const root = new THREE.Group();
  const head = new THREE.Bone();
  head.name = "Head";
  root.add(head);
  const player = new SequencePlayer(root, [motion(0), motion(1)], 0.2);
  player.seek(0.5);
  const first = head.quaternion.clone();
  player.seek(1.1);
  const blend = head.quaternion.clone();
  player.seek(1.7);
  const second = head.quaternion.clone();
  expect(first.angleTo(second)).toBeGreaterThan(0.1);
  expect(first.angleTo(blend)).toBeGreaterThan(0.01);
  expect(blend.angleTo(second)).toBeGreaterThan(0.01);
  expect(player.seek(3).ended).toBeTruthy();
  player.seek(0);
  expect(head.quaternion.angleTo(first)).toBeLessThan(0.001);
  player.dispose();
});

test("production catalog never substitutes text or invented signs", async ({
  page,
}) => {
  await page.goto("/conversation");
  await page
    .getByLabel("Your message / transcript")
    .fill("Hello, how are you?");
  await page
    .getByRole("button", { name: "Prepare signing", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("target sign language");
  await expect(
    page.getByRole("button", { name: "Play", exact: true }),
  ).toBeDisabled();
  await expect(page.getByRole("status")).toContainText("Neutral pose");
  await expect(page.locator("canvas")).toHaveCount(1);
  await expect(page.getByText("Text rehearsal", { exact: false })).toHaveCount(
    0,
  );
  await page.screenshot({
    path: "test-results/conversation-desktop.png",
    fullPage: true,
  });
});

test("fixture playback pauses, synchronizes captions, changes speed and replays", async ({
  page,
}) => {
  await installFixtureRoutes(page);
  await page.goto("/conversation");
  await page.getByLabel("Your message / transcript").fill("First fixture");
  await page
    .getByRole("button", { name: "Prepare signing", exact: true })
    .click();
  await expect(page.getByRole("status")).toHaveText("Ready to sign");
  await page.getByLabel("Speed").selectOption("0.5");
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(
    page.getByText("fixture alpha hold", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const progress = await page
    .getByRole("progressbar")
    .getAttribute("aria-valuenow");
  await page.waitForTimeout(350);
  expect(
    await page.getByRole("progressbar").getAttribute("aria-valuenow"),
  ).toBe(progress);
  await page.getByLabel("Speed").selectOption("1.5");
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Sequence complete");
  await expect(
    page.getByText("fixture beta hold", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Replay sign sequence" }).click();
  await expect(page.getByText("fixture alpha", { exact: true })).toBeVisible();
  await page.getByLabel("Your message / transcript").fill("Second fixture");
  await expect(
    page.getByRole("button", { name: "Play", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Prepare signing", exact: true })
    .click();
  await expect(page.getByText("fixture gamma", { exact: true })).toBeVisible();
});

test("microphone final transcript reaches the identical phrase resolver", async ({
  page,
}) => {
  await page.addInitScript(() => {
    class MockRecognition {
      lang = "";
      continuous = false;
      interimResults = false;
      onresult: ((e: unknown) => void) | null = null;
      onend: (() => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      start() {
        setTimeout(() => {
          this.onresult?.({
            resultIndex: 0,
            results: [{ isFinal: true, 0: { transcript: "Third fixture" } }],
          });
          this.onend?.();
        }, 50);
      }
      stop() {
        this.onend?.();
      }
      abort() {
        this.onend = null;
      }
    }
    Object.defineProperty(window, "SpeechRecognition", {
      value: MockRecognition,
      configurable: true,
    });
  });
  await installFixtureRoutes(page);
  await page.goto("/conversation");
  await page.getByRole("button", { name: "Start microphone" }).click();
  await expect(page.getByLabel("Your message / transcript")).toHaveValue(
    "Third fixture",
  );
  await expect(page.getByRole("status")).toHaveText("Ready to sign");
  await expect(page.getByText("fixture beta", { exact: true })).toBeVisible();
  await expect(page.locator(".caption")).toContainText("1 / 3");
});

test("missing animation reports an error; unsupported microphone and mobile navigation remain usable", async ({
  page,
}) => {
  await installFixtureRoutes(page);
  await page.route("**/signing/test-0.json", (route) =>
    route.fulfill({ status: 404, body: "" }),
  );
  await page.addInitScript(() => {
    Object.defineProperty(window, "SpeechRecognition", { value: undefined });
    Object.defineProperty(window, "webkitSpeechRecognition", {
      value: undefined,
    });
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/conversation");
  await page.getByRole("button", { name: "Start microphone" }).click();
  await expect(page.getByRole("alert")).toContainText("unavailable");
  await page.getByLabel("Your message / transcript").fill("First fixture");
  await page
    .getByRole("button", { name: "Prepare signing", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Animation unavailable");
  await expect(
    page.getByRole("button", { name: "Play", exact: true }),
  ).toBeDisabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole("link", { name: "Home", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Bridging",
  );
});

test("phone viewer and home retain original visual personality", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/conversation");
  await expect(page.getByRole("status")).toContainText("Neutral pose");
  await page.screenshot({
    path: "test-results/conversation-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
});
