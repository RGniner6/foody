import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (e) {
            console.log(e);
        }
    }

    calcTime(){
        //Assuming 15 minutes  required for every 3 ingredients
        const numIng = this.ingredients.length;
        this.time = Math.ceil(numIng/3) * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'cup', 'pounds', 'pound'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'cup', 'pound', 'pound'];
        const units = [...unitShort, 'kg', 'g'];
        console.log(this.ingredients);
        const newIngredients = this.ingredients.map(el => {
            //Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
               ingredient = ingredient.replace(unit, unitShort[i]);
            });

            //Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, "");

            //parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(" ");
            const unitIndex = arrIng.findIndex(el => units.includes(el));

            let objIng;
            if (unitIndex > -1) {
                //If there is a unit in the string
                //Everything upto unitIndex is assumed to be count.
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-','+'));
                    // count = Math.round(count*10)/10;
                } else {
                    count = eval(arrCount.join('+'))
                    // count = Math.round(count*10)/10;
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)) {
                //There is no unit but first element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }

            } else if (unitIndex === -1) {
                //No unit & no number in string
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }

            }

            objIng.count = objIng.count == null ? 1: objIng.count;
            return objIng;
        });
        this.ingredients = newIngredients;
    }
}