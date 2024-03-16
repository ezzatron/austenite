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
import { Enum, InvalidEnumError, createEnum } from "../schema.js";
import { SpecError } from "../variable.js";

export type Members<T> = Record<string, Member<T>>;

export type Member<T> = {
  readonly value: T;
  readonly description: string;
};

export type Options<T> = DeclarationOptions<T>;

export function enumeration<T, O extends Options<T>>(
  name: string,
  description: string,
  members: Members<T>,
  options: ExactOptions<O, Options<T>> = {} as ExactOptions<O, Options<T>>,
): Declaration<T, O> {
  const { isSensitive = false } = options;
  const def = defaultFromOptions(options);
  const schema = createSchema(name, members);

  const v = registerVariable({
    name,
    description,
    default: def,
    isSensitive,
    schema,
    examples: buildExamples(members),
  });

  return {
    value() {
      return resolve(v.nativeValue()) as Value<T, O>;
    },
  };
}

function createSchema<T>(name: string, members: Members<T>): Enum<T> {
  const entries = Object.entries(members);

  if (entries.length < 2) throw new InsufficientMembersError(name);

  const schemaMembers: Record<string, T> = {};
  const mapping = new Map<T, string>();

  for (const [literal, member] of entries) {
    if (literal === "") throw new EmptyMemberError(name);

    schemaMembers[literal] = member.value;
    mapping.set(member.value, literal);
  }

  function marshal(v: T): string {
    return mapping.get(v) as string;
  }

  function unmarshal(v: string): T {
    if (v in members) return members[v].value;

    throw new InvalidEnumError(members);
  }

  return createEnum(schemaMembers, marshal, unmarshal);
}

function buildExamples<T>(members: Members<T>): Examples {
  return createExamples(
    ...Object.entries(members).map(([literal, { description }]) => ({
      canonical: literal,
      description,
    })),
  );
}

class EmptyMemberError extends SpecError {
  constructor(name: string) {
    super(name, new Error("members can not be empty strings"));
  }
}

class InsufficientMembersError extends SpecError {
  constructor(name: string) {
    super(name, new Error("must have at least 2 members"));
  }
}
