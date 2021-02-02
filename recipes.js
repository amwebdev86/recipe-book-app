const fs = require('fs');
const utils = require('./utils');

/**
 * Generates a random number used for recipe id
 */
// function generateRandomId() {
//   return Math.floor(Math.random() * 10000);
// }


//TODO FIX issue where data.json gets modified losing "cards"
async function getRecipes() {
  return await utils.loadData('data.json');
}
/**
 * Gets a specific recipe
 * @param {number} id
 */
async function getRecipe(id) {
  const recipes = await getRecipes();
 // const recipes = await utils.loadData('data.json');
  console.log(recipes);
  if (!recipes) return;
  return recipes.cards.find((card) => card.id == id);
}
/**
 * Gets a random recipe
 */
async function getRandomRecipe() {
  const recipes = await getRecipes();
  //const recipes = await utils.loadData('data.json');
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
  //const recipes = await utils.loadData('data.json');
  const recipes = await getRecipes();
  const recipe = recipes.cards.find((card) => card.id == id);
  return recipe.ingredients;
}
//TODO route to retrieve all ingredients
async function getAllIngredients() {
  //const recipes = await utils.load('data.json');
  const recipes = await getRecipes();
  let ingredients = [];
  //foreach element pull out ingredients
  //console.log(recipes.cards);
}
/**
 *CREATE new Recipe Card
 * @param {Object} newCard - An object containing the new data to a recipe: name, creator required.
 */
async function createRecipe(newCard) {
  //const recipes = await utils.load('data.json');
  const recipes = await getRecipes();
  newCard.id = generateRandomId();
  if (newCard.ingredients !== undefined) {
    newCard.ingredients.forEach((element) => {
      element.id = generateRandomId();
    });
  }
  recipes.cards.push(newCard);
  await utils.saveData('data.json', newCard);
  //await saveData(recipes);
  return newCard;
}
async function createIngredient(id, ingredientdata) {
  let newIngredient = {};
  if (ingredientdata) {
    newIngredient.name = ingredientdata.name;
    newIngredient.amount = ingredientdata.amount;
    newIngredient.measurement = ingredientdata.measurement;
    newIngredient.id = generateRandomId();
  } else {
    throw new Error('No Ingredient information provided');
  }
  //grab all recipe cards
  //const recipes = await utils.load('data.json');
  const recipes = await getRecipes();
  //grab the recipe
  const recipe = recipes.cards.find((item) => item.id == id);
  //create a recipe object or take parameter object and add an id.

  //push that object to recipe ingredients array
  recipe.ingredients.push(newIngredient);
  console.log(newIngredient);
  await utils.saveData('data.json', recipes);
  return newIngredient;
}

/**
 * UPDATE the recipe with provided id any additional ingredients will have an id generated.
 * @param {Object} newCard -  An object containing the changes to recipe card.
 */
async function updateRecipe(newCard) {
  //const recipes = await utils.load('data.json');
  const recipes = await getRecipes();
  let recipe = recipes.cards.find((card) => card.id == newCard.id);
  recipe.name = newCard.name;
  recipe.creator = newCard.creator;
  recipe.description = newCard.description;
  recipe.ingredients = newCard.ingredients;
  recipe.ingredients.forEach((ingredient) => {
    if (!ingredient.id) {
      ingredient.id = generateRandomId();
    }
  });

  await saveData(recipes);
}
async function updateIngredient(recipeObj, ingredientId, updatedIngredient) {
  //const recipes = await utils.load('data.json');
  const recipes = await getRecipes();
  const recipe = recipes.cards.find((card) => card.id == recipeObj.id);
  const ingredientToUpdate = recipe.ingredients.find(
    (item) => item.id == ingredientId
  );
  ingredientToUpdate.name = updatedIngredient.name; // will be the req.body.name
  ingredientToUpdate.amount = updatedIngredient.amount;
  ingredientToUpdate.measurement = updatedIngredient.measurement;
  await saveData(recipes);
}
/**
 * Removes a recipe from the Db.
 * @param {Object} card
 */
async function deleteRecipe(card) {
  //const recipes = await utils.load('data.json');
  const recipes = await getRecipes();
  recipes.cards = recipes.cards.filter((item) => item.id != card.id);
  await saveData(recipes);
}
async function deleteIngredient(card, ingredientId) {
  // const recipes = await utils.load('data.json');
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
};
