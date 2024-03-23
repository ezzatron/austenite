import ipaddr from "ipaddr.js";
import { Constraint } from "../constraint.js";

export function createHostnameConstraint(): Constraint<string> {
  return {
    isExtrinsic: false,
    description: "must be a hostname",
    constrain: function constrainHostname(hostname) {
      if (hostname === "") {
        return "must not be empty";
      }

      if (ipaddr.isValid(hostname)) return;

      if (hostname.includes(" ")) {
        return "must not contain whitespace";
      }

      if (hostname.includes(":")) {
        return "must not contain a colon (:) unless part of an IPv6 address";
      }

      if (hostname.startsWith(".") || hostname.endsWith(".")) {
        return "must not begin or end with a dot";
      }
    },
  };
}
