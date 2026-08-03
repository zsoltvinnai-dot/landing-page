import { cpSync, mkdirSync } from "node:fs";

const output = new URL("./build/", import.meta.url);

mkdirSync(output, { recursive: true });

for (const file of ["index.html", "styles.css", "script.js"]) {
  cpSync(new URL(`./${file}`, import.meta.url), new URL(file, output));
}

cpSync(new URL("./assets/", import.meta.url), new URL("assets/", output), {
  recursive: true,
});
