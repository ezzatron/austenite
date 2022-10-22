import { initialize, kubernetesAddress, KubernetesAddress } from "../../../src";
import { Declaration } from "../../../src/declaration";
import { Options } from "../../../src/declaration/kubernetes-address";
import { reset } from "../../../src/environment";
import { hasType, noop } from "../../helpers";

const invalidHostValueTable = [
  [
    "leading dot",
    ".host.example.org",
    `value of AUSTENITE_SVC_SERVICE_HOST (.host.example.org) is invalid: must not begin or end with a dot`,
  ],
  [
    "trailing dot",
    "host.example.org.",
    `value of AUSTENITE_SVC_SERVICE_HOST (host.example.org.) is invalid: must not begin or end with a dot`,
  ],
  [
    "whitespace",
    "host.examp le.org",
    `value of AUSTENITE_SVC_SERVICE_HOST ('host.examp le.org') is invalid: must not contain whitespace`,
  ],
  [
    "full address",
    "host.example.org:12345",
    `value of AUSTENITE_SVC_SERVICE_HOST (host.example.org\\:12345) is invalid: must not contain a colon (:) unless part of an IPv6 address`,
  ],
];

const invalidPortValueTable = [
  [
    "non-numeric",
    "host.example.org",
    "value of AUSTENITE_SVC_SERVICE_PORT (host.example.org) is invalid: must be an unsigned integer",
  ],
  [
    "non-integer",
    "123.456",
    "value of AUSTENITE_SVC_SERVICE_PORT (123.456) is invalid: must be an unsigned integer",
  ],
  [
    "negative sign",
    "-1",
    "value of AUSTENITE_SVC_SERVICE_PORT (-1) is invalid: must be an unsigned integer",
  ],
  [
    "positive sign",
    "+1",
    "value of AUSTENITE_SVC_SERVICE_PORT (+1) is invalid: must be an unsigned integer",
  ],
  [
    "leading zero",
    "01234",
    "value of AUSTENITE_SVC_SERVICE_PORT (01234) is invalid: must not have leading zeros",
  ],
  [
    "zero",
    "0",
    "value of AUSTENITE_SVC_SERVICE_PORT (0) is invalid: must be between 1 and 65535",
  ],
  [
    "above max",
    "65536",
    "value of AUSTENITE_SVC_SERVICE_PORT (65536) is invalid: must be between 1 and 65535",
  ],
];

const invalidK8sNameTable = [
  ["empty", "", '(""): must not be empty'],
  [
    "starts with a hyphen",
    "-foo",
    '("-foo"): must not begin or end with a hyphen',
  ],
  [
    "ends with a hyphen",
    "foo-",
    '("foo-"): must not begin or end with a hyphen',
  ],
  [
    "contains an invalid character",
    "foo*bar",
    '("foo*bar"): must contain only lowercase ASCII letters, digits and hyphen',
  ],
  [
    "contains an uppercase character",
    "fooBar",
    '("fooBar"): must contain only lowercase ASCII letters, digits and hyphen',
  ],
];

