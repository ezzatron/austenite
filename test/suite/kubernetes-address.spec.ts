import { initialize, kubernetesAddress } from "../../src";
import { Declaration } from "../../src/declaration";
import { reset } from "../../src/environment";
import {
  KubernetesAddress,
  KubernetesAddressOptions,
} from "../../src/kubernetes-address";
import { hasType, noop } from "../helpers";

const invalidHostTable = [
  ["leading dot", ".host.example.org", "must not begin or end with a dot"],
  ["trailing dot", "host.example.org.", "must not begin or end with a dot"],
  ["whitespace", "host.examp le.org", "must not contain whitespace"],
  [
    "full address",
    "host.example.org:12345",
    "must not contain a colon (:) unless part of an IPv6 address",
  ],
];

const invalidPortStringTable = [
  ["non-numeric", "host.example.org", "must be an unsigned integer"],
  ["non-integer", "123.456", "must be an unsigned integer"],
  ["negative sign", "-1", "must be an unsigned integer"],
  ["positive sign", "+1", "must be an unsigned integer"],
  ["leading zero", "01234", "must not have leading zeros"],
  ["zero", "0", "must be between 1 and 65535"],
  ["above max", "65536", "must be between 1 and 65535"],
];

const invalidPortNumberTable = [
  ["non-integer", 123.456, "must be an unsigned integer"],
  ["negative", -1, "must be an unsigned integer"],
  ["zero", 0, "must be between 1 and 65535"],
  ["above max", 65536, "must be between 1 and 65535"],
] as const;

const invalidK8sNameTable = [
  ["empty", "", "must not be empty"],
  ["starts with a hyphen", "-foo", "must not begin or end with a hyphen"],
  ["ends with a hyphen", "foo-", "must not begin or end with a hyphen"],
  [
    "contains an invalid character",
    "foo*bar",
    "must contain only lowercase ASCII letters, digits and hyphen",
  ],
  [
    "contains an uppercase character",
    "fooBar",
    "must contain only lowercase ASCII letters, digits and hyphen",
  ],
];

