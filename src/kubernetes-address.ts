import {
  Declaration,
  DeclarationOptions,
  defaultFromOptions,
  Value,
} from "./declaration";
import { registerVariable } from "./environment";
import { createExamples, Example } from "./example";
import { mapMaybe, Maybe, resolveMaybe } from "./maybe";
import { createString, createUnsignedInteger } from "./schema";
import { Variable, VariableSpec } from "./variable";

export interface KubernetesAddress {
  readonly host: string;
  readonly port: number;
}

export interface KubernetesAddressOptions
  extends DeclarationOptions<KubernetesAddress> {
  readonly portName?: string;
}

export function kubernetesAddress<O extends KubernetesAddressOptions>(
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
      const host = resolveMaybe(hostVar.nativeValue());
      const port = resolveMaybe(portVar.nativeValue());

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
  const hostDef = mapMaybe(def, (address) => address?.host);
  const schema = createString();
  let defExample: Example<string> | undefined;

  if (hostDef.isDefined && typeof hostDef.value !== "undefined") {
    defExample = {
      canonical: schema.marshal(hostDef.value),
      native: hostDef.value,
      description: "(default)",
    };
  }

  return registerVariable({
    name: `${kubernetesNameToEnv(name)}_SERVICE_HOST`,
    description: `kubernetes ${JSON.stringify(name)} service host`,
    default: hostDef,
    schema,
    examples: createExamples(
      defExample,
      {
        canonical: "service.example.org",
        native: "service.example.org",
        description: "a hostname",
      },
      {
        canonical: "10.0.0.11",
        native: "10.0.0.11",
        description: "an IP address",
      }
    ),
    constraint: validateHost,
  });
}

function registerPort(
  name: string,
  def: Maybe<KubernetesAddress | undefined>,
  portName?: string
): Variable<number> {
  const envName = kubernetesNameToEnv(name);
  const quotedName = JSON.stringify(name);
  let varName: string, description: string;

  if (typeof portName === "string") {
    const envPortName = kubernetesNameToEnv(portName);
    const quotedPortName = JSON.stringify(portName);

    varName = `${envName}_SERVICE_PORT_${envPortName}`;
    description = `kubernetes ${quotedName} service ${quotedPortName} port`;
  } else {
    varName = `${envName}_SERVICE_PORT`;
    description = `kubernetes ${quotedName} service port`;
  }

  const portDef = mapMaybe(def, (service) => service?.port);
  const schema = createUnsignedInteger(1, 65535);
  let defExample: Example<number> | undefined;

  if (portDef.isDefined && typeof portDef.value !== "undefined") {
    defExample = {
      canonical: schema.marshal(portDef.value),
      native: portDef.value,
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
      native: 12345,
      description: "a port number",
    }),
  });
}

function validateHost(_: VariableSpec<string>, host: string): void {
  if (host.includes(" ")) {
    throw new Error("must not contain whitespace");
  }
  if (host.includes(":")) {
    throw new Error("must not contain a colon (:)");
  }
  if (host.startsWith(".") || host.endsWith(".")) {
    throw new Error("must not begin or end with a dot");
  }
}

function kubernetesNameToEnv(name: string): string {
  return name.replaceAll("-", "_").toUpperCase();
}

class PartiallyDefinedError extends Error {
  constructor(def: string, undef: string) {
    super(`${def} is defined but ${undef} is not, define both or neither`);
  }
}