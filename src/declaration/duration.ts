import { Temporal } from "@js-temporal/polyfill";
import {
  Declaration,
  Options as DeclarationOptions,
  Value,
  defaultFromOptions,
} from "../declaration.js";
import { registerVariable } from "../environment.js";
import { Example, Examples, create as createExamples } from "../example.js";
import { Maybe, resolve } from "../maybe.js";
import { Scalar, createScalar, toString } from "../schema.js";

const { Duration } = Temporal;
type Duration = Temporal.Duration;

export type Options = DeclarationOptions<Duration>;

export function duration<O extends Options>(
  name: string,
  description: string,
  options: O = {} as O
): Declaration<Duration, O> {
  const def = defaultFromOptions(options);
  const schema = createSchema();

  const v = registerVariable({
    name,
    description,
    default: def,
    schema,
    examples: buildExamples(schema, def),
  });

  return {
    value() {
      return resolve(v.nativeValue()) as Value<Duration, O>;
    },
  };
}

function createSchema(): Scalar<Duration> {
  function unmarshal(v: string): Duration {
    try {
      return Duration.from(v);
    } catch {
      throw new Error("must be an ISO 8601 duration");
    }
  }

  return createScalar("ISO 8601 duration", toString, unmarshal);
}

function buildExamples(
  schema: Scalar<Duration>,
  def: Maybe<Duration | undefined>
): Examples {
  let defExample: Example | undefined;

  if (def.isDefined && typeof def.value !== "undefined") {
    defExample = {
      canonical: schema.marshal(def.value),
      description: "(default)",
    };
  }

  return createExamples(
    defExample,
    {
      canonical: Duration.from({ minutes: 1, seconds: 30 }).toString(),
      description: "ISO 8601 duration",
    },
    {
      canonical: Duration.from({ months: 1, days: 15, hours: 12 }).toString(),
      description: "ISO 8601 duration",
    }
  );
}
