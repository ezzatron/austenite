import { type ExtrinsicConstraint } from "../constraint.js";
import { createDisjunctionFormatter } from "../list.js";

export function createURLProtocolConstraint(
  protocols: string[],
): ExtrinsicConstraint<URL> {
  const listFormatter = createDisjunctionFormatter();
  const inlineCodeProtocols = protocols.map((protocol) => `\`${protocol}\``);

  return {
    description: `protocol must be ${listFormatter.format(inlineCodeProtocols)}`,
    constrain: function constrainURLProtocol({ protocol }) {
      if (!protocols.includes(protocol)) {
        return (
          `protocol must be ${listFormatter.format(protocols)}, ` +
          `but is ${protocol}`
        );
      }
    },
  };
}
