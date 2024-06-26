# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                                                        | Usage    | Description                             |
| :---------------------------------------------------------- | :------- | :-------------------------------------- |
| [`REDIS_PRIMARY_SERVICE_HOST`](#redis_primary_service_host) | Required | Kubernetes `redis-primary` service host |
| [`REDIS_PRIMARY_SERVICE_PORT`](#redis_primary_service_port) | Required | Kubernetes `redis-primary` service port |

<!-- prettier-ignore-start -->

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if that variable isn't set.

<!-- prettier-ignore-end -->

## `REDIS_PRIMARY_SERVICE_HOST`

_Kubernetes `redis-primary` service host_

The `REDIS_PRIMARY_SERVICE_HOST` variable is a **required** variable that takes
**hostname** values.

### Example values

```sh
export REDIS_PRIMARY_SERVICE_HOST=redis.example.org # remote
```

```sh
export REDIS_PRIMARY_SERVICE_HOST=redis.localhost # local
```

## `REDIS_PRIMARY_SERVICE_PORT`

_Kubernetes `redis-primary` service port_

The `REDIS_PRIMARY_SERVICE_PORT` variable is a **required** variable that takes
**port number** values.

### Example values

```sh
export REDIS_PRIMARY_SERVICE_PORT=6379 # standard
```

```sh
export REDIS_PRIMARY_SERVICE_PORT=6380 # alternate
```
