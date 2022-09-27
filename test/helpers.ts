import { Console } from "node:console";
import { Transform } from "node:stream";

export type HasType<Expected, Actual> = [Expected] extends [Actual]
  ? [Actual] extends [Expected]
    ? Expected
    : never
  : never;

export function hasType<Expected, Actual>(_: HasType<Expected, Actual>): null {
  return null;
}

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
  const readStdout = () => String(stdout.read() ?? "");

  const stderr = new Transform({
    transform(chunk, _, cb) {
      cb(null, chunk);
    },
  });
  const readStderr = () => String(stderr.read() ?? "");

  const mockConsole = new Console({ stdout, stderr });

  jest
    .spyOn(console, "log")
    .mockImplementation(mockConsole.log.bind(mockConsole));
  jest
    .spyOn(console, "error")
    .mockImplementation(mockConsole.error.bind(mockConsole));

  return { readStdout, readStderr };
}
