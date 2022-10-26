import ipaddr from "ipaddr.js";
import {
  Declaration,
  defaultFromOptions,
  Options as DeclarationOptions,
  Value,
} from "../declaration.js";
import { registerVariable } from "../environment.js";
import { normalize } from "../error.js";
import { create as createExamples, Example } from "../example.js";
import { map, Maybe, resolve } from "../maybe.js";
import { createScalar, createString, Scalar, toString } from "../schema.js";
import { Variable } from "../variable.js";

export interface KubernetesAddress {
  readonly host: string;
  readonly port: number;
}

export interface Options extends DeclarationOptions<KubernetesAddress> {
  readonly portName?: string;
}

export function kubernetesAddress<O extends Options>(
  name: string,
  options: O = {} as O
): Declaration<KubernetesAddress, O> {
  const { portName } = options;
  const def = defaultFromOptions(options);

  const hostVar = registerHost(name, def);
  const hName = hostVar.spec.name;
  const portVar = registerPort(name, def, portName);
  const pName = portVar.spec.name;

  return {
    value() {
      const host = resolve(hostVar.nativeValue());
      const port = resolve(portVar.nativeValue());

      if (host != null && port != null) return { host, port };

      if (host != null) throw new PartiallyDefinedError(hName, pName);
      if (port != null) throw new PartiallyDefinedError(pName, hName);

      return undefined as Value<KubernetesAddress, O>;
    },
  };
}

function registerHost(
  name: string,
  def: Maybe<KubernetesAddress | undefined>
): Variable<string> {
  const hostDef = map(def, (address) => address?.host);
  const schema = createString("hostname");
  let defExample: Example | undefined;

  if (hostDef.isDefined && typeof hostDef.value !== "undefined") {
    defExample = {
      canonical: schema.marshal(hostDef.value),
      description: "(default)",
    };
  }

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
    schema,
    examples: createExamples(
      defExample,
      {
        canonical: "service.example.org",
        description: "a hostname",
      },
      {
        canonical: "10.0.0.11",
        description: "an IP address",
      }
    ),
    constraint: validateHost,
  });
}

function validateHost(host: string): void {
  if (host === "") throw new Error("must not be empty");

  if (ipaddr.isValid(host)) return;

  if (host.includes(" ")) {
    throw new Error("must not contain whitespace");
  }
  if (host.includes(":")) {
    throw new Error(
      "must not contain a colon (:) unless part of an IPv6 address"
    );
  }
  if (host.startsWith(".") || host.endsWith(".")) {
    throw new Error("must not begin or end with a dot");
  }
}

function registerPort(
  name: string,
  def: Maybe<KubernetesAddress | undefined>,
  portName?: string
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
  let defExample: Example | undefined;

  if (portDef.isDefined && typeof portDef.value !== "undefined") {
    defExample = {
      canonical: schema.marshal(portDef.value),
      description: "(default)",
    };
  }

  return registerVariable({
    name: varName,
    description,
    default: portDef,
    schema,
    examples: createExamples(defExample, {
      canonical: "12345",
      description: "a port number",
    }),
    constraint: validatePort,
  });
}

function createPortSchema(): Scalar<number> {
  function unmarshal(v: string): number {
    if (!/^\d*$/.test(v)) throw new Error("must be an unsigned integer");
    if (v !== "0" && v.startsWith("0")) {
      throw new Error("must not have leading zeros");
    }

    return Number(v);
  }

  return createScalar("port number", toString, unmarshal);
}

function validatePort(port: number): void {
  if (!Number.isInteger(port) || port < 0) {
    throw new Error("must be an unsigned integer");
  }
  if (port < 1 || port > 65535) throw new Error("must be between 1 and 65535");
}

function nameToEnv(name: string): string {
  if (name === "") throw new Error("must not be empty");
  if (name.startsWith("-") || name.endsWith("-")) {
    throw new Error("must not begin or end with a hyphen");
  }
  if (!/^[a-z0-9-]+$/.test(name)) {
    throw new Error(
      "must contain only lowercase ASCII letters, digits and hyphen"
    );
  }

  return name.replaceAll("-", "_").toUpperCase();
}

class InvalidServiceNameError extends Error {
  constructor(name: string, cause: Error) {
    const quotedName = JSON.stringify(name);

    super(
      `specification for Kubernetes service address is invalid: service name (${quotedName}): ${cause.message}`
    );
  }
}

class InvalidPortNameError extends Error {
  constructor(name: string, portName: string, cause: Error) {
    const quotedName = JSON.stringify(portName);

    super(
      `specification for Kubernetes ${name} service address is invalid: port name (${quotedName}): ${cause.message}`
    );
  }
}

class PartiallyDefinedError extends Error {
  constructor(def: string, undef: string) {
    super(`${def} is defined but ${undef} is not, define both or neither`);
  }
}
