import { EOL } from "node:os";
import { state, variablesByName } from "./environment.js";
import { render as renderSummary } from "./summary.js";
import type { MarkdownPrettyPrintType } from "./usage.js";
import { validate, type Results } from "./validation.js";

export async function initialize(
  options: InitializeOptions = {},
): Promise<void> {
  if (process.env.AUSTENITE_MODE === "usage/markdown") {
    const { markdownPrettyPrint = "prettier" } = options;
    const { render: renderUsage } = await import("./usage.js");

    console.log(await renderUsage(markdownPrettyPrint, variablesByName()));

    // eslint-disable-next-line n/no-process-exit
    process.exit(0);
  } else {
    const { onInvalid = defaultOnInvalid } = options;
    const [isValid, results] = validate(variablesByName(), state.composites);

    if (!isValid) {
      onInvalid({
        results,
        defaultHandler() {
          defaultOnInvalid({ results });
        },
      });
    }
  }
}

export function defaultOnInvalid({ results }: { results: Results }): never {
  console.error(
    ["Environment Variables:", "", renderSummary(results)].join(EOL),
  );

  // eslint-disable-next-line n/no-process-exit
  process.exit(1);

  return undefined as never;
}

export type InitializeOptions = {
  readonly onInvalid?: OnInvalid;
  readonly markdownPrettyPrint?: MarkdownPrettyPrintType;
};

export type OnInvalid = (args: OnInvalidArgs) => void;

type OnInvalidArgs = {
  readonly results: Results;
  readonly defaultHandler: () => never;
};
