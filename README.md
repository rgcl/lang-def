**WARNING! [Experimental Status] Work In Progress**

#lang-def
Lightweight utility module for creating javascript *classes*.

#Features
* Great performance.
* Works in node.js and browsers (In node use native [inherits](http://nodejs.org/docs/latest/api/util.html#util_util_inherits_constructor_superconstructor) for performance).
* Support to classic inhiterance.
* Support to mixins.
* Support to CommonJs (like node.js), AMD (like requireJs) and as vanilla global module.
* Elegant API & clean code base.

#Installation
With [npm][]:
```sh
$ npm install lang-def
```
With [bower][]:
```sh
$ bower install lang-def
```

#Usage
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
guy instanceOf Animal
// -> true
guy instanceOf Eatable
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

```

#TODO
[ ] Testing (travis)
[ ] Document the API

#LICENSE
MIT LICENSE

[npm]: http://npmjs.org/
[bower]: http://bower.io/