import { type ExtrinsicConstraint } from "../constraint.js";
import { createDisjunctionFormatter } from "../list.js";

export function createURLProtocolConstraint(
  protocols: string[],
): ExtrinsicConstraint<URL> {
  const listFormatter = createDisjunctionFormatter();
  const description = `protocol must be ${listFormatter.format(protocols)}`;

  return {
    description,
    constrain: function constrainURLProtocol({ protocol }) {
      if (!protocols.includes(protocol)) {
        return `${description}, but is ${protocol}`;
      }
    },
  };
}
