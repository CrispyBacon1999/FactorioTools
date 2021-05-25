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
import { parse as dpParse } from "path";
import luaparse from "luaparse";

// const args = process.argv.slice(2);

// const dataFileName = "./data/recipe.lua";
// const dataFileName = args[0];

// const data = parse(dataFileName);

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

function tableRowToJson(row: TableConstructorExpression) {
  const jsonOut: {
    [key: string]: { [key: string]: string | number | boolean | any } | any;
  } = {};
  for (var i = 0; i < row.fields.length; i++) {
    const item = row.fields[i];
    // row.fields.forEach((item) => {
    // console.log(
    //   ((item as TableValue).value as TableConstructorExpression).fields
    // );
    const itemJson: { [key: string]: string | number | boolean | any } = {};
    if (
      ((item as TableValue).value as TableConstructorExpression).fields !==
      undefined
    ) {
      for (
        var j = 0;
        j <
        ((item as TableValue).value as TableConstructorExpression).fields
          .length;
        j++
      ) {
        // ((item as TableValue).value as TableConstructorExpression).fields.forEach(
        //    (field) => {
        const field = ((item as TableValue).value as TableConstructorExpression)
          .fields[j];
        if (field.type === "TableKeyString") {
          // console.log(field.value.type);
          if (field.value.type == "StringLiteral") {
            itemJson[field.key.name] = field.value.raw.replace(/"/g, "");
          }
          if (field.value.type == "BooleanLiteral") {
            itemJson[field.key.name] = field.value.value;
          }
          if (field.value.type == "NumericLiteral") {
            itemJson[field.key.name] = field.value.value;
          }
          if (field.value.type == "TableConstructorExpression") {
            // console.log(field.value);
            // console.log(itemJson);
            itemJson[field.key.name] = tableRowToJson(field.value);
            // console.log(itemJson[field.key.name]);
          }
        } else if (field.type === "TableValue") {
          if (field.value.type == "StringLiteral") {
            itemJson["name"] = field.value.raw.replace(/"/g, "");
          }
          // if (field.value.type == "BooleanLiteral") {
          //   itemJson[i] = field.value.value;
          // }
          if (field.value.type == "NumericLiteral") {
            itemJson["quantity"] = field.value.value;
          }
          if (field.value.type == "TableConstructorExpression") {
            const subObj: { [key: string]: any } = {};
            for (var k = 0; k < field.value.fields.length; k++) {
              const ingred = field.value.fields[k];
              if (ingred.value.type == "StringLiteral") {
                subObj["name"] = ingred.value.raw.replace(/"/g, "");
              }
              // if (field.value.type == "BooleanLiteral") {
              //   itemJson[i] = field.value.value;
              // }
              if (ingred.value.type == "NumericLiteral") {
                subObj["quantity"] = ingred.value.value;
              }
            }
            if ("name" in subObj && typeof subObj["name"] === "string") {
              if (!("ingredients" in jsonOut)) {
                jsonOut["ingredients"] = {};
              }
              jsonOut["ingredients"][subObj["name"]] = subObj;
            }
          }
        }
      }
      // );
    } else {
      if (item.type === "TableKeyString") {
        if (item.value.type === "StringLiteral") {
          jsonOut[item.key.name] = item.value.raw.replace(/"/g, "");
        } else if (item.value.type === "NumericLiteral") {
          jsonOut[item.key.name] = item.value.value;
        }
      }

      // jsonOut[item.]
    }
    if ("name" in itemJson && typeof itemJson["name"] === "string") {
      jsonOut[itemJson["name"]] = itemJson;
    }
  }
  return jsonOut;
}

export function parseLuaFileData(text: string) {
  const data = luaparse(text);
  const dataTable = find_data_extension(data);
  if (dataTable !== undefined) {
    const row = dataTable[0];
    const table = tableRowToJson(row);
    return table;
  }
  return null;
}

// console.log("Starting parse of %s", dataFileName);
// const time1 = new Date().getTime();
// if (dataTable !== undefined) {
//   const row = dataTable[0];
//   const table = tableRowToJson(row);
//   // console.log(table);
//   const names: Set<string> = new Set();
//   Object.values(table).forEach((item) => {
//     Object.keys(item).forEach((key) => {
//       if (!(key in names)) {
//         names.add(key);
//       }
//     });
//   });
//   // console.log(names);
//   const outputFileName = `./data/${dpParse(dataFileName).name}.json`;
//   console.log(
//     `Parsed data file in %d ms, written to ${outputFileName}`,
//     new Date().getTime() - time1
//   );
//   writeFileSync(outputFileName, JSON.stringify(table, null, 2));
// }
