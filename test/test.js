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

	describe('def()', function () {

		it('is a function', function() {
			var A = def();
			assert.equal(typeof A, 'function');
		});

		it('is equals to def({})', function() {
			var A = def(), A_keys = Object.keys(A.prototype);
			var B = def({}), B_keys = Object.keys(B.prototype);
			assert.equal(A.name, B.name);
			assert.equal(A.super_, B.super_);
			//assert.equal(A.mixins_, B.mixins_);
			assert.deepEqual(A_keys, B_keys);
		});

		it('.name is "AnonymousConstructor"', function() {
			var A = def();
			assert.equal(A.name, 'AnonymousConstructor');
		});
		
		it('A = def(); A(); -> throws a TypeError for missing the "new" operator', function() {
			var A = def();
			assert.throws(function() {
				A();
			}, function (err) {
				return (err instanceof TypeError) &&
					(err.message === 'use new AnonymousConstructor(...)');
			});
		});

		it('A = def(); new A() is a object', function() {
			var A = def();
			assert.equal(typeof new A(), 'object');
		});

		it('A = def(); new A() is equals to new A({})', function() {
			var A = def();
			assert.deepEqual(new A(), new A({}));
		});

		it('A = def(); new A() has super function too', function() {
			var A = def();
			assert.equal(typeof new A().super, 'function');
		});

	});

	describe('def with methods', function () {

		it('constructor called in the instantiation time', function() {
			var A = def({
				new: function(message) {
					this.message = message;
				}
			});
			var message = 'it works!'
			var a = new A(message);
			assert.equal(a.message, message);
		});

		it('"new" in the class definition becomes "constructor" in the instance', function() {
			var A = def({ new: function() { /* constructor */ } });
			var a = new A;
			assert.equal(typeof a.new, 'undefined');
			assert.equal(typeof a.constructor, 'function');
		});

		it('methods works', function() {
			var Point = def({
				new: function(x, y) {
					this.x = x;
					this.y = y;
				},
				sum: function(point) {
					this.x += point.x;
					this.y += point.y;
				}
			});
			var a = new Point(3, 4);
			assert.equal(a.x, 3);
			assert.equal(a.y, 4);
			var b = new Point(1, 2);
			a.sum(b);
			assert.equal(a.x, 4);
			assert.equal(a.y, 6);
		});

	});

	describe('classic inhiterance', function () {

		it('methods works', function() {
			var Parent = def();
			var Child = def(Parent);
			var p = new Parent;
			var c = new Child
			assert.ok(p instanceof Parent);
			assert.ok(c instanceof Child);
			assert.ok(c instanceof Parent);
		});

	});

});