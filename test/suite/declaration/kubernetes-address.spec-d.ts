import {
  KubernetesAddress,
  kubernetesAddress,
  type Declaration,
} from "austenite";
import { initialize } from "austenite/node";
import { describe, expectTypeOf, it } from "vitest";
import { noop } from "../../helpers.js";

describe("Kubernetes address declarations", () => {
  describe("when the declaration is required", () => {
    it("returns a required kubernetes address declaration", () => {
      const declaration = kubernetesAddress("austenite-svc");

      expectTypeOf(declaration).toEqualTypeOf<Declaration<KubernetesAddress>>();
    });

    describe(".value()", () => {
      it("returns a kubernetes address", async () => {
        const declaration = kubernetesAddress("austenite-svc");

        process.env.AUSTENITE_SVC_SERVICE_HOST = "host.example.org";
        process.env.AUSTENITE_SVC_SERVICE_PORT = "12345";
        await initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<KubernetesAddress>();
      });
    });
  });

  describe("when the declaration is optional", () => {
    it("returns an optional kubernetes address declaration", () => {
      const declaration = kubernetesAddress("austenite-svc", {
        default: undefined,
      });

      expectTypeOf(declaration).toEqualTypeOf<
        Declaration<KubernetesAddress | undefined>
      >();
    });

    describe(".value()", () => {
      it("returns an optional kubernetes address", async () => {
        const declaration = kubernetesAddress("austenite-svc", {
          default: undefined,
        });

        await initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<KubernetesAddress | undefined>();
      });
    });
  });

  describe("when valid options are specified", () => {
    it("does not allow unknown options", () => {
      const declaration = kubernetesAddress(
        "austenite-svc",
        // @ts-expect-error - unknown option
        {
          default: undefined,
          unknown: "unknown",
        },
      );

      expectTypeOf(declaration).toBeObject();
    });
  });
});
