import { describe, expectTypeOf, it } from "vitest";
import {
  KubernetesAddress,
  initialize,
  kubernetesAddress,
} from "../../../src/index.js";
import { noop } from "../../helpers.js";

describe("Kubernetes address declarations", () => {
  describe("when the declaration is required", () => {
    describe(".value()", () => {
      it("returns a kubernetes address", () => {
        const declaration = kubernetesAddress("austenite-svc");

        process.env.AUSTENITE_SVC_SERVICE_HOST = "host.example.org";
        process.env.AUSTENITE_SVC_SERVICE_PORT = "12345";
        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<KubernetesAddress>();
      });
    });
  });

  describe("when the declaration is optional", () => {
    describe(".value()", () => {
      it("returns an optional kubernetes address", () => {
        const declaration = kubernetesAddress("austenite-svc", {
          default: undefined,
        });

        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<KubernetesAddress | undefined>();
      });
    });
  });
});
