import { cp, mkdir } from "node:fs/promises";

await mkdir("dist/themes", { recursive: true });
await cp("src/themes", "dist/themes", { recursive: true });
