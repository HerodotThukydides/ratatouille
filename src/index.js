import cheerio from 'cheerio';
import fetch from 'node-fetch';
import moment from 'moment';

import IngredientsParser from './ingredients-parser.js';
import StepsParser from './steps-parser.js';

export default class Ratatouille {
  constructor(html) {
    this.$ = cheerio.load(html);
  }

  static load(url) {
    return fetch(url).then((response) => response.text());
  }

  isValidURL(url) {
    return url.includes('allrecipes.com');
  }

  get servings() {
    return this.$('.servings-count span:first-child').text();
  }

  get readyInTime() {
    const duration = this.$('[itemProp="totalTime"]').attr('datetime');
    return moment.duration(duration).humanize();
  }

  get prepTime() {
    const duration = this.$('[itemProp="prepTime"]').attr('datetime');
    return moment.duration(duration).humanize();
  }

  get cookTime() {
    const duration = this.$('[itemProp="cookTime"]').attr('datetime');
    return moment.duration(duration).humanize();
  }
  
  get calories() {
    return this.$('.calorie-count span:first-child').text();
  }

  get ingredients() {
    const ingredientsParser = new IngredientsParser(this.$);
    return ingredientsParser.ingredients;
  }

  get steps() {
    const stepsParser = new StepsParser(this.$, this.ingredients);
    return stepsParser.steps;
  }
}
