import {elements} from "./base";
import {limitRecipeTitle} from "./searchView";

export const toggleLikeButton = isLiked => {
    const iconString = isLiked ?  'icon-heart': 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);

};

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible':'hidden';
};

export const renderLike = like => {
    const titleShort = limitRecipeTitle(like.title);
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${titleShort}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    const item = document.querySelector(`.likes__link[href="#${id}"]`);
    item.parentElement.removeChild(item);
};