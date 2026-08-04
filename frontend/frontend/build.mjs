import { cpSync, mkdirSync } from "node:fs";

const output = new URL("./build/", import.meta.url);

mkdirSync(output, { recursive: true });

for (const file of ["index.html", "adatkezeles.html", "impresszum.html", "styles.css", "legal.css", "script.js", "robots.txt", "sitemap.xml"]) {
  cpSync(new URL(`./${file}`, import.meta.url), new URL(file, output));
}

cpSync(new URL("./assets/", import.meta.url), new URL("assets/", output), {
  recursive: true,
});
