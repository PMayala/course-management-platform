const fs = require("fs");
const path = require("path");

const OUTPUT_FILE = "code-dump.txt";

const EXCLUDED_DIRS = [
  "node_modules", ".git", "dist", "build", "coverage",
  ".vscode", ".idea", "uploads", "public/assets"
];

const EXCLUDED_FILES = [
  OUTPUT_FILE, "package-lock.json", "yarn.lock", ".DS_Store"
];

const SKIP_EXTENSIONS = [
  ".png", ".jpg", ".jpeg", ".webp", ".svg",
  ".ico", ".mp4", ".mp3", ".ttf", ".woff", ".woff2", ".zip"
];

const languageMap = {
  ".js": "javascript",
  ".ts": "typescript",
  ".json": "json",
  ".html": "html",
  ".css": "css",
  ".env": "bash",
  ".md": "markdown",
};

function getLanguage(ext) {
  return languageMap[ext.toLowerCase()] || "";
}

function shouldSkipFile(fileName, ext) {
  return (
    EXCLUDED_FILES.includes(fileName) ||
    SKIP_EXTENSIONS.includes(ext.toLowerCase()) ||
    fileName.startsWith(".") // skip hidden files
  );
}

function dumpDirectoryContents(dirPath, writeStream) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(process.cwd(), fullPath);

    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.includes(entry.name) && !entry.name.startsWith(".")) {
        dumpDirectoryContents(fullPath, writeStream);
      }
    } else {
      const ext = path.extname(entry.name);
      if (!shouldSkipFile(entry.name, ext)) {
        try {
          const content = fs.readFileSync(fullPath, "utf8");
          const lang = getLanguage(ext);

          writeStream.write(`\n\n/* ========== ${relativePath} ========== */\n`);
          writeStream.write(`\`\`\`${lang}\n${content.trim()}\n\`\`\`\n`);
        } catch (err) {
          console.error(`❌ Failed to read: ${relativePath}`, err.message);
        }
      }
    }
  }
}

// Create the output stream
const output = fs.createWriteStream(OUTPUT_FILE);
output.write(`# 📦 Code Dump of "${path.basename(process.cwd())}"\n\n`);

dumpDirectoryContents(process.cwd(), output);

output.end(() => {
  console.log(`✅ Code dump complete! Saved to: ${OUTPUT_FILE}`);
});
