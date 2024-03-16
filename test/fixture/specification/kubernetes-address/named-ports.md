# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                                                                                    | Usage    | Description                                             |
| :-------------------------------------------------------------------------------------- | :------- | :------------------------------------------------------ |
| [`REDIS_PRIMARY_SERVICE_HOST`](#REDIS_PRIMARY_SERVICE_HOST)                             | Required | Kubernetes `redis-primary` service host                 |
| [`REDIS_PRIMARY_SERVICE_PORT_DB`](#REDIS_PRIMARY_SERVICE_PORT_DB)                       | Required | Kubernetes `redis-primary` service `db` port            |
| [`REDIS_PRIMARY_SERVICE_PORT_OBSERVABILITY`](#REDIS_PRIMARY_SERVICE_PORT_OBSERVABILITY) | Required | Kubernetes `redis-primary` service `observability` port |

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if
> that variable isn't set.

## `REDIS_PRIMARY_SERVICE_HOST`

_Kubernetes `redis-primary` service host_

The `REDIS_PRIMARY_SERVICE_HOST` variable is a **required** variable
that takes **hostname** values.

### Example values

```sh
export REDIS_PRIMARY_SERVICE_HOST=service.example.org # a hostname
```

```sh
export REDIS_PRIMARY_SERVICE_HOST=10.0.0.11 # an IP address
```

## `REDIS_PRIMARY_SERVICE_PORT_DB`

_Kubernetes `redis-primary` service `db` port_

The `REDIS_PRIMARY_SERVICE_PORT_DB` variable is a **required** variable
that takes **port number** values.

### Example values

```sh
export REDIS_PRIMARY_SERVICE_PORT_DB=12345 # a port number
```

## `REDIS_PRIMARY_SERVICE_PORT_OBSERVABILITY`

_Kubernetes `redis-primary` service `observability` port_

The `REDIS_PRIMARY_SERVICE_PORT_OBSERVABILITY` variable is a **required** variable
that takes **port number** values.

### Example values

```sh
export REDIS_PRIMARY_SERVICE_PORT_OBSERVABILITY=12345 # a port number
```
