import {elements} from './base';

export const getInput = () => elements.searchInput.value;
export const clearInput = () => {elements.searchInput.value = '';};
export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    clearButtons();
};
const clearButtons = () => {elements.searchResPages.innerHTML = '';};

export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > 17){
      title.split(' ').reduce((acc, cur) => {
        if ((acc + cur).length <= limit) {
            newTitle.push(cur);
        }
        return cur + acc;
      }, 0);
      return `${newTitle.join(' ')}...`;
  } else {
      return title;
  }
};

export const highlightSelected = id => {
    const highlighedResults = Array.from(document.querySelectorAll('.results__link--active'));
    highlighedResults.forEach(el => el.classList.remove('results__link--active'));
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

const renderRecipe = (recipe) => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id }">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="image of ${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1 : page+1}>
        <span>Page ${type === 'prev' ? page-1 : page+1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left':'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults/resPerPage);
    let button;
    // page = parseInt(page);
    if (page === 1 && pages > 1) {
        button = createButton(page, 'next');
    } else if (page < pages) {
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `
    } else if (page === pages && pages > 1) {
        button = createButton(page, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
};
export const renderResults = (results, page=1, resultsPerPage=10) => {
    const start = (page - 1)*resultsPerPage;
    const end = page * resultsPerPage;
    results.slice(start,end).forEach(renderRecipe);
    renderButtons(page, results.length, resultsPerPage);
};