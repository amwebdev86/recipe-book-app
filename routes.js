const express = require('express');
const router = express.Router();
const records = require('./recipes');
const usersRecords = require('./users');
const { asyncHandler } = require('./utils/index');

//GET request returns greeting from server.
router.get('/', (req, res) => {
  res.json({
    greeting: `Hello welcome to the Recipe API. user /api/v1/recipes to see recipes!`,
  });
});
/**
 * ********** RECIPES **********
 */
//GET all recipes
router.get('/recipes', async (req, res) => {
  const recipes = await records.getRecipes();

  res.json(recipes);
});
//GET a single recipe
router.get('/recipes/:id', async (req, res) => {
  const id = req.params.id;
  const recipe = await records.getRecipe(id);
  if (!recipe) {
    res.status(401).json({ message: 'recipe not found.' });
  }
  res.json(recipe);
});

//GET Random recipe
router.get(
  '/recipes/random',
  asyncHandler(async (req, res) => {
    const randomRecipe = await records.getRandomRecipe();
    res.json(randomRecipe);
  })
);
//get a recipe's ingredients
router.get(
  '/recipes/:id/ingredients',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const ingredients = await records.getRecipeIngredients(id);
    res.json(ingredients);
  })
);
//create a recipe
router.post(
  '/recipes',
  asyncHandler(async (req, res) => {
    if (req.body.name && req.body.creator) {
      const recipe = await records.createRecipe(req.body);
      res.status(201);
      res.json(recipe);
    } else {
      res
        .status(400)
        .json({ message: 'Name of recipe and creator name required' });
    }
  })
);
//create a new ingredient for a specific recipe
router.post(
  '/recipes/:id/ingredients',
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const ingredientData = {...req.body};
    if (//TODO: add express validation.
      !ingredientData.name ||
      !ingredientData.amount ||
      !ingredientData.measurement
    ) {
      res
        .status(400)
        .json({ message: 'no information provided to create ingredient' });
    }

    const ingredient = await records.createIngredient(id, ingredientData);
    res.status(201).json(ingredient);
  })
);
router.put(
  '/recipes/:id',
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const newInfo = req.body;
    if (newInfo) {
      await records.updateRecipe(id, newInfo);
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'No data provided to update recipe' });
    }
  })
);
/**
 * ********** INGREDIENTS **********
 */
router.get(
  '/ingredients',
  asyncHandler(async (req, res) => {
    let ingredients = await records.getAllIngredients();
    res.json(ingredients);
  })
);
router.post(
  '/ingredients',
  asyncHandler(async (req, res) => {
    records.createFreeIngredient(req.body);
    res.json(req.body);
  })
);

/**
 * ********** USERS **********
 */
router.get(
  '/users',
  asyncHandler(async (req, res) => {
    const users = await usersRecords.getUsers();
    res.json(users);
  })
);

/**
 * ----------------------PUT ROUTES -----------------*
 */
//PUT request update a recipe api/recipes/:id _UPDATE

//TODO update how this route works.
router.put(
  '/recipes/:id/ingredients/:ingredientId',
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const ingredientId = req.params.ingredientId;
    const recipe = await records.getRecipe(id);
    const updatedIngredient = {
      name: req.body.name,
      amount: req.body.amount,
      measurement: req.body.measurement,
    };
    if (recipe) {
      await records.updateIngredient(recipe, ingredientId, updatedIngredient);
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'No Recipe found' });
    }
  })
);
//DELETE request to remove a recipe api/recipes/:id
router.delete(
  '/recipes/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const recipeToDelete = await records.getRecipe(id);
    if (recipeToDelete) {
      await records.deleteRecipe(recipeToDelete);
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  })
);

//DELETE Ingredient
router.delete(
  '/recipes/:id/ingredients/:ingredientId',
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const ingredientId = req.params.ingredientId;
    recipe = await records.getRecipe(id);
    if (recipe) {
      await records.deleteIngredient(recipe, ingredientId);
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  })
);
module.exports = router;
