import ipaddr from "ipaddr.js";
import { type IntrinsicConstraint } from "../constraint.js";

export function createHostnameConstraint(): IntrinsicConstraint<string> {
  return {
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
