import { initialize } from "austenite/node";
import {
  cdnUrl,
  earthAtomCount,
  grpcTimeout,
  isDebug,
  logLevel,
  port,
  readDsn,
  redisPrimary,
  sampleRatio,
  sessionKey,
  weight,
} from "./env.js";

await initialize();

console.log("");
console.log("Environment is valid 🎉");
console.log("");

console.table({
  cdnUrl: cdnUrl.value().toString(),
  earthAtomCount: earthAtomCount.value(),
  grpcTimeout: grpcTimeout.value()?.total("millisecond"),
  isDebug: isDebug.value(),
  logLevel: logLevel.value(),
  port: port.value(),
  readDsn: readDsn.value(),
  redisPrimary: `${redisPrimary.value().host}:${redisPrimary.value().port}`,
  sampleRatio: sampleRatio.value(),
  sessionKey: sessionKey.value().toString("base64"),
  weight: weight.value(),
});
