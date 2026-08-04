import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

function syncDirectory(directory) {
  try {
    const descriptor = fs.openSync(directory, "r");
    try {
      fs.fsyncSync(descriptor);
    } finally {
      fs.closeSync(descriptor);
    }
  } catch {
    // Directory fsync is not supported by every filesystem; file fsync still applies.
  }
}

export function writeFileAtomic(filePath, data, options = {}) {
  const resolvedPath = path.resolve(filePath);
  const directory = path.dirname(resolvedPath);
  const basename = path.basename(resolvedPath);
  const temporaryPath = path.join(directory, `.${basename}.${process.pid}.${randomUUID()}.tmp`);
  let descriptor = null;

  fs.mkdirSync(directory, { recursive: true });
  let mode = 0o666;
  try {
    mode = fs.statSync(resolvedPath).mode & 0o777;
  } catch {
    // Use the process umask for new files.
  }

  try {
    descriptor = fs.openSync(temporaryPath, "wx", mode);
    fs.writeFileSync(descriptor, data, options);
    fs.fsyncSync(descriptor);
    fs.closeSync(descriptor);
    descriptor = null;
    fs.renameSync(temporaryPath, resolvedPath);
    syncDirectory(directory);
    return resolvedPath;
  } finally {
    if (descriptor !== null) {
      try {
        fs.closeSync(descriptor);
      } catch {
        // Preserve the original write error.
      }
    }
    try {
      fs.unlinkSync(temporaryPath);
    } catch {
      // The rename succeeded or cleanup is already complete.
    }
  }
}

export function copyFileAtomic(sourcePath, targetPath) {
  return writeFileAtomic(targetPath, fs.readFileSync(sourcePath));
}
