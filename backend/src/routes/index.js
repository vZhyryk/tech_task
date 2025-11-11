// @ts-check
const express = require("express");
const router = express.Router();
const { getPokemonList } = require("../controllers/getPokemonList");
const { getPokemon } = require("../controllers/getPokemon");

/**
 * Pokemon API Routes
 * @module routes/pokemon
 * @description Express router for handling Pokemon-related API endpoints
 */
router.use("/:name", getPokemon);
router.use("/", getPokemonList);


module.exports = router;
