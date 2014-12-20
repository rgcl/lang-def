
#lang-def
Lightweight utility module for creating javascript *classes*.

![standards](http://imgs.xkcd.com/comics/standards.png)
> copyright [xkcd](http://xkcd.com/927/)

#Features
- Great performance.
- Works in node.js and browsers
  - In the node.js use the native [inherits](http://nodejs.org/docs/latest/api/util.html#util_util_inherits_constructor_superconstructor).
  - Use ES5 if is available, or the legacy way in legacy environment (cough cough IE<9).
- Support to classic inhiterance.
- Support to mixins.
- Support to CommonJs (like node.js), AMD (like requireJs) and as vanilla global module.
- Elegant API & clean code base.

#Quick Example
```javascript
var def = require('def')

var Point = def({
	new: function (x, y) {
		this.x = x;
		this.y = y;
	},
	distance: function (p) {
		return Math.sqrt(
			Math.pow(p.x - this.x, 2) +
			Math.pow(p.y - this.y, 2)
		)
	}
})

var a = new Point(2, 4)
var b = new Point(5, -6)

a.distance(b);
// -> 10.44030650891055
```

#Installation
With [npm][]:
```sh
$ npm install lang-def
```
With [bower][]:
```sh
$ bower install lang-def
```
##Import

###In CommonJS (like node.js)
```node
var def = require('lang-def')
```
###In AMD (like requireJS)
```javascript
require.config({
    paths: {
        def: 'libs/lang-def/def'
    }
});
```
Then simply use
```javascript
require(['def'], function (def) {
	// use def
});
```
###In vanilla (like simple web page)
```html
<script src="my_path/lang-def/def.js"></script>
<script>
	// use window.def or simply def
</script>
```
#Usage
Signature:
```node
def([ string name ], [ function BaseClass ], [ array mixins ], [ object props ]) -> Function
```
- *optional string* **name**:
	- The name of the class. Useful for debugging.
	- default: `undefined`, but resolved to `'AnonymousConstructor'`.
	- limitations:
		- Must be compilant with the general rules for Javascript variables,
		i.e. `'Person'`, `'SuperPerson'`. Not `'persons.Person'` or `2Person`.
		- Is compatible with [Chrome Extensions](https://developer.chrome.com/extensions/contentSecurityPolicy#relaxing-eval),
		but not with [Chrome Apps](https://developer.chrome.com/apps/contentSecurityPolicy#what), so for developing Chome Apps omit the name. This restriction is due to the use of `new Function(...)` to generate the name
		in the runtime.
- *optional function* **BaseClass**:
	- The parent constructor in the classic [inhiterance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain).
	- default: `undefined`, by definition inherits from `Object`.
	- limitations:
		- Can be a constructor function (*Class*) created by `def` or by vanilla javascript.
		- Currently no work well for DOM Interfaces, like HTMLDivElement.
- *optional array* **mixins**:
	- An array of constructor functions that is *mixed* from left to right (the right overrides the left).
	- default: []
	- limitations:
		- The same of the **BaseClass**.
- *optional object* **props**:
	- The properties or members of the Class to create.
	- default: {}
	- especial members:
		- *optional function* **new**: is the `constructor`.
	- limitations:
		- Must not contain one of the follows special members: **mixins_**, **super_** and **super**.

#Examples
```node
var def = require('lang-def')

var Eatable = def({
	eat: function () {
		console.log('yummy!')
	}
});

// Animal mixin with Eatable
var Animal = def([Eatable], {
	new: function(sex) {
		this.sex = sex;
	}
});

// Person extends from Animal
var Person = def(Animal, {
	// constructor
	new: function(name, sex) {
		this.super('new', [sex]);
		this.name = name;
	},
	speak: function () {
		console.log("Hi! I'am " + this.name)
	}
});

var guy = new Person('Bob', 'm');
guy.eat()
// -> yummy!
guy.speak()
// -> Hi! I'am Bob

guy instanceof Person
// -> true
guy instanceof Animal
// -> true
guy instanceof Eatable
// -> false (because Eatable is a mixin)

// Define a robot behavior
var Robot = def({
	fireFire: function () {
		console.log('FIRE FIRE JSDHKJDHJSKHKJSAHK FIRE FIRE')
	}
})

// Define a robot that can eat
var MecaAnimal = def([Eatable, Robot])

var monster = new MecaAnimal()
monster.fireFire()
// -> 'FIRE FIRE JSDHKJDHJSKHKJSAHK FIRE FIRE'

// Inheriting/mixin with a vanilla Javascript class
function Super(level) {
	this.level = level
}

var SuperMecaAnimal = def(MecaAnimal, [Super]);
var SuperWololo = def(Super, [Robot] {
	fireFire: function() {
		console.log('Wololo Wololo level ' + this.level);
	}
})

```

#TODO
- [x] Experimenting
- [x] Writing the code
- [x] Anecdotally Testing
- [ ] Automated Testing on Travis
- [ ] Documenting the API

#LICENSE
MIT LICENSE

[npm]: http://npmjs.org/
[bower]: http://bower.io/