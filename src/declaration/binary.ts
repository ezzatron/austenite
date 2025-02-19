import { Buffer } from "node:buffer";
import type {
  Constraint,
  DeclarationConstraintOptions,
} from "../constraint.js";
import {
  createLengthConstraint,
  type LengthConstraintSpec,
} from "../constraint/length.js";
import {
  DeclarationFromOptions,
  Options as DeclarationOptions,
  Value,
  defaultFromOptions,
  type ExactOptions,
} from "../declaration.js";
import { registerVariable } from "../environment.js";
import { SpecError, normalize } from "../error.js";
import {
  resolveExamples,
  type DeclarationExampleOptions,
  type Example,
} from "../example.js";
import { resolve } from "../maybe.js";
import { ScalarSchema, createScalar } from "../schema.js";

const PATTERNS: Partial<Record<BufferEncoding, RegExp>> = {
  base64: /^[A-Za-z0-9+/]*={0,2}$/,
  hex: /^[0-9a-fA-F]*$/,
} as const;

export type Options = DeclarationOptions<Buffer> &
  DeclarationConstraintOptions<Buffer> &
  DeclarationExampleOptions<Buffer> & {
    readonly encoding?: BufferEncoding;
    readonly length?: LengthConstraintSpec;
  };

export function binary<O extends Options>(
  name: string,
  description: string,
  options: ExactOptions<O, Options> = {} as ExactOptions<O, Options>,
): DeclarationFromOptions<Buffer, O> {
  const { encoding = "base64", examples, isSensitive = false } = options;

  const def = defaultFromOptions(options);
  const schema = createSchema(name, encoding, options);

  const v = registerVariable({
    name,
    description,
    default: def,
    isSensitive,
    schema,
    examples: resolveExamples(
      name,
      schema,
      () => buildExamples(encoding),
      examples,
    ),
  });

  return {
    value() {
      return resolve(v.nativeValue()) as Value<Buffer, O>;
    },
  };
}

function createSchema(
  name: string,
  encoding: BufferEncoding,
  options: Options,
): ScalarSchema<Buffer> {
  function marshal(v: Buffer): string {
    return v.toString(encoding);
  }

  const { constraints: customConstraints = [], length } = options;
  const constraints: Constraint<Buffer>[] = [];

  try {
    if (typeof length !== "undefined") {
      constraints.push(createLengthConstraint("decoded length", length));
    }
  } catch (error) {
    throw new SpecError(name, normalize(error));
  }

  return createScalar(
    encoding,
    marshal,
    createUnmarshal(encoding, PATTERNS[encoding]),
    [...constraints, ...customConstraints],
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

function buildExamples(encoding: BufferEncoding): Example<Buffer>[] {
  return [
    {
      value: Buffer.from("conquistador", "utf-8"),
      label: `${encoding} encoded string`,
    },
  ];
}
