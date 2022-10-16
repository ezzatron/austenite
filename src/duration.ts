import { Temporal } from "@js-temporal/polyfill";
import {
  Declaration,
  DeclarationOptions,
  defaultFromOptions,
  Value,
} from "./declaration";
import { registerVariable } from "./environment";
import { createExamples, Example, Examples } from "./example";
import { Maybe, resolveMaybe } from "./maybe";
import { createScalar, Scalar, toString } from "./schema";

const { Duration } = Temporal;
type DurationInstance = InstanceType<typeof Duration>;

export type DurationOptions = DeclarationOptions<DurationInstance>;

export function duration<O extends DurationOptions>(
  name: string,
  description: string,
  options: O = {} as O
): Declaration<DurationInstance, O> {
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
      return resolveMaybe(v.nativeValue()) as Value<DurationInstance, O>;
    },
  };
}

function createSchema(): Scalar<DurationInstance> {
  function unmarshal(v: string): DurationInstance {
    try {
      return Duration.from(v);
    } catch {
      throw new Error("must be an ISO 8601 duration");
    }
  }

  return createScalar("ISO 8601 duration", toString, unmarshal);
}

function buildExamples(
  schema: Scalar<DurationInstance>,
  def: Maybe<DurationInstance | undefined>
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