describe("Kubernetes address declarations", () => {
  const def = {
    host: "default.example.org",
    port: 54321,
  };

  let declaration: Declaration<KubernetesAddress, KubernetesAddressOptions>;
  let env: typeof process.env;

  beforeEach(() => {
    env = process.env;
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
    reset();
  });

  describe("when no options are supplied", () => {
    beforeEach(() => {
      declaration = kubernetesAddress("austenite-svc");

      initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow("undefined");
    });
  });

  describe("when empty options are supplied", () => {
    beforeEach(() => {
      declaration = kubernetesAddress("austenite-svc", {});

      initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow("undefined");
    });
  });

  describe.each(invalidK8sNameTable)(
    "when the service name is invalid (%s)",
    (_, name: string, expected: string) => {
      it("throws", () => {
        expect(() => {
          kubernetesAddress(name);
        }).toThrow(expected);
      });
    }
  );

  describe("when the declaration is required", () => {
    beforeEach(() => {
      declaration = kubernetesAddress("austenite-svc");
    });

    describe(".value()", () => {
      it("returns a kubernetes address", () => {
        // this test is weird because it tests type inference
        const declaration = kubernetesAddress("austenite-svc");

        process.env.AUSTENITE_SVC_SERVICE_HOST = "host.example.org";
        process.env.AUSTENITE_SVC_SERVICE_PORT = "12345";
        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expect(hasType<KubernetesAddress, typeof actual>(actual)).toBeNull();
      });
    });

    describe("when the host and port are valid", () => {
      beforeEach(() => {
        process.env.AUSTENITE_SVC_SERVICE_HOST = "host.example.org";
        process.env.AUSTENITE_SVC_SERVICE_PORT = "12345";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toEqual({
            host: "host.example.org",
            port: 12345,
          });
        });
      });
    });

    describe.each(invalidHostTable)(
      "when the host is invalid (%s)",
      (_, value: string, expected: string) => {
        beforeEach(() => {
          process.env.AUSTENITE_SVC_SERVICE_HOST = value;
          process.env.AUSTENITE_SVC_SERVICE_PORT = "12345";

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(expected);
          });
        });
      }
    );

    describe.each(invalidPortStringTable)(
      "when the port is invalid (%s)",
      (_, value: string, expected: string) => {
        beforeEach(() => {
          process.env.AUSTENITE_SVC_SERVICE_HOST = "host.example.org";
          process.env.AUSTENITE_SVC_SERVICE_PORT = value;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(expected);
          });
        });
      }
    );

    describe("when the host is empty", () => {
      beforeEach(() => {
        process.env.AUSTENITE_SVC_SERVICE_PORT = "12345";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow("undefined");
        });
      });
    });

    describe("when the port is empty", () => {
      beforeEach(() => {
        process.env.AUSTENITE_SVC_SERVICE_HOST = "host.example.org";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow("undefined");
        });
      });
    });

    describe("when the host and port are empty", () => {
      beforeEach(() => {
        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow("undefined");
        });
      });
    });
  });

  describe("when the declaration is optional", () => {
    beforeEach(() => {
      declaration = kubernetesAddress("austenite-svc", {
        default: undefined,
      });
    });

    describe(".value()", () => {
      it("returns an optional boolean value", () => {
        // this test is weird because it tests type inference
        const declaration = kubernetesAddress("austenite-svc", {
          default: undefined,
        });

        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expect(
          hasType<KubernetesAddress | undefined, typeof actual>(actual)
        ).toBeNull();
      });
    });

    describe("when the host and port are valid", () => {
      beforeEach(() => {
        process.env.AUSTENITE_SVC_SERVICE_HOST = "host.example.org";
        process.env.AUSTENITE_SVC_SERVICE_PORT = "12345";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toEqual({
            host: "host.example.org",
            port: 12345,
          });
        });
      });
    });

    describe.each(invalidHostTable)(
      "when the host is invalid (%s)",
      (_, value: string, expected: string) => {
        beforeEach(() => {
          process.env.AUSTENITE_SVC_SERVICE_HOST = value;
          process.env.AUSTENITE_SVC_SERVICE_PORT = "12345";

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(expected);
          });
        });
      }
    );

    describe.each(invalidPortStringTable)(
      "when the port is invalid (%s)",
      (_, value: string, expected: string) => {
        beforeEach(() => {
          process.env.AUSTENITE_SVC_SERVICE_HOST = "host.example.org";
          process.env.AUSTENITE_SVC_SERVICE_PORT = value;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(expected);
          });
        });
      }
    );

    describe("when the host is empty", () => {
      beforeEach(() => {
        process.env.AUSTENITE_SVC_SERVICE_PORT = "12345";
      });

      describe("when there is a default value", () => {
        beforeEach(() => {
          declaration = kubernetesAddress("austenite-svc", {
            default: def,
          });

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns a value with the default host", () => {
            expect(declaration.value()).toEqual({
              host: def.host,
              port: 12345,
            });
          });
        });
      });

      describe("when there is no default value", () => {
        beforeEach(() => {
          declaration = kubernetesAddress("austenite-svc", {
            default: undefined,
          });

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => declaration.value()).toThrow(
              "AUSTENITE_SVC_SERVICE_PORT is defined but AUSTENITE_SVC_SERVICE_HOST is not, define both or neither"
            );
          });
        });
      });
    });

    describe("when the port is empty", () => {
      beforeEach(() => {
        process.env.AUSTENITE_SVC_SERVICE_HOST = "host.example.org";
      });

      describe("when there is a default value", () => {
        beforeEach(() => {
          declaration = kubernetesAddress("austenite-svc", {
            default: def,
          });

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns a value with the default port", () => {
            expect(declaration.value()).toEqual({
              host: "host.example.org",
              port: def.port,
            });
          });
        });
      });

      describe("when there is no default value", () => {
        beforeEach(() => {
          declaration = kubernetesAddress("austenite-svc", {
            default: undefined,
          });

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => declaration.value()).toThrow(
              "AUSTENITE_SVC_SERVICE_HOST is defined but AUSTENITE_SVC_SERVICE_PORT is not, define both or neither"
            );
          });
        });
      });
    });

    describe("when the host and port are empty", () => {
      describe("when there is a default value", () => {
        beforeEach(() => {
          declaration = kubernetesAddress("austenite-svc", {
            default: def,
          });

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the default", () => {
            expect(declaration.value()).toEqual(def);
          });
        });
      });

      describe("when there is no default value", () => {
        beforeEach(() => {
          declaration = kubernetesAddress("austenite-svc", {
            default: undefined,
          });

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns undefined", () => {
            expect(declaration.value()).toBeUndefined();
          });
        });
      });
    });
  });

  describe("when using a named port", () => {
    beforeEach(() => {
      declaration = kubernetesAddress("austenite-svc", {
        portName: "austenite-prt",
      });
    });

    describe.each(invalidK8sNameTable)(
      "when the port name is invalid (%s)",
      (_, portName: string, expected: string) => {
        it("throws", () => {
          expect(() => {
            kubernetesAddress("austenite-svc", {
              portName,
            });
          }).toThrow(expected);
        });
      }
    );

    describe("when the host and port are valid", () => {
      beforeEach(() => {
        process.env.AUSTENITE_SVC_SERVICE_HOST = "host.example.org";
        process.env.AUSTENITE_SVC_SERVICE_PORT_AUSTENITE_PRT = "12345";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toEqual({
            host: "host.example.org",
            port: 12345,
          });
        });
      });
    });
  });

  describe.each`
    description               | host
    ${"IPv4"}                 | ${"192.168.1.2"}
    ${"IPv6"}                 | ${"::1"}
    ${"unqualified DNS name"} | ${"svc-name"}
    ${"qualified DNS name"}   | ${"svc-name.example.org"}
  `(
    "when using a valid default host ($description)",
    ({ host }: { host: string }) => {
      it("does not throw", () => {
        expect(() => {
          kubernetesAddress("austenite-svc", {
            default: {
              host,
              port: def.port,
            },
          });
        }).not.toThrow();
      });
    }
  );

  describe.each(invalidHostTable)(
    "when using a invalid default host (%s)",
    (_, host: string, expected: string) => {
      it("throws", () => {
        expect(() => {
          kubernetesAddress("austenite-svc", {
            default: {
              host,
              port: def.port,
            },
          });
        }).toThrow(expected);
      });
    }
  );

  describe.each(invalidPortNumberTable)(
    "when using a invalid default port (%s)",
    (_, port: number, expected: string) => {
      it("throws", () => {
        expect(() => {
          kubernetesAddress("austenite-svc", {
            default: {
              host: def.host,
              port,
            },
          });
        }).toThrow(expected);
      });
    }
  );
});
