'use strict';

const assert = require('assert');
const Fulltext = require('./../src/fulltext');

describe('fulltext', function() {

  const items = [{
    name: 'Godfather',
    tags: ['mafia', 'crime'],
  }, {
    name: 'Fight club',
    tags: ['dark humor', 'anti establishment'],
  }, {
    name: 'Forrest Gump',
    tags: ['running', 'vietnam'],
  }];

  const specialItems = [
    {'name': 'elation'},
    {'name': 'source'}
  ];

  it('checks search', function test(done) {

    const fulltext = new Fulltext(items);
    assert.equal(fulltext.search('club').length, 1);
    assert.equal(fulltext.search('gump').length, 1);
    assert.equal(fulltext.search('forrest gump').length, 1);
    assert.equal(fulltext.search('forrest GUMP').length, 1);
    assert.equal(fulltext.search('gump')[0].name, 'Forrest Gump');
    assert.equal(fulltext.search('gump')[0].id, 3);
    assert.equal(fulltext.search('titanic').length, 0);
    assert.equal(fulltext.search().length, 3);

    done();
  });

  it('checks search on another fields', function test(done) {

    const fulltext = new Fulltext(items, {
      searchableFields: ['name', 'tags']
    });
    assert.equal(fulltext.search('vietnam').length, 1);
    assert.equal(fulltext.search('dark').length, 1);
    assert.equal(fulltext.search('anti').length, 1);

    done();
  });


  it('makes search stepping through characters', function test(done) {
    const fulltext = new Fulltext(specialItems, {
      searchableFields: ['name'],
      isExactSearch: true
    });
    assert.equal(fulltext.search('e').length, 1);
    assert.equal(fulltext.search('el').length, 1);
    assert.equal(fulltext.search('ela').length, 1);
    assert.equal(fulltext.search('elat').length, 1);
    assert.equal(fulltext.search('elati').length, 1); // Does not appear when stemmer is present
    assert.equal(fulltext.search('elatio').length, 1);
    assert.equal(fulltext.search('elation').length, 1);
    assert.equal(fulltext.search('s').length, 1);
    assert.equal(fulltext.search('so').length, 1); // Filtered by stopWordFilter
    assert.equal(fulltext.search('sou').length, 1);
    assert.equal(fulltext.search('sour').length, 1);
    assert.equal(fulltext.search('sourc').length, 1);
    assert.equal(fulltext.search('source').length, 1);

    done();
  });


  it('returns internal ids', function test(done) {

    const fulltext = new Fulltext(items);
    assert.deepEqual(fulltext.internal_ids(), [1, 2, 3]);
    assert.deepEqual(fulltext.bits_ids().array(), [1, 2, 3]);
    assert.deepEqual(fulltext.get_item(1).name, 'Godfather');

    done();
  });
});
