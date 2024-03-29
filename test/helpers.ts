import { Console } from "console";
import { Transform } from "stream";
import { Mock, vi } from "vitest";

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

  vi.spyOn(console, "log").mockImplementation(
    mockConsole.log.bind(mockConsole),
  );
  vi.spyOn(console, "error").mockImplementation(
    mockConsole.error.bind(mockConsole),
  );

  return { readStdout, readStderr };
}

type Procedure = (...args: never[]) => void;
export type Mocked<T extends Procedure = Procedure> = Mock<
  Parameters<T>,
  ReturnType<T>
>;

export function mockFn<T extends Procedure = Procedure>(): Mocked<T>;
export function mockFn<T extends Procedure = Procedure>(
  implementation: T,
): Mocked<T>;
export function mockFn<T extends Procedure = Procedure>(
  implementation?: T,
): Mocked<T> {
  return vi.fn(implementation as T) as unknown as Mocked<T>;
}
