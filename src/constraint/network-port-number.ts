import { type IntrinsicConstraint } from "../constraint.js";

export function createNetworkPortNumberConstraint(): IntrinsicConstraint<number> {
  return {
    constrain: function constrainNetworkPortNumber(port) {
      if (!Number.isInteger(port) || port < 0) {
        return "must be an unsigned integer";
      }

      if (port < 1 || port > 65535) {
        return "must be between 1 and 65535";
      }
    },
  };
}
