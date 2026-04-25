<script setup lang="ts">
import { computed, ref } from "vue";
import "terminal-element";
import "terminal-element/themes/catppuccin-latte.css";
import "terminal-element/themes/catppuccin-mocha.css";
import "terminal-element/themes/dracula.css";
import "terminal-element/themes/gruvbox-dark.css";
import "terminal-element/themes/kanagawa-wave.css";
import "terminal-element/themes/tokyo-night.css";
// import "../../dist/terminal-element.es.js";
import type {
  TerminalElement,
  Line,
  Prompt,
  ThemeType,
} from "terminal-element";

const themes: { label: string; value: ThemeType }[] = [
  { label: "Dark", value: "dark" },
  { label: "Light", value: "light" },
  { label: "Catppuccin Mocha", value: "catppuccin-mocha" },
  { label: "Catppuccin Latte", value: "catppuccin-latte" },
  { label: "Gruvbox Dark", value: "gruvbox-dark" },
  { label: "Tokyo Night", value: "tokyo-night" },
  { label: "Kanagawa Wave", value: "kanagawa-wave" },
  { label: "Dracula", value: "dracula" },
];

const theme = ref<ThemeType>("dark");
const animated = ref(true);
const autoStart = ref(true);
const loop = ref(true);
const selectedExample = ref<string>("example1");
const terminalElementRef = ref<TerminalElement | null>(null);

type Example = {
  label: string;
  prompt?: Prompt;
  content: Line[];
};

const testContent: Line[] = [
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

const bubbleTeaPrompt: Prompt = [
  { text: "thunderclap:", color: "cyan" },
  { text: "~ ", color: "red" },
  { text: "christian ", color: "cyan" },
  { text: "$", color: "red" },
];

const bubbleTeaContent: Line[] = [
  {
    type: "input",
    text: "./demo",
  },
  {
    type: "output",
    text: "",
  },
  {
    type: "output",
    text: "  What to do today?",
  },
  {
    type: "output",
    text: "",
  },
  {
    type: "output",
    color: "magenta-bright",
    text: "  [x] Plant carrots",
  },
  {
    type: "output",
    text: "  [ ] Go to the market",
  },
  {
    type: "output",
    text: "  [ ] Read something",
  },
  {
    type: "output",
    text: "  [ ] See friends",
  },
  {
    type: "output",
    text: "",
  },
  {
    type: "output",
    id: "bubbletea-countdown",
    segments: [
      {
        text: "  Program quits in ",
      },
      {
        text: "10 ",
        color: "green-bright",
      },
      {
        text: "seconds",
      },
    ],
  },
  {
    type: "output",
    text: "",
  },
  {
    type: "output",
    text: "  j/k, up/down: select   enter: choice   q: esc: quit",
    color: "black-bright",
  },
  {
    type: "update",
    targetId: "bubbletea-countdown",
    delay: 1000,
    segments: [
      {
        text: "  Program quits in ",
      },
      {
        text: "9 ",
        color: "green-bright",
      },
      {
        text: "seconds",
      },
    ],
  },
  {
    type: "update",
    targetId: "bubbletea-countdown",
    delay: 1000,
    segments: [
      {
        text: "  Program quits in ",
      },
      {
        text: "8 ",
        color: "green-bright",
      },
      {
        text: "seconds",
      },
    ],
  },
  {
    type: "erase",
    count: 10,
    delay: 200,
  },
  {
    type: "output",
    text: "  Carrot planting?",
  },
  {
    type: "output",
    text: "",
  },
  {
    type: "output",
    segments: [
      {
        text: "  Cool, we'll need ",
      },
      {
        text: "libgarden ",
        color: "magenta-bright",
      },
      {
        text: "and ",
      },
      {
        text: "vegeutils",
        color: "magenta-bright",
      },
      {
        text: "...",
      },
    ],
  },
  {
    type: "output",
    text: "",
  },
  {
    type: "output",
    text: "  Downloading...",
    id: "download-status",
  },
  {
    type: "progress",
    completeIn: 1500,
    length: 25,
    indent: 2,
    startColor: "magenta-bright",
    endColor: "green-bright",
  },
  {
    type: "update",
    targetId: "download-status",
    segments: [
      {
        text: "  Downloaded. Exiting in ",
      },
      {
        text: "3 ",
        color: "green-bright",
      },
      {
        text: "seconds...",
      },
    ],
  },
  {
    type: "update",
    targetId: "download-status",
    delay: 1000,
    segments: [
      {
        text: "  Downloaded. Exiting in ",
      },
      {
        text: "2 ",
        color: "green-bright",
      },
      {
        text: "seconds...",
      },
    ],
  },
  {
    type: "update",
    targetId: "download-status",
    delay: 1000,
    segments: [
      {
        text: "  Downloaded. Exiting in ",
      },
      {
        text: "1 ",
        color: "green-bright",
      },
      {
        text: "seconds...",
      },
    ],
  },
  {
    type: "update",
    targetId: "download-status",
    delay: 1000,
    segments: [
      {
        text: "  Downloaded. Exiting in ",
      },
      {
        text: "0 ",
        color: "green-bright",
      },
      {
        text: "seconds...",
      },
    ],
  },
  {
    type: "erase",
    count: 6,
    delay: 1000,
  },
  {
    type: "output",
    text: "  See you later!",
  },
  {
    type: "output",
    text: "",
  },
  {
    type: "input",
    text: "",
  },
];

const examples: Record<string, Example> = {
  example1: {
    label: "1",
    content: testContent,
  },
  example2: {
    label: "2",
    prompt: bubbleTeaPrompt,
    content: bubbleTeaContent,
  },
};

const selectedExampleConfig = computed(() => examples[selectedExample.value]);

const handleStartAnimation = () => {
  terminalElementRef.value?.startAnimation();
};
</script>

<template>
  <div class="demo">
    <div class="demo__controls">
      <label class="demo__control">
        <span>Example:</span>
        <select v-model="selectedExample">
          <option v-for="(example, exampleId) in examples" :key="exampleId" :value="exampleId">
            {{ example.label }}
          </option>
        </select>
      </label>
      <label class="demo__control">
        <span>Theme:</span>
        <select v-model="theme">
          <option v-for="themeOption in themes" :key="themeOption.value" :value="themeOption.value">
            {{ themeOption.label }}
          </option>
        </select>
      </label>
      <label class="demo__control">
        <span>Animated:</span>
        <input type="checkbox" v-model="animated" />
      </label>
      <label class="demo__control" v-show="animated">
        <span>Auto start:</span>
        <input type="checkbox" v-model="autoStart" />
      </label>
      <label class="demo__control" v-show="animated">
        <span>Loop:</span>
        <input type="checkbox" v-model="loop" />
      </label>
      <button class="demo__button" type="button" @click="handleStartAnimation" :disabled="!animated">
        Start animation
      </button>
    </div>
    <terminal-element ref="terminalElementRef" width="600px" height="360px" currentDirectory="~/terminal-element"
      :theme="theme" :prompt="selectedExampleConfig.prompt ?? '$'" :animated="animated" :autoStart="autoStart"
      :loop="loop" :content="selectedExampleConfig.content" :typingSpeed="50" :delayAfterComplete="4000"
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

.demo__button {
  padding: 4px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.demo__button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
