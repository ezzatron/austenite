import { Buffer } from "node:buffer";
import {
  Declaration,
  Options as DeclarationOptions,
  Value,
  defaultFromOptions,
  type ExactOptions,
} from "../declaration.js";
import { registerVariable } from "../environment.js";
import { Example, Examples, create as createExamples } from "../example.js";
import { Maybe, resolve } from "../maybe.js";
import { Scalar, createScalar } from "../schema.js";

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
  const { encoding = "base64" } = options;
  const def = defaultFromOptions(options);
  const schema = createSchema(encoding);

  const v = registerVariable({
    name,
    description,
    default: def,
    schema,
    examples: buildExamples(encoding, schema, def),
  });

  return {
    value() {
      return resolve(v.nativeValue()) as Value<Buffer, O>;
    },
  };
}

function createSchema(encoding: BufferEncoding): Scalar<Buffer> {
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
  schema: Scalar<Buffer>,
  def: Maybe<Buffer | undefined>,
): Examples {
  let defExample: Example | undefined;

  if (def.isDefined && typeof def.value !== "undefined") {
    defExample = {
      canonical: schema.marshal(def.value),
      description: "(default)",
    };
  }

  return createExamples(defExample, {
    canonical: schema.marshal(Buffer.from("conquistador", "utf-8")),
    description: `${encoding} encoded string`,
  });
}
