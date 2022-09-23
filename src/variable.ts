import { Options } from "./options";

export interface Variable<T, O extends Options<T>> {
  value: () => O["required"] extends false ? T | undefined : T;
}
