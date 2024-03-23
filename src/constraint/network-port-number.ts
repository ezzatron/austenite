import { Constraint } from "../constraint.js";

export function createNetworkPortNumberConstraint(): Constraint<number> {
  return {
    isExtrinsic: false,
    description: "must be a network port number",
    constrain: function constrainPortNumber(port) {
      if (!Number.isInteger(port) || port < 0) {
        return "must be an unsigned integer";
      }

      if (port < 1 || port > 65535) {
        return "must be between 1 and 65535";
      }
    },
  };
}
