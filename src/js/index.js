import './../styles/style.css';
import axios from 'axios'
import Search from "./models/Search";
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import Recipe from "./models/Recipe";
import {clearLoader, elements, renderLoader} from './views/base';

const state = {};

/**
 * Search Controller
 */
const controlSearch = async () => {
    //get query from view
    // const query = searchView.getInput();
    const query = 'pizza';
    if (query){
        //Add search to the state
        state.search = new Search(query);

        //Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResult);

        try {
            //Search for recipes
            await state.search.getResults();

            //Display results once you have them
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (e) {
            console.log(e);
            clearLoader();
        }

    }
};


/**
 * Recipe Controller
 */
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    if (id) {
        //Prep UI for new recipe
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        searchView.highlightSelected(id);

        try {
            //Get recipe from model
            state.recipe = new Recipe(id);
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            state.recipe.calcServings();
            state.recipe.calcTime();

            //Output it into the view
            // window.r = state.recipe;
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (e) {
            console.log(e);
        }
    }
};

elements.searchForm.addEventListener('submit', evt => {
    evt.preventDefault();
    controlSearch();
});

//TESTING
window.addEventListener('load', evt => {
    evt.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', (evt) => {
    const button = evt.target.closest('.btn-inline');
    if (button) {
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

['hashchange', 'load'].forEach((evt) => {window.addEventListener(evt, controlRecipe)});