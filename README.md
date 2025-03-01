![npm version](https://img.shields.io/npm/v/itemsjs)
![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/itemsapi/itemsjs)
![GitHub package.json version](https://img.shields.io/github/package-json/v/itemsapi/itemsjs?label=package.json)
[![NPM monthly downloads](https://img.shields.io/npm/dm/itemsjs.svg)](https://img.shields.io/npm/dm/itemsjs.svg)
[![GitHub license](https://img.shields.io/github/license/itemsapi/itemsjs)](https://github.com/itemsapi/itemsjs/blob/master/LICENSE)

# ItemsJS - search engine in javascript

Full text, faceted, dependency free search engine in javascript.
Created to perform fast search on json dataset (up to 100K items).

## Demo

![demo](https://media.giphy.com/media/1xOcvGeYJPPFZxSpHy/giphy.gif)

(by @darkrubyist)

[See another demo examples](/docs/demo.md)

## Use cases

Itemsjs is being used mostly for data classification of companies, products, publications, documents, jobs or plants

The solution has been implemented by people from Amazon, Hermes, Apple, Microsoft, James Cook University, Carnegie Mellon University and more.
You can find a list of real implementations - [here](/docs/who-use-it.md) 

## Features

- faceted search
- full text
- pagination
- no dependencies (only javascript)
- working on backend and frontend

## Getting Started

### NPM

```bash
npm install itemsjs
```

```js
const itemsjs = require('itemsjs')(data, configuration);
const items = itemsjs.search();
```

### Client side

or using from the client side:

```bash
npm install itemsjs
```

```html
<!-- CDN -->
<!-- unpkg: use the latest release -->
<script src="https://unpkg.com/itemsjs@latest/dist/itemsjs.min.js"></script>
<!-- unpkg: use a specific version -->
<script src="https://unpkg.com/itemsjs@1.0.49/dist/itemsjs.min.js"></script>
<!-- jsdelivr: use a specific version -->
<script src="https://cdn.jsdelivr.net/npm/itemsjs@1.0.49/dist/itemsjs.min.js"></script>

<!-- locally -->
<script src="/node_modules/itemsjs/dist/itemsjs.js"></script>
```

```js
itemsjs = itemsjs(data, configuration);
itemsjs.search()
```

Gulp task:

```javascript
function itemjs() {
  return src('node_modules/itemsjs/dist/itemsjs.min.js')
      .pipe(dest('source/javascripts/'));
}; // Will copy to source/javascripts/itemsjs.min.js
```

## Example

```bash
npm install itemsjs

# download json data
wget https://raw.githubusercontent.com/itemsapi/itemsapi-example-data/master/items/movies-processed.json -O data.json
```

Create `search.js`:

```js
var data = require('./data.json');

var itemsjs = require('itemsjs')(data, {
  sortings: {
    name_asc: {
      field: 'name',
      order: 'asc'
    }
  },
  aggregations: {
    tags: {
      title: 'Tags',
      size: 10
    },
    actors: {
      title: 'Actors',
      size: 10
    },
    genres: {
      title: 'Genres',
      size: 10
    }
  },
  searchableFields: ['name', 'tags']
});

/**
 * get filtered list of movies 
 */
var movies = itemsjs.search({
  per_page: 1,
  sort: 'name_asc',
  // full text search
  // query: 'forrest gump',
  filters: {
    tags: ['1980s']
  }
})
console.log(JSON.stringify(movies, null, 2));

/**
 * get list of top tags 
 */
var top_tags = itemsjs.aggregation({
  name: 'tags',
  per_page: 10
})
console.log(JSON.stringify(top_tags, null, 2));
```

Test that with :

```bash
node search.js
```

## API

### var itemsjs = ItemsJS(data, [configuration])

#### `data`

The first `data` argument is an array of objects.

#### `configuration`

Responsible for defining global configuration. Look for full example here - [configuration](/docs/configuration.md)

- **`aggregations`** filters configuration i.e. for `tags`, `actors`, `colors`, etc. Responsible for generating facets.

- **`sortings`** you can configure different sortings like `tags_asc`, `tags_desc` with options and later use it with one key.

- **`searchableFields`** an array of searchable fields.

### itemsjs.search(options)

#### `options`

- **`per_page`** amount of items per page.

- **`page`** page number - used for pagination.

- **`query`** used for full text search.

- **`sort`** used for sorting. one of `sortings` key
  
- **`filters`** filtering items based on specific aggregations i.e. {tags: ['drama' , 'historical']}  

- **`filter`** function responsible for items filtering. The way of working is similar to js [native filter function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter). [See example](/docs/configuration.md)
  
- **`isExactSearch`** set to `true` if you want to always show exact search matches. See [lunr stemmer](https://github.com/olivernn/lunr.js/issues/328) and [lunr stopWordFilter](https://github.com/olivernn/lunr.js/issues/233).

### itemsjs.aggregation(options)

It returns full list of filters for specific aggregation

#### `options`

- **`name`** aggregation name
- **`per_page`** filters per page
- **`page`** page number
- **`query`** used for quering filters. It's not full text search

### itemsjs.similar(id, options)

It returns similar items to item for given id

#### `options`

- **`field`** field name for computing similarity (i.e. tags, actors, colors)
- **`minimum`** what is the minimum intersection between field of based item and similar item to show them in the result
- **`per_page`** filters per page
- **`page`** page number

  
### itemsjs.reindex(data)

It's used in case you need to reindex the whole data

#### `data`

An array of objects.

## Credit

- [Lunr.js](https://github.com/olivernn/lunr.js) for providing full text search.
