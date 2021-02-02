const express = require('express');
const router = express.Router();
const records = require('./recipes');
const usersRecords = require('./users');
const { asyncHandler } = require('./utils/index');

//GET request returns greeting from server.
router.get('/', (req, res) => {
  res.json({
    greeting: `Hello welcome to the Recipe Database`,
  });
});
//GET list of recipes /api/recipes _READ
router.get('/recipes', async (req, res) => {
  const recipes = await records.getRecipes();

  res.json(recipes);
});
//GET a single recipe /api/recipes/:id _READ
router.get('/recipes/:id', async (req, res) => {
  const id = req.params.id;
  const recipe = await records.getRecipe(id);
  if (!recipe) {
    res.status(401).json({ message: 'recipe not found.' });
  }
  res.json(recipe);
});

//GET Random recipe api/recipes/recipe/random
router.get(
  '/recipes/recipe/random',
  asyncHandler(async (req, res) => {
    const randomRecipe = await records.getRandomRecipe();
    res.json(randomRecipe);
  })
);

//GET recipe ingredient list
/**
 * @router GET
 * Get list of ingredients of a specific recipe
 */
router.get(
  '/recipes/:id/ingredients',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const ingredients = await records.getRecipeIngredients(id);
    res.json(ingredients);
  })
);

/**
 * @router GET
 * get a list of ingredients in the db.
 */
router.get(
  '/ingredients',
  asyncHandler(async (req, res) => {
    records.getAllIngredients();
    res.json({ message: 'hold on...in progress' });
  })
);

/**
 * @router GET
 * Get a list of users.
 */
router.get(
  '/users',
  asyncHandler(async (req, res) => {
    const users = await usersRecords.getUsers();
    res.json(users);
  })
);
/**
 * ------------------POST ROUTES--------------------------*
 */
//POST request create new recipe api/recipes/ _CREATE
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

//POST request to create a new ingredient
router.post(
  '/recipes/:id/ingredients',
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const ingredientData = req.body;
    if (
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
/**
 * ----------------------PUT ROUTES -----------------*
 */
//PUT request update a recipe api/recipes/:id _UPDATE
router.put(
  '/recipes/:id',
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const recipeToUpdate = await records.getRecipe(id);
    console.log(req.body);
    //TODO: refactor
    if (recipeToUpdate) {
      recipeToUpdate.name = req.body.name;
      recipeToUpdate.description = req.body.description;
      recipeToUpdate.course = req.body.course;
      recipeToUpdate.cuisine = req.body.cuisine;
      recipeToUpdate.preptime = req.body.preptime;
      recipeToUpdate.cooktime = req.body.cooktime;
      recipeToUpdate.marinadetime = req.body.marinadetime;
      recipeToUpdate.totaltime = req.body.totaltime;
      recipeToUpdate.servings = req.body.servings;
      let oldIngredients = [...recipeToUpdate.ingredients];
      let updatedIngredients = [...oldIngredients, ...req.body.ingredients];
      recipeToUpdate.ingredients = updatedIngredients;

      await records.updateRecipe(recipeToUpdate);
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Recipe not found.' });
    }
  })
);

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
