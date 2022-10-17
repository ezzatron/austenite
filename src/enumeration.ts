import {
  Declaration,
  defaultFromOptions,
  Options as DeclarationOptions,
  Value,
} from "./declaration";
import { registerVariable } from "./environment";
import { create as createExamples, Examples } from "./example";
import { Maybe, resolve } from "./maybe";
import { createEnum, Enum, InvalidEnumError } from "./schema";
import { SpecError } from "./variable";

export type Members<T> = Record<string, Member<T>>;

export interface Member<T> {
  value: T;
  description: string;
}

export type Options<T> = DeclarationOptions<T>;

export function enumeration<T, O extends Options<T>>(
  name: string,
  description: string,
  members: Members<T>,
  options: O = {} as O
): Declaration<T, O> {
  const def = defaultFromOptions(options);
  const schema = createSchema(name, members);

  const v = registerVariable({
    name,
    description,
    default: def,
    schema,
    examples: buildExamples(members, schema, def),
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

function buildExamples<T>(
  members: Members<T>,
  schema: Enum<T>,
  def: Maybe<T | undefined>
): Examples {
  const defValue = def.isDefined ? def.value : undefined;

  return createExamples(
    ...Object.entries(members).map(([literal, { value, description }]) => ({
      canonical: literal,
      description:
        defValue === value ? `${description} (default)` : description,
    }))
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
