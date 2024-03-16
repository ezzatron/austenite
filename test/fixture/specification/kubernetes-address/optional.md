# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                                                        | Usage    | Description                             |
| :---------------------------------------------------------- | :------- | :-------------------------------------- |
| [`REDIS_PRIMARY_SERVICE_HOST`](#REDIS_PRIMARY_SERVICE_HOST) | Optional | Kubernetes `redis-primary` service host |
| [`REDIS_PRIMARY_SERVICE_PORT`](#REDIS_PRIMARY_SERVICE_PORT) | Optional | Kubernetes `redis-primary` service port |

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if
> that variable isn't set.

## `REDIS_PRIMARY_SERVICE_HOST`

_Kubernetes `redis-primary` service host_

The `REDIS_PRIMARY_SERVICE_HOST` variable is an **optional** variable
that takes **hostname** values.

### Example values

```sh
export REDIS_PRIMARY_SERVICE_HOST=service.example.org # a hostname
```

```sh
export REDIS_PRIMARY_SERVICE_HOST=10.0.0.11 # an IP address
```

## `REDIS_PRIMARY_SERVICE_PORT`

_Kubernetes `redis-primary` service port_

The `REDIS_PRIMARY_SERVICE_PORT` variable is an **optional** variable
that takes **port number** values.

### Example values

```sh
export REDIS_PRIMARY_SERVICE_PORT=12345 # a port number
```
