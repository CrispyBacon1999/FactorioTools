import { parse } from "./lua";
import {
  BooleanLiteral,
  CallExpression,
  CallStatement,
  Chunk,
  Expression,
  Identifier,
  NumericLiteral,
  StringLiteral,
  TableConstructorExpression,
  TableValue,
} from "luaparse";
import { type } from "os";
import { write, writeFileSync } from "fs";

const data = parse(
  "E:/SteamLibrary/steamapps/common/Factorio/data/base/prototypes/item.lua"
);

function find_data_extension(data: Chunk) {
  for (var i = 0; i < data.body.length; i++) {
    const stmt = data.body[i];
    if (stmt.type === "CallStatement") {
      if (stmt.expression.type === "CallExpression") {
        if (stmt.expression.base.type === "MemberExpression") {
          if (stmt.expression.base.indexer === ":") {
            if (
              stmt.expression.base.identifier.name === "extend" &&
              (stmt.expression.base.base as Identifier).name === "data"
            ) {
              return stmt.expression.arguments as [TableConstructorExpression];
            }
          }
        }
      }
    }
    continue;
  }
}

const dataTable = find_data_extension(data);

function tableRowToJson(row: TableConstructorExpression) {
  const jsonOut: {
    [key: string]: { [key: string]: string | number | boolean };
  } = {};
  row.fields.forEach((item) => {
    // console.log(
    //   ((item as TableValue).value as TableConstructorExpression).fields
    // );
    const itemJson: { [key: string]: string | number | boolean } = {};
    ((item as TableValue).value as TableConstructorExpression).fields.forEach(
      (field) => {
        if (field.type === "TableKeyString") {
          if (field.value.type == "StringLiteral") {
            itemJson[field.key.name] = field.value.raw.replace(/"/g, "");
          }
          if (field.value.type == "BooleanLiteral") {
            itemJson[field.key.name] = field.value.value;
          }
          if (field.value.type == "NumericLiteral") {
            itemJson[field.key.name] = field.value.value;
          }
        }
      }
    );
    if ("name" in itemJson && typeof itemJson["name"] === "string") {
      jsonOut[itemJson["name"]] = itemJson;
    }
  });
  return jsonOut;
}

if (dataTable !== undefined) {
  const row = dataTable[0];
  const table = tableRowToJson(row);
  console.log(table);
  const names: Set<string> = new Set();
  Object.values(table).forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (!(key in names)) {
        names.add(key);
      }
    });
  });
  console.log(names);
  writeFileSync("./data.json", JSON.stringify(table, null, 2));
}
