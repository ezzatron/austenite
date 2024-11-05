import { Console } from "node:console";
import { Transform } from "node:stream";
import { vi } from "vitest";

export function noop() {
  return;
}

export type MockConsole = ReturnType<typeof createMockConsole>;

export function createMockConsole() {
  const stdout = new Transform({
    transform(chunk, _, cb) {
      cb(null, chunk);
    },
  });
  const readStdout = () => {
    const buffer = stdout.read() as Buffer | null;

    if (buffer == null) return "";

    return stripANSI(String(buffer));
  };

  const stderr = new Transform({
    transform(chunk, _, cb) {
      cb(null, chunk);
    },
  });
  const readStderr = () => {
    const buffer = stderr.read() as Buffer | null;

    if (buffer == null) return "";

    return stripANSI(String(buffer));
  };

  const mockConsole = new Console({ stdout, stderr });

  vi.spyOn(console, "log").mockImplementation(
    mockConsole.log.bind(mockConsole),
  );
  vi.spyOn(console, "error").mockImplementation(
    mockConsole.error.bind(mockConsole),
  );

  return { readStdout, readStderr };
}

function stripANSI(output: string): string {
  // eslint-disable-next-line no-control-regex
  return output.replace(/\u001b\[\d+m/g, "");
}
