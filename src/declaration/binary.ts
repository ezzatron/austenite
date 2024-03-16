import { Buffer } from "node:buffer";
import {
  Declaration,
  Options as DeclarationOptions,
  Value,
  defaultFromOptions,
  type ExactOptions,
} from "../declaration.js";
import { registerVariable } from "../environment.js";
import { Examples, create as createExamples } from "../example.js";
import { resolve } from "../maybe.js";
import { ScalarSchema, createScalar } from "../schema.js";

const PATTERNS: Partial<Record<BufferEncoding, RegExp>> = {
  base64: /^[A-Za-z0-9+/]*={0,2}$/,
  hex: /^[0-9a-fA-F]*$/,
} as const;

export type Options = DeclarationOptions<Buffer> & {
  readonly encoding?: BufferEncoding;
};

export function binary<O extends Options>(
  name: string,
  description: string,
  options: ExactOptions<O, Options> = {} as ExactOptions<O, Options>,
): Declaration<Buffer, O> {
  const { encoding = "base64", isSensitive = false } = options;
  const def = defaultFromOptions(options);
  const schema = createSchema(encoding);

  const v = registerVariable({
    name,
    description,
    default: def,
    isSensitive,
    schema,
    examples: buildExamples(encoding, schema),
  });

  return {
    value() {
      return resolve(v.nativeValue()) as Value<Buffer, O>;
    },
  };
}

function createSchema(encoding: BufferEncoding): ScalarSchema<Buffer> {
  function marshal(v: Buffer): string {
    return v.toString(encoding);
  }

  return createScalar(
    encoding,
    marshal,
    createUnmarshal(encoding, PATTERNS[encoding]),
  );
}

function createUnmarshal(
  encoding: BufferEncoding,
  pattern?: RegExp,
): (v: string) => Buffer {
  if (pattern) {
    return function unmarshal(v: string): Buffer {
      if (pattern.test(v)) return Buffer.from(v, encoding);

      throw new Error(`must be ${encoding} encoded`);
    };
  }

  return function unmarshal(v: string): Buffer {
    return Buffer.from(v, encoding);
  };
}

function buildExamples(
  encoding: BufferEncoding,
  schema: ScalarSchema<Buffer>,
): Examples {
  return createExamples({
    canonical: schema.marshal(Buffer.from("conquistador", "utf-8")),
    description: `${encoding} encoded string`,
  });
}
