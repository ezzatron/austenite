import { initialize } from "../../../src/index.js";
import {
  cdnUrl,
  earthAtomCount,
  grpcTimeout,
  isDebug,
  logLevel,
  readDsn,
  redisPrimary,
  sampleRatio,
  weight,
} from "./env.js";

initialize();

console.log("");
console.log("Environment is valid 🎉");
console.log("");

console.table({
  cdnUrl: cdnUrl.value().toString(),
  earthAtomCount: earthAtomCount.value(),
  grpcTimeout: grpcTimeout.value().total("millisecond"),
  isDebug: isDebug.value(),
  logLevel: logLevel.value(),
  readDsn: readDsn.value(),
  redisPrimary: `${redisPrimary.value().host}:${redisPrimary.value().port}`,
  sampleRatio: sampleRatio.value(),
  weight: weight.value(),
});
