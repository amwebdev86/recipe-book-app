const fs = require('fs');
const { loadData, saveData, generateRandomId } = require('./utils');

//TODO: FIX issue where data.json gets modified losing "cards"

/**
 * RECIPES
 */
async function getRecipes() {
  return await loadData('data.json');
}
async function getIngredients() {
  return await loadData('ingredientData.json');
}
/**
 * Gets a specific recipe
 * @param {number} id
 */
async function getRecipe(id) {
  const recipes = await getRecipes();
  if (!recipes) return;
  return recipes.cards.find((card) => card.id == id);
}

async function getRandomRecipe() {
  const recipes = await getRecipes();
  const randNumber = Math.floor(
    Math.random() * Math.floor(recipes.cards.length)
  );

  return recipes.cards[randNumber];
}
/**
 *GET a list of ingredients for the recipe
 * @param {number} id
 */
async function getRecipeIngredients(id) {
  const recipes = await getRecipes();
  const recipe = recipes.cards.find((card) => card.id == id);
  return recipe.ingredients;
}
/**
 *CREATE new Recipe Card
 * @param {Object} newCard - An object containing the new data to a recipe: name, creator required.
 */
async function createRecipe(newCard) {
  const recipes = await getRecipes();
  newCard.id = generateRandomId();
  if (newCard.ingredients !== undefined) {
    newCard.ingredients.forEach((element) => {
      element.id = generateRandomId();
    });
  }
  recipes.cards.push(newCard);
  await saveData('data.json', recipes);
  return newCard;
}
/** INGREDIENTS */
/**
 * Returns a list of all recipes in the database. Including ones not attached to a recipe.
 */
async function getAllIngredients() {
  const recipes = await getRecipes();
  const ingredientDb = await getIngredients();
  const ingredientData = ingredientDb.data;
  const cards = recipes.cards;
  let ingredients = [];
  ingredientData.forEach((data) => {
    ingredients.push(data);
  });
  cards.forEach((card) => {
    ingredients.push(...card.ingredients);
  });
  updateIngredientId(ingredients);
  ingredientData.push(...ingredients);
  await saveData('ingredientData.json', ingredientDb);
  await saveData('data.json', recipes);
  return ingredients;
}
async function updateIngredientId(ingredients) {
  //const ingredients = await getAllIngredients();
  ingredients.forEach((ingredient) => {
    if (!ingredient.id) {
      ingredient.id = generateRandomId();
    } else {
      return;
    }
  });
}

/**
 *
 * @param {number} id
 * @param {*} ingredientdata
 */
async function createIngredient(id, ingredientdata) {
  //TODO: REFACTOR. shouldnot need an id to create an ingredient. attaching ingredients should be another method.
  let newIngredient = {};
  if (ingredientdata) {
    newIngredient.name = ingredientdata.name;
    newIngredient.amount = ingredientdata.amount;
    newIngredient.measurement = ingredientdata.measurement;
    newIngredient.id = generateRandomId();
  } else {
    throw new Error('No Ingredient information provided');
  }
  const recipes = await getRecipes();
  //grab the recipe
  const recipe = recipes.cards.find((item) => item.id == id);
  recipe.ingredients.push(newIngredient);
  console.log(newIngredient);
  await saveData('data.json', recipes);
}

async function createFreeIngredient(ingredientData) {
  let newIngredient = { ...ingredientData };
  newIngredient.id = generateRandomId();
  saveData('ingredientData.json', newIngredient);
}
/**
 *
 * @param {number} the id of the recipe you want to update
 * @param {*} newRecipe the req.body updated values.
 */
async function updateRecipe(id, newRecipe) {
  const recipes = await getRecipes();
  let oldRecipe = recipes.cards.find((card) => card.id == id);

  oldRecipe.name = newRecipe.name;
  oldRecipe.creator = newRecipe.creator;
  oldRecipe.description = newRecipe.description;
  oldRecipe.ingredients = newRecipe.ingredients;
  oldRecipe.ingredients.forEach((ingredient) => {
    if (!ingredient.id) {
      createIngredient(id, ingredient);
    }
  });

  await saveData('Data.json', recipes);
}
async function updateIngredient(recipeObj, ingredientId, updatedIngredient) {
  const recipes = await getRecipes();
  const recipe = recipes.cards.find((card) => card.id == recipeObj.id);
  const ingredientToUpdate = recipe.ingredients.find(
    (item) => item.id == ingredientId
  );
  ingredientToUpdate.name = updatedIngredient.name; // will be the req.body.name
  ingredientToUpdate.amount = updatedIngredient.amount;
  ingredientToUpdate.measurement = updatedIngredient.measurement;
  await saveData('data.json', recipes);
}
/**
 * Removes a recipe from the Db.
 * @param {Object} card
 */
async function deleteRecipe(card) {
  const recipes = await getRecipes();
  recipes.cards = recipes.cards.filter((item) => item.id != card.id);
  await saveData(recipes);
}
async function deleteIngredient(card, ingredientId) {
  const recipes = await getRecipes();
  let recipe = recipes.cards.find((item) => item.id == card.id);
  let updatedArr = recipe.ingredients.filter((item) => item.id != ingredientId);
  recipe.ingredients = updatedArr;
  await saveData(recipes);
}

module.exports = {
  getRecipe,
  getRecipes,
  getRandomRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeIngredients,
  deleteIngredient,
  updateIngredient,
  createIngredient,
  getAllIngredients,
  createFreeIngredient,
};
