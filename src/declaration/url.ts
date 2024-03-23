import { applyConstraints, type Constraint } from "../constraint.js";
import { createURLProtocolConstraint } from "../constraint/url-protocol.js";
import {
  Declaration,
  Options as DeclarationOptions,
  Value,
  defaultFromOptions,
  type ExactOptions,
} from "../declaration.js";
import { registerVariable } from "../environment.js";
import { normalize } from "../error.js";
import { Example, Examples, create as createExamples } from "../example.js";
import { resolve } from "../maybe.js";
import { createURL, toString, type URLSchema } from "../schema.js";
import { SpecError } from "../variable.js";

// as per https://www.rfc-editor.org/rfc/rfc3986#section-3.1
const VALID_PROTOCOL_PATTERN = /^[a-zA-Z][a-zA-Z0-9.+-]*:$/;

export type Options = DeclarationOptions<URL> & {
  readonly base?: URL;
  readonly protocols?: string[];
};

export function url<O extends Options>(
  name: string,
  description: string,
  options: ExactOptions<O, Options> = {} as ExactOptions<O, Options>,
): Declaration<URL, O> {
  const { isSensitive = false } = options;
  const { base, protocols } = options;
  assertProtocols(name, protocols);

  const schema = createSchema(base, protocols);

  assertBase(name, schema.constraints, base);

  const def = defaultFromOptions(options);

  const v = registerVariable({
    name,
    description,
    default: def,
    isSensitive,
    schema,
    examples: buildExamples(base, protocols),
  });

  return {
    value() {
      return resolve(v.nativeValue()) as Value<URL, O>;
    },
  };
}

function assertProtocols(name: string, protocols: string[] | undefined): void {
  if (protocols == null) return;
  if (protocols.length === 0) throw new EmptyProtocolsError(name);

  for (const protocol of protocols) {
    if (!protocol.endsWith(":")) {
      throw new InvalidProtocolError(
        name,
        protocol,
        "must end with a colon (:)",
      );
    }

    if (!VALID_PROTOCOL_PATTERN.test(protocol)) {
      throw new InvalidProtocolError(
        name,
        protocol,
        "must be a valid protocol",
      );
    }
  }
}

function assertBase(
  name: string,
  constraints: Constraint<URL>[],
  base: URL | undefined,
): void {
  if (base == null) return;

  try {
    applyConstraints(constraints, base);
  } catch (error) {
    throw new BaseUrlError(name, base, normalize(error).message);
  }
}

function createSchema(
  base: URL | undefined,
  protocols: string[] | undefined,
): URLSchema {
  function unmarshal(v: string): URL {
    try {
      return new URL(v, base);
    } catch {
      throw new Error("must be a URL");
    }
  }

  const constraints: Constraint<URL>[] = [];
  if (protocols != null) {
    constraints.push(createURLProtocolConstraint(protocols));
  }

  return createURL(base, protocols, toString, unmarshal, constraints);
}

function buildExamples(
  base: URL | undefined,
  protocols: string[] | undefined,
): Examples {
  let protocolExamples: Example[];
  let relativeExample: Example | undefined;

  if (protocols == null) {
    protocolExamples = [
      {
        canonical: `https://host.example.org/path/to/resource`,
        description: "URL (absolute)",
      },
    ];
  } else {
    protocolExamples = protocols.map((protocol) => ({
      canonical: `${protocol}//host.example.org/path/to/resource`,
      description: `URL (${protocol})`,
    }));
  }

  if (base != null) {
    relativeExample = {
      canonical: `path/to/resource`,
      description: "URL (relative)",
    };
  }

  return createExamples(...protocolExamples, relativeExample);
}

class BaseUrlError extends SpecError {
  constructor(name: string, base: URL, message: string) {
    super(name, new Error(`base URL (${base.toString()}): ${message}`));
  }
}

class EmptyProtocolsError extends SpecError {
  constructor(name: string) {
    super(name, new Error("list of protocols can not be empty"));
  }
}

class InvalidProtocolError extends SpecError {
  constructor(name: string, protocol: string, message: string) {
    super(
      name,
      new Error(`protocol (${JSON.stringify(protocol)}): ${message}`),
    );
  }
}
