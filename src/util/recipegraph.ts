import Graph from "graph-data-structure";
import { IRecipe, IRecipeIngredient, RecipeBook } from "../factorio";

export function generateGraph(recipes: RecipeBook, target: string) {
  var graph = Graph();
  const endNode = recipes[target];
  findChildren(recipes, graph, endNode, false);
  console.log(graph.topologicalSort());
  return graph;
}

function findChildren(
  recipes: RecipeBook,
  graph: any,
  currentNode: IRecipe,
  expensive_mode: boolean
) {
  const ingreds = getIngredients(currentNode, expensive_mode);
  for (var ingred_name in ingreds.recipe) {
    const ingredient = ingreds.recipe[ingred_name];
    if (graph.hasEdge(ingredient.name, currentNode.name)) {
      const currentWeight = graph.getEdgeWeight(
        ingredient.name,
        currentNode.name
      );
      graph.setEdgeWeight(
        ingredient.name,
        currentNode.name,
        currentWeight + ingredient.quantity / ingreds.weight
      );
    } else {
      graph.addEdge(
        ingredient.name,
        currentNode.name,
        ingredient.quantity / ingreds.weight
      );
    }
    findChildren(recipes, graph, recipes[ingred_name], expensive_mode);
  }
}

interface RecipeWithWeight {
  recipe: { [key: string]: IRecipeIngredient };
  weight: number;
}

function getIngredients(
  recipe: IRecipe,
  expensive_mode: boolean
): RecipeWithWeight {
  var ingreds: { [key: string]: IRecipeIngredient } = {};
  if (recipe) {
    var weight: number | undefined = 1;
    if ("ingredients" in recipe && recipe.ingredients) {
      ingreds = recipe.ingredients;
      weight = recipe.result_count;
    }
    if (expensive_mode && "expensive" in recipe && recipe.expensive) {
      const x = getIngredients(recipe.expensive, expensive_mode);
      ingreds = x.recipe;
      weight = x.weight;
    }
    if (!expensive_mode && "normal" in recipe && recipe.normal) {
      let x: RecipeWithWeight = getIngredients(recipe.normal, expensive_mode);
      ingreds = x.recipe;
      weight = x.weight;
    }
  }

  return {
    recipe: ingreds,
    weight: weight ? weight : 1,
  };
}

export function balanceGraph(graph: any) {
  // const balanced = Graph();
  const topSort: string[] = graph.topologicalSort();
  const adjMatrix = generateAdjacencyMatrix(graph);
  console.table(adjMatrix.matrix);
  console.table(adjMatrix.headers);
  const mappedAdjMatrixHeaders = topSort
    .map((key) => adjMatrix.headers.indexOf(key))
    .reverse();
  const itemTotals = new Array(topSort.length).fill(Infinity);
  console.log(mappedAdjMatrixHeaders);
  /*
  Calculate the amount of items per level of recipe.
  This logic is making my head hurt right now.
  */
}

// function relax()

function generateAdjacencyMatrix(graph: any): {
  headers: string[];
  matrix: number[][];
} {
  const nodes = graph.nodes();
  const headers = nodes;
  const matrix: number[][] = [];
  for (var i = 0; i < nodes.length; i++) {
    matrix.push([]);
    for (var j = 0; j < nodes.length; j++) {
      if (graph.hasEdge(nodes[i], nodes[j])) {
        matrix[i].push(graph.getEdgeWeight(nodes[i], nodes[j]));
      } else {
        matrix[i].push(0);
      }
    }
  }
  return {
    headers: headers,
    matrix: matrix,
  };
}
