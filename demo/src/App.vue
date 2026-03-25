<script setup lang="ts">
import { ref } from "vue";
import "../../src/terminal-element";
import type { Line, ThemeType } from "../../src/terminal-element";
// TODO:
// import "terminal-element";
// import type { Line, ThemeType } from "terminal-element";

const theme = ref<ThemeType>("dark");
const animated = ref(true);
const loop = ref(true);

const content: Line[] = [
  { type: "input", text: "pnpm run test" },
  { type: "output", text: "" },
  {
    type: "output",
    delay: 500,
    segments: [
      { text: " RUN ", color: "black", bg: "cyan" },
      { text: " v4.1.0 ", color: "cyan" },
      { text: "/Users/terminal-element", color: "black-bright" },
    ],
  },
  { type: "output", text: "" },
  {
    type: "output",
    segments: [{ text: "stderr | unknown test", color: "black-bright" }],
  },
  {
    type: "output",
    text: "Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.",
  },
  {
    type: "output",
    delay: 500,
    segments: [
      { text: " ✓ ", color: "green" },
      { text: " chromium ", color: "black", bg: "yellow" },
      { text: " src/terminal-element.test.ts " },
      { text: "(2 tests | ", color: "black-bright" },
      { text: "1 skipped", color: "yellow" },
      { text: ") " },
      { text: "5ms", color: "green" },
    ],
  },
  {
    type: "output",
    segments: [
      { text: "   ✓ ", color: "green" },
      { text: "terminal-element (1)" },
    ],
  },
  {
    type: "output",
    delay: 100,
    segments: [
      { text: "     ✓ ", color: "green" },
      { text: "first " },
      { text: "6ms", color: "green" },
    ],
  },
  { type: "output", text: "     ↓ second" },
  { type: "output", text: "" },
  {
    type: "output",
    delay: 100,
    segments: [
      { text: " Test Files  ", color: "black-bright" },
      { text: "1 passed ", color: "green" },
      { text: "(1)", color: "black-bright" },
    ],
  },
  {
    type: "output",
    segments: [
      { text: "      Tests  ", color: "black-bright" },
      { text: "1 passed ", color: "green" },
      { text: "| ", color: "black-bright" },
      { text: "1 skipped ", color: "yellow" },
      { text: "(2)", color: "black-bright" },
    ],
  },
  {
    type: "output",
    segments: [
      { text: "   Start at  ", color: "black-bright" },
      { text: "01:23:45" },
    ],
  },
  {
    type: "output",
    segments: [
      { text: "   Duration  ", color: "black-bright" },
      { text: "1.23s" },
      {
        text: " (transform 0ms, setup 0ms, import 45ms, tests 6ms, environment 0ms)",
        color: "black-bright",
      },
    ],
  },
];
</script>

<template>
  <div class="demo">
    <div class="demo__controls">
      <label class="demo__control">
        <span>Theme:</span>
        <select v-model="theme">
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </label>
      <label class="demo__control">
        <span>Animated:</span>
        <input type="checkbox" v-model="animated" />
      </label>
      <label class="demo__control" v-show="animated">
        <span>Loop:</span>
        <input type="checkbox" v-model="loop" />
      </label>
    </div>
    <terminal-element width="600px" height="360px" currentDirectory="~/terminal-element" :theme="theme"
      :animated="animated" :loop="loop" :content="content" :typingSpeed="50" :delayAfterComplete="4000"
      :delayBeforeRestart="1000" />
  </div>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 24px;
}

.demo__controls {
  display: flex;
  gap: 24px;
}

.demo__control {
  display: flex;
  align-items: center;
  gap: 4px;
}

.demo__control select,
.demo__control input {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
