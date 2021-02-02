
# ![Recipe Book API](./public/recipe-logo.png)

## ![Work In Progress](./public/wipBadge.svg)

An API server that allows users to perform CRUD to recipes, and ingredients.
Features:

- Create Recipes
- Create Ingredients
- Add Ingredients to recipes
- View list of favorite recipes
- User accounts

## Table of contents

- [Install](#install)
- [endpoints](#endpoints)
- [Methods](#methods)
- [Compatibility](#compatibility)

## Install

NPM

1. Download the file or clone the repo.
2. Open the directory in your favorite editor
3. Run the following in Terminal:

```bash
npm install
```

# Endpoints

## GET

| endpoint                     | Description                   |
| ---------------------------- | ----------------------------- |
| api/recipes                  | list of all available recipes |
| api/recipes/:id              | returns a recipe by id        |
| /api/recipes/random          | returns a random recipe       |
| /api/recipes/:id/ingredients | returns a list of ingredients |
| /api/ingredients             | returns a list of ingredients |
| /api/users                   | returns a list of users       |

## Post

| api/recipes | create new recipe|
|api/recipes/:id/ingredients|create new ingredient for specified |

## PUT

| endpoint                      | Description                 |
| ----------------------------- | --------------------------- |
| api/recipes/:id               | update specified recipes    |
| api/ingredients/:ingredientId | update specified ingredient |
