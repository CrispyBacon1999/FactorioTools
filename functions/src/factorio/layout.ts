import { readFileSync } from "fs";
import { generateGraph, balanceGraph } from "./util/recipegraph";
import { RecipeBook } from "./factorio";

let rawdata = readFileSync("./data/recipe.json");
let recipes = JSON.parse(rawdata.toString("utf-8")) as RecipeBook;
const graph = generateGraph(recipes, "electronic-circuit");

console.log(graph.serialize());
console.log(graph.topologicalSort());

const balanced = balanceGraph(graph);
