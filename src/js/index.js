import './../styles/style.css';
import axios from 'axios'
import Search from "./models/Search";
import List from "./models/List";
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Recipe from "./models/Recipe";
import {clearLoader, elements, renderLoader} from './views/base';
import Likes from "./models/Likes";
import {toggleLikeButton} from "./views/likesView";

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
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (e) {
            console.log(e);
        }
    }
};

elements.searchForm.addEventListener('submit', evt => {
    evt.preventDefault();
    controlSearch();
});

/**
 * LIST CONTROLLER
 */
const controlList = () => {
    if (!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

/**
 * LIKES CONTROLLER
 */
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());
const controlLikes = () => {
    if (!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;

    if (!state.likes.isLiked(currentId)){
        const newLike = state.likes.addlikes(currentId, state.recipe.title, state.recipe.author, state.recipe.img);
        likesView.toggleLikeButton(true);
        likesView.renderLike(newLike);
    } else {
        state.likes.deleteLike(currentId);
        likesView.toggleLikeButton(false);
        likesView.deleteLike(currentId);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


//TESTING
window.addEventListener('load', evt => {
    evt.preventDefault();
    controlSearch();
});

window.s = state;

elements.searchResPages.addEventListener('click', (evt) => {
    const button = evt.target.closest('.btn-inline');
    if (button) {
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

['hashchange', 'load'].forEach((evt) => {window.addEventListener(evt, controlRecipe)});

//Handle recipe button clicks
elements.recipe.addEventListener('click', evt => {
    if (evt.target.matches('.btn-decrease, .btn-decrease *')) {
        state.recipe.updateServings('dec');
        recipeView.updateServings(state.recipe);
    } else if (evt.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServings(state.recipe);
    } else if (evt.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (evt.target.matches('.recipe__love, .recipe__love *')) {
        controlLikes();
    }
});

elements.shoppingList.addEventListener('click', evt => {
    const id = evt.target.closest('.shopping__item').dataset.itemid;
    if (evt.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (evt.target.matches('.shopping__count--value')) {
        const val = parseInt(evt.target.value, 10);
        state.list.updateCount(id, val);
    }
});

