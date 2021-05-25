import { read, readFileSync } from "fs";
import luaparse from "luaparse";

export function parse(filename: string) {
  const data = readFileSync(filename);
  const strData = data.toString("utf-8");
  return luaparse.parse(strData);
}
