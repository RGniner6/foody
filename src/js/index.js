import './../styles/style.css';
import axios from 'axios'
import Search from "./models/Search";
import * as searchView from './views/searchView';
import Recipe from "./models/Recipe";
import {clearLoader, elements, renderLoader} from './views/base';

const state = {};

/**
 * Search Controller
 */
const controlSearch = async () => {
    //get query from view
    const query = searchView.getInput();
    if (query){
        //Add search to the state
        state.search = new Search(query);

        //Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResult)

         //Search for recipes
        await state.search.getResults();

        //Display results once you have them
        clearLoader();
        searchView.renderResults(state.search.result);

    }
};

elements.searchForm.addEventListener('submit', evt => {
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

/**
 * Recipe Controller
 */
const r = new Recipe('49346');
r.getRecipe();
