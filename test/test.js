describe('def', function() {

	var def = require('../def.js'),
		assert = require('assert');

	describe('elemental', function() {

		it('def is a function', function() {
			assert.equal(typeof def, 'function');
		});

		it('def.instanceOf is a function', function() {
			assert.equal(typeof def.instanceOf, 'function');
    	});

		it('def.mixinOf is a function', function() {
			assert.equal(typeof def.mixinOf, 'function');
    	});

	});

});