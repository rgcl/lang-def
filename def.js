// wraper based on https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('util'));
    } else {
        root.def = factory();
	}
}(this, function (nodeUtil) {

	// def([string name] [, function parent] [, array mixins] [, object props])
	var def = function def(arg0, arg1, arg2, arg3) {
		// 0. Normalize arguments
		var args = normalizeArguments(arg0, arg1, arg2, arg3),
			props = args.props,
			new_ = (props && props['new']) || function (props) { def.mixin(this, props); },
			proto = {},
			name = args.name,
	 		mixins = args.mixins,
	 		constructor,
	 		mixinProto;
	 	props && (delete props.new);
	 	// 1. Create the constructor
	 	if(!name) {
	 		constructor = function AnonymousConstructor() {
	 			if(!(this instanceof AnonymousConstructor)) {
	 				throw new TypeError('use new AnonymousConstructor(...)');
	 			}
	 			new_.apply(this, arguments);
	 		};
	 	} else {
	 		// If the name is important for you, then this is the best performance way.
	 		// And... yes, "The Function constructor is a form of eval."
	 		constructor = (new Function('new_', 
	 			'return function ' + name + '() {' +
	 			' if(!(this instanceof ' + name + ')) {' +
	 			' throw new TypeError(\'use new ' + name + '(...)\');' +
	 			'} new_.apply(this, arguments); }'))(new_);
	 	}
	 	constructor.mixins_ = {};
	 	// 2. Inherits
	 	if(args.parent) {
	 		def.inherits(constructor, args.parent);
	 	}
	 	// 3. Mixin with mixins
	 	mixins.forEach(function (mixin) {
	 		mixinProto = mixin.prototype;
	 		for(var key in mixinProto) {
	 			proto[key] = mixinProto[key];
	 		}
	 		if(mixinProto.constructor.name) {
	 			constructor.mixins_[mixinProto.constructor.name] = true;
	 		}
	 	});
	 	// 4. Mixin with props
	 	if(props) {
	 		for(var key in props) {
	 			proto[key] = props[key];
	 		}
	 	}
	 	// 5. Asign proto
	 	for(var keyProto in proto) {
	 		constructor.prototype[keyProto] = proto[keyProto];
	 	}
	 	constructor.prototype.super = function (methodName, args) {
            var method = this.getSuper(methodName);
	 		if(method) {
				return method.apply(this, args);
	 		}
	 	};
	 	constructor.prototype.getSuper = function (methodName) {
	 		return this.super_ && this.super_[method];
	 	};
	 	// 6. Return!
	 	return constructor;
	};

	// Inject the inherits depending of the environment
	if(nodeUtil) {
		def.inherits = nodeUtil.inherits;
	} else {
		// based on https://github.com/isaacs/inherits
		if (typeof Object.create === 'function') {
		 	def.inherits = function inherits(Class, Base) {
		    	Class.super_ = Base;
		    	Class.prototype = Object.create(Base.prototype, {
			     	constructor: {
		       			value: Class,
		       			enumerable: false,
		    			writable: true,
		    			configurable: true
		     		}
		   		});
		 	};
		} else {
		 	// old school shim for old browsers
		 	def.inherits = function inherits(Class, Base) {
				Class.super_ = Base;
		   		var TempCtor = function () {};
		    	TempCtor.prototype = Base.prototype;
		    	Class.prototype = new TempCtor();
		    	Class.prototype.constructor = Class;
		  	};
		}
	}

	def.mixinOf = function def_mixinOf(instance, Mixin) {
		if(!instance._mixins_) {
			return false;
		}
		return !!instance.mixins_[Mixin.name];
	};

	def.instanceOf = function def_instanceOf(instance, ClassOrMixin) {
		return (instance instanceof ClassOrMixin) ||
			def.mixinOf(instance, ClassOrMixin);
	};

	def.mixin = function def_mixin(arg0) {
		if(arguments.length < 2) {
			return arg0;
		}
		var objects = arguments,
			result = objects[0],
			length = objects.length,
			object;
		for(var i = 1; i < length; i++) {
			object = objects[i];
			for(var key in object) {
				if(object.hasOwnProperty(key)) {
					result[key] = object[key];
				}
			}
		}
		return result;
	};

	// normalizeArguments([string name] [, function parent] [, array mixins] [, object props])
	function normalizeArguments(arg0, arg1, arg2, arg3) {
		// v8 hidden classes
		var args = { name: '', parent: null, mixins: [], props: null };
		if(!arg0) {
			// def()
			return args;
		}
		var arg0Type = typeof arg0,
			arg1Type = typeof arg1;
		if(arg0 instanceof Array) {
			args.mixins = arg0;
			if(arg1Type === 'object') {
				args.props = arg1;
			}
			// def(array mixins [, object props])
			return args;
		}
		if(arg0Type === 'object') {
			args.props = arg0;
			// def(object props)
			return args;
		}
		if(arg0Type === 'function') {
			args.parent = arg0;
			if(arg1 instanceof Array) {
				args.mixins = arg1;
				if(typeof arg2 === 'object') {
					args.props = arg2;
				}
				// def(function parent [, array mixins [, object props]])
				return args;
			}
			if(arg1Type === 'object') {
				args.props = arg1;
			}
			// def(function parent [, object props])
			return args;
		}
		if(arg0Type === 'string') {
			args.name = arg0;
			if(arg1Type === 'function') {
				args.parent = arg1;
				if(arg2 instanceof Array) {
					args.mixins = arg2;
					if(typeof arg3 === 'object') {
						args.props = arg3;
					}
					// def(string name, function parent, array mixins [, object props])
					return args;
				}
				if (typeof arg2 === 'object') {
					args.props = arg2;
				}
				// def(string name, function parent [, object props])
				return args;
			}
			if(arg1 instanceof Array) {
				args.mixins = arg1;
				if(typeof arg3 === 'object') {
					args.props = arg3;
				}
				// def(string name , array mixins [, object props]]])
				return args;
			}
			if(arg1Type === 'object') {
				args.props = arg1;
			}
			// def(string name [, object props])
			return args;
		}
		return args;
	}

	return def;

}));
