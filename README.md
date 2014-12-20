
#lang-def
Lightweight utility module for creating javascript *classes*.

![standards](http://imgs.xkcd.com/comics/standards.png)
> copyright [xkcd](http://xkcd.com/927/)

#Features
- Great performance.
- Works in node.js and browsers
  - In node.js use the native [inherits](http://nodejs.org/docs/latest/api/util.html#util_util_inherits_constructor_superconstructor).
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
[npm][]:
```sh
$ npm install lang-def
```
[bower][]:
```sh
$ bower install lang-def
```

Or simply [download](https://github.com/sapienlab/lang-def/archive/master.zip).

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
#API
##def
Creates a constructor function (*Class*).

Signature:
```node
def([ string name ], [ function BaseClass ], [ array mixins ], [ object props ])
 -> Function
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
	- default: [ ]
	- limitations:
		- The same of **BaseClass**.
- *optional object* **props**:
	- The properties or members of the Class to create.
	- default: { }
	- especial members:
		- *optional function* **new**: is the `constructor`.
			- default: `function () { def.mixin(this, arguments); }`.
		- (in each method) **this.super(string method [ array|array like, arguments])**:
			- to invoke the parent method with the given arguments.
	- limitations:
		- Must not contain one of the follows special members: **mixins_**, **super_** and **super**.

#Examples
A little Game Egine
```javascript
// (See Quick Example for definition of Point)

// GameEntity have all members of Point
var GameEntity = def([Point], {
	onUpdate: function(deltaTime) { },
	onCollision: function(entity) {},
	onRender: function (ctx) {
		ctx.save()
		ctx.rect(...)
		...
		ctx.pop()
	}
})

// Player inherits from GameEntity
var Player = def(GameEntity, {
	live: 3,
	onUpdate: function(deltaTime) {
		if(...) {
			this.x += 0.5 * deltaTime
		}
		...
	},
	onCollision: function(entity) {
		if(entity instanceof Mushroom) {
			this.live++;
		} else if(entity instanceof Enemy) {
			this.live--;
		}
	}
})

// Setting the location on instantiate time
var RandomConstructor = def({
	new: function() {
		this.x = Math.random() * 800
		this.y = Math.random() * 600
	}
})

// Enemy and Mushroom inherits from GameEntity
// and have a random location
var Enemy = def(GameEntity, [RandomConstructor])
var Mushroom = def(GameEntity, [RandomConstructor])

var hero = new Player({ x: 25, y: 25 })

// define a Game
var Game = def({ ... })

var game = new Game({
	width: 800,
	height: 600,
	player: new Payer
})

game.play()

// Add enemies and food each 5s.
setInterval(function() {
	game.add(new Enemy)
	game.add(new Mushroom)
}, 5000)

```
##def.mixinOf
Check if instance is mixin of Mixin.

Signature:
```javascript
def.mixinOf(object instance, function Mixin) -> bool
```
- *object* **instance**
- *function* **Mixin**

##def.instanceOf
Check if instance is mixin of Mixin.

Signature:
```javascript
def.instanceOf(object instance, function MixinOrClass) -> bool
```
- *object* **instance**
- *function* **MixinOrClass**

##def.mixin
Mixin **arg0** with **arg1**, then with *arg2* (if exits), etc.

Signature:
```javascript
def.mixin(object arg0 [, object arg1 [, ... ]]) -> object
```
- *object* **arg0**
- ...

The **arg0** object is mutated and returned.

#Best  Practies
- Use the conventional prefix `_` for private members. Example `_lastPosition: 5`.
	> We can over engineering this lib for have a real *private* concept, but
	> then we like some way for made reflection... so, [KISS](http://en.wikipedia.org/wiki/KISS_principle) is the better.
- Feel free for use `def` with vanilla constructor functions and in library proyects. `def` just construct a vanilla constructor, so is not intrusive.

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