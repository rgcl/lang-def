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

		it('A = def(); new A() has fn function too', function() {
			var A = def();
			assert.equal(typeof (new A()).fn, 'function');
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

		it('instanceof', function() {
			var A = def(),
				B = def(A),
				C = def(B),
				a = new A,
				b = new B,
				c = new C;

			assert.equal(a instanceof A, true);
			assert.equal(a instanceof B, false);
			assert.equal(a instanceof C, false);

			assert.equal(b instanceof A, true);
			assert.equal(b instanceof B, true);
			assert.equal(b instanceof C, false);

			assert.equal(c instanceof A, true);
			assert.equal(c instanceof B, true);
			assert.equal(c instanceof C, true);
		});

		it('def.mixinOf', function() {
			var A = def(),
				B = def([A]),
				C = def([A, B]),
				a = new A,
				b = new B,
				c = new C;

			assert.equal(def.mixinOf(a, A), false, 'def.mixinOf(a, A)');
			assert.equal(def.mixinOf(a, B), false, 'def.mixinOf(a, B)');
			assert.equal(def.mixinOf(a, C), false, 'def.mixinOf(a, C)');

			assert.equal(def.mixinOf(b, A), true, 'def.mixinOf(b, A)');
			assert.equal(def.mixinOf(b, B), false, 'def.mixinOf(b, B)');
			assert.equal(def.mixinOf(b, C), false, 'def.mixinOf(b, C)');

			assert.equal(def.mixinOf(c, A), true, 'def.mixinOf(c, A)');
			assert.equal(def.mixinOf(c, B), true, 'def.mixinOf(c, B)');
			assert.equal(def.mixinOf(c, C), false, 'def.mixinOf(c, C)');

		});

		it('def.instanceOf', function() {
			var A = def(),
				B = def(A),
				C = def(B),
				a = new A,
				b = new B,
				c = new C;

			assert.equal(def.instanceOf(a, A), true);
			assert.equal(def.instanceOf(a, B), false);
			assert.equal(def.instanceOf(a, C), false);

			assert.equal(def.instanceOf(b, A), true);
			assert.equal(def.instanceOf(b, B), true);
			assert.equal(def.instanceOf(b, C), false);

			assert.equal(def.instanceOf(c, A), true);
			assert.equal(def.instanceOf(c, B), true);
			assert.equal(def.instanceOf(c, C), true);

		});

		it('this.fn', function() {
			var A = def({
					m: function(d) {
						return 'A(' + d + ')';
					}
				}),
				B = def(A, {
					m: function(d) {
						return 'B(' + this.fn(A, 'm')(d) + ')'
					}
				}),
				C = def(B, {
					m: function(d) {
						return 'C(' + this.fn(B, 'm')(d) + ')'
					}
				}),
				a = new A,
				b = new B,
				c = new C;

			assert.equal(a.m(1), 'A(1)');
			assert.equal(b.m(1), 'B(A(1))');
			assert.equal(c.m(1), 'C(B(A(1)))');
		});

	});

	describe('mixins', function () {

		it('instanceof', function() {
			var A = def(),
				B = def([A]),
				C = def([A, A]),
				a = new A,
				b = new B,
				c = new C;

			assert.ok(a instanceof A);

			assert.ok(b instanceof B);
			assert.equal(b instanceof A, false);

			assert.ok(c instanceof C);
			assert.equal(c instanceof B, false);
			assert.equal(c instanceof A, false);
		});

		it('def.mixinOf', function() {
			var A = def(),
				B = def([A]),
				C = def([A, B]),
				a = new A,
				b = new B,
				c = new C;

			assert.equal(def.mixinOf(a, A), false, 'def.mixinOf(a, A)');
			assert.equal(def.mixinOf(a, B), false, 'def.mixinOf(a, B)');
			assert.equal(def.mixinOf(a, C), false, 'def.mixinOf(a, C)');

			assert.equal(def.mixinOf(b, A), true, 'def.mixinOf(b, A)');
			assert.equal(def.mixinOf(b, B), false, 'def.mixinOf(b, B)');
			assert.equal(def.mixinOf(b, C), false, 'def.mixinOf(b, C)');

			assert.equal(def.mixinOf(c, A), true, 'def.mixinOf(c, A)');
			assert.equal(def.mixinOf(c, B), true, 'def.mixinOf(c, B)');
			assert.equal(def.mixinOf(c, C), false, 'def.mixinOf(c, C)');

		});

		it('def.instanceOf', function() {
			var A = def(),
				B = def([A]),
				C = def([A, B]),
				a = new A,
				b = new B,
				c = new C;

			assert.equal(def.instanceOf(a, A), true);
			assert.equal(def.instanceOf(a, B), false);
			assert.equal(def.instanceOf(a, C), false);

			assert.equal(def.instanceOf(b, A), true);
			assert.equal(def.instanceOf(b, B), true);
			assert.equal(def.instanceOf(b, C), false);

			assert.equal(def.instanceOf(c, A), true);
			assert.equal(def.instanceOf(c, B), true);
			assert.equal(def.instanceOf(c, C), true);

		});

	});

});