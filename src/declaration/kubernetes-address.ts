import type { DeclarationConstraintOptions } from "../constraint.js";
import { createHostnameConstraint } from "../constraint/hostname.js";
import { createNetworkPortNumberConstraint } from "../constraint/network-port-number.js";
import {
  DeclarationFromOptions,
  Options as DeclarationOptions,
  defaultFromOptions,
  type ExactOptions,
  type Value,
} from "../declaration.js";
import { registerVariable, registerVariableComposite } from "../environment.js";
import { SpecError, normalize } from "../error.js";
import { resolveExamples, type Example } from "../example.js";
import { Maybe, map, resolve } from "../maybe.js";
import {
  ScalarSchema,
  createScalar,
  createString,
  toString,
} from "../schema.js";
import { Variable } from "../variable.js";

export type KubernetesAddress = {
  readonly host: string;
  readonly port: number;
};

export type Options = DeclarationOptions<KubernetesAddress> &
  DeclarationConstraintOptions<KubernetesAddress> & {
    readonly examples?: KubernetesAddressExamples;
    readonly portName?: string;
  };

type KubernetesAddressExamples = {
  readonly host?: Example<string>[];
  readonly port?: Example<number>[];
};

export function kubernetesAddress<O extends Options>(
  name: string,
  options: ExactOptions<O, Options> = {} as ExactOptions<O, Options>,
): DeclarationFromOptions<KubernetesAddress, O> {
  const {
    constraints: customConstraints = [],
    examples: { host: hostExamples, port: portExamples } = {},
    isSensitive = false,
    portName,
  } = options;

  const def = defaultFromOptions(options);

  const hostVar = registerHost(name, hostExamples, isSensitive, def);
  const portVar = registerPort(name, portExamples, isSensitive, def, portName);

  const composite = registerVariableComposite({
    variables: { host: hostVar, port: portVar },
    resolve: ({ host, port }) => ({ host, port }),
    constraints: [...customConstraints],
  });

  return {
    value() {
      return resolve(composite.value()) as Value<KubernetesAddress, O>;
    },
  };
}

function registerHost(
  name: string,
  examples: Example<string>[] | undefined,
  isSensitive: boolean,
  def: Maybe<KubernetesAddress | undefined>,
): Variable<string> {
  const hostDef = map(def, (address) => address?.host);
  const schema = createHostSchema();
  let envName: string;

  try {
    envName = nameToEnv(name);
  } catch (error) {
    throw new InvalidServiceNameError(name, normalize(error));
  }

  return registerVariable({
    name: `${envName}_SERVICE_HOST`,
    description: `kubernetes \`${name}\` service host`,
    default: hostDef,
    isSensitive,
    schema,
    examples: resolveExamples(name, schema, buildHostExamples, examples),
  });
}

function createHostSchema(): ScalarSchema<string> {
  return createString("hostname", [createHostnameConstraint()]);
}

function buildHostExamples(): Example<string>[] {
  return [
    {
      value: "service.example.org",
      label: "a hostname",
    },
    {
      value: "10.0.0.11",
      label: "an IP address",
    },
  ];
}

function registerPort(
  name: string,
  examples: Example<number>[] | undefined,
  isSensitive: boolean,
  def: Maybe<KubernetesAddress | undefined>,
  portName?: string,
): Variable<number> {
  const envName = nameToEnv(name);
  let varName: string, description: string;

  if (typeof portName === "string") {
    let envPortName: string;

    try {
      envPortName = nameToEnv(portName);
    } catch (error) {
      throw new InvalidPortNameError(name, portName, normalize(error));
    }

    varName = `${envName}_SERVICE_PORT_${envPortName}`;
    description = `kubernetes \`${name}\` service \`${portName}\` port`;
  } else {
    varName = `${envName}_SERVICE_PORT`;
    description = `kubernetes \`${name}\` service port`;
  }

  const portDef = map(def, (service) => service?.port);
  const schema = createPortSchema();

  return registerVariable({
    name: varName,
    description,
    default: portDef,
    isSensitive,
    schema,
    examples: resolveExamples(name, schema, buildPortExamples, examples),
  });
}

function createPortSchema(): ScalarSchema<number> {
  function unmarshal(v: string): number {
    if (!/^\d*$/.test(v)) throw new Error("must be an unsigned integer");
    if (v !== "0" && v.startsWith("0")) {
      throw new Error("must not have leading zeros");
    }

    return Number(v);
  }

  return createScalar("port number", toString, unmarshal, [
    createNetworkPortNumberConstraint(),
  ]);
}

function buildPortExamples(): Example<number>[] {
  return [
    {
      value: 12345,
      label: "a port number",
    },
  ];
}

function nameToEnv(name: string): string {
  if (name === "") throw new Error("must not be empty");
  if (name.startsWith("-") || name.endsWith("-")) {
    throw new Error("must not begin or end with a hyphen");
  }
  if (!/^[a-z0-9-]+$/.test(name)) {
    throw new Error(
      "must contain only lowercase ASCII letters, digits and hyphen",
    );
  }

  return name.replaceAll("-", "_").toUpperCase();
}

class InvalidServiceNameError extends SpecError {
  constructor(name: string, cause: Error) {
    const quotedName = JSON.stringify(name);

    super(
      "Kubernetes service address",
      new Error(`service name (${quotedName}): ${cause.message}`),
    );
  }
}

class InvalidPortNameError extends SpecError {
  constructor(name: string, portName: string, cause: Error) {
    const quotedName = JSON.stringify(portName);

    super(
      `Kubernetes ${name} service address`,
      new Error(`port name (${quotedName}): ${cause.message}`),
    );
  }
}
