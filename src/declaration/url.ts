import {
  Declaration,
  defaultFromOptions,
  Options as DeclarationOptions,
  Value,
} from "../declaration";
import { registerVariable } from "../environment";
import { create as createExamples, Example, Examples } from "../example";
import { Maybe, resolve } from "../maybe";
import { createScalar, Scalar, toString } from "../schema";
import { SpecError } from "../variable";

// as per https://www.rfc-editor.org/rfc/rfc3986#section-3.1
const VALID_PROTOCOL_PATTERN = /^[a-zA-Z][a-zA-Z0-9.+-]*:$/;

export interface Options extends DeclarationOptions<URL> {
  readonly protocols?: string[];
}

export function url<O extends Options>(
  name: string,
  description: string,
  options: O = {} as O
): Declaration<URL, O> {
  const { protocols } = options;
  assertProtocols(name, protocols);

  const def = defaultFromOptions(options);
  const schema = createSchema();

  const v = registerVariable({
    name,
    description,
    default: def,
    schema,
    examples: buildExamples(protocols, schema, def),
    constraint: createValidate(protocols),
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
        "must end with a colon (:)"
      );
    }

    if (!VALID_PROTOCOL_PATTERN.test(protocol)) {
      throw new InvalidProtocolError(
        name,
        protocol,
        "must be a valid protocol"
      );
    }
  }
}

function createSchema(): Scalar<URL> {
  function unmarshal(v: string): URL {
    try {
      const url = new URL(v);

      return url;
    } catch {
      throw new Error("must be a URL");
    }
  }

  return createScalar("URL", toString, unmarshal);
}

function createValidate(protocols: string[] | undefined) {
  if (protocols == null) return undefined;

  const listFormatter = new Intl.ListFormat("en", {
    style: "short",
    type: "disjunction",
  });
  const protocolMessage = `protocol must be ${listFormatter.format(protocols)}`;

  return (url: URL) => {
    if (!protocols.includes(url.protocol)) throw new Error(protocolMessage);
  };
}

function buildExamples(
  protocols: string[] | undefined,
  schema: Scalar<URL>,
  def: Maybe<URL | undefined>
): Examples {
  let defExample: Example | undefined;

  if (def.isDefined && typeof def.value !== "undefined") {
    defExample = {
      canonical: schema.marshal(def.value),
      description: "(default)",
    };
  }

  if (protocols == null) {
    return createExamples(defExample, {
      canonical: `https://host.example.org/path/to/resource`,
      description: "URL",
    });
  }

  return createExamples(
    defExample,
    ...protocols.map((protocol) => ({
      canonical: `${protocol}//host.example.org/path/to/resource`,
      description: `URL (${protocol})`,
    }))
  );
}

class EmptyProtocolsError extends SpecError {
  constructor(name: string) {
    super(name, new Error("list of protocols can not be empty"));
  }
}

class InvalidProtocolError extends SpecError {
  constructor(name: string, protocol: string, message: string) {
    super(name, new Error(`protocol ${JSON.stringify(protocol)}: ${message}`));
  }
}