describe("Kubernetes address declarations", () => {
  const def = {
    host: "default.example.org",
    port: 54321,
  };

  let declaration: Declaration<KubernetesAddress, Options>;
  let env: typeof process.env;

  beforeEach(() => {
    jest.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never;
    });

    env = process.env;
    process.env = {};
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
      }).toThrow(
        "AUSTENITE_SVC_SERVICE_HOST is undefined and does not have a default value"
      );
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
      }).toThrow(
        "AUSTENITE_SVC_SERVICE_HOST is undefined and does not have a default value"
      );
    });
  });

  describe.each(invalidK8sNameTable)(
    "when the service name is invalid (%s)",
    (_, name: string, expected: string) => {
      it("throws", () => {
        expect(() => {
          kubernetesAddress(name);
        }).toThrow(
          `specification for Kubernetes service address is invalid: service name ${expected}`
        );
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

    describe.each`
      host                  | port
      ${"host.example.org"} | ${"1"}
      ${"host.example.org"} | ${"65535"}
    `(
      "when the host and port are valid ($host:$port)",
      ({ host, port }: { host: string; port: string }) => {
        beforeEach(() => {
          process.env.AUSTENITE_SVC_SERVICE_HOST = host;
          process.env.AUSTENITE_SVC_SERVICE_PORT = port;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toEqual({
              host,
              port: Number(port),
            });
          });

          it("returns the same value when called multiple times", () => {
            const expected = {
              host,
              port: Number(port),
            };

            expect(declaration.value()).toEqual(expected);
            expect(declaration.value()).toEqual(expected);
          });
        });
      }
    );

    describe.each(invalidHostValueTable)(
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

    describe.each(invalidPortValueTable)(
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
          }).toThrow(
            "AUSTENITE_SVC_SERVICE_HOST is undefined and does not have a default value"
          );
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
          }).toThrow(
            "AUSTENITE_SVC_SERVICE_PORT is undefined and does not have a default value"
          );
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
          }).toThrow(
            "AUSTENITE_SVC_SERVICE_HOST is undefined and does not have a default value"
          );
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

    describe.each`
      host                  | port
      ${"host.example.org"} | ${"1"}
      ${"host.example.org"} | ${"65535"}
    `(
      "when the host and port are valid ($host:$port)",
      ({ host, port }: { host: string; port: string }) => {
        beforeEach(() => {
          process.env.AUSTENITE_SVC_SERVICE_HOST = host;
          process.env.AUSTENITE_SVC_SERVICE_PORT = port;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toEqual({
              host,
              port: Number(port),
            });
          });
        });
      }
    );

    describe.each(invalidHostValueTable)(
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

    describe.each(invalidPortValueTable)(
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
          }).toThrow(
            `specification for Kubernetes austenite-svc service address is invalid: port name ${expected}`
          );
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

  describe.each`
    description       | host                        | expected
    ${"empty"}        | ${""}                       | ${"must not be empty"}
    ${"leading dot"}  | ${".host.example.org"}      | ${"must not begin or end with a dot"}
    ${"trailing dot"} | ${"host.example.org."}      | ${"must not begin or end with a dot"}
    ${"whitespace"}   | ${"host.examp le.org"}      | ${"must not contain whitespace"}
    ${"full address"} | ${"host.example.org:12345"} | ${"must not contain a colon (:) unless part of an IPv6 address"}
  `(
    "when using an invalid default host ($description)",
    ({ host, expected }: { host: string; expected: string }) => {
      it("throws", () => {
        expect(() => {
          kubernetesAddress("austenite-svc", {
            default: {
              host,
              port: def.port,
            },
          });
        }).toThrow(
          `specification for AUSTENITE_SVC_SERVICE_HOST is invalid: default value: ${expected}`
        );
      });
    }
  );

  describe.each`
    description | port
    ${"min"}    | ${1}
    ${"max"}    | ${65535}
  `(
    "when using a valid default port ($description)",
    ({ port }: { port: number }) => {
      it("does not throw", () => {
        expect(() => {
          kubernetesAddress("austenite-svc", {
            default: {
              host: def.host,
              port,
            },
          });
        }).not.toThrow();
      });
    }
  );

  describe.each`
    description      | port       | expected
    ${"non-integer"} | ${123.456} | ${"must be an unsigned integer"}
    ${"negative"}    | ${-1}      | ${"must be an unsigned integer"}
    ${"zero"}        | ${0}       | ${"must be between 1 and 65535"}
    ${"above max"}   | ${65536}   | ${"must be between 1 and 65535"}
  `(
    "when using an invalid default port ($description)",
    ({ port, expected }: { port: number; expected: string }) => {
      it("throws", () => {
        expect(() => {
          kubernetesAddress("austenite-svc", {
            default: {
              host: def.host,
              port,
            },
          });
        }).toThrow(
          `specification for AUSTENITE_SVC_SERVICE_PORT is invalid: default value: ${expected}`
        );
      });
    }
  );
});
