import { type IntrinsicConstraint } from "../constraint.js";

export function createIntegerConstraint(): IntrinsicConstraint<number> {
  return {
    constrain: function constrainInteger(v) {
      return Number.isInteger(v) ? undefined : "must be an integer";
    },
  };
}
