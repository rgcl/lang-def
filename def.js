// based on https://github.com/umdjs/umd/blob/master/returnExports.js
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
			new_ = (args.props && args.props.new) || function () {},
			proto = {},
			props = args.props,
	 		mixins = args.mixins,
	 		mixinProto;
	 	(props && (delete props.new));
	 	// 1. Inherits
	 	if(args.parent) {
	 		def.inherits(new_, args.parent);
	 	}
	 	// 2. Mixin with mixins
	 	mixins.forEach(function (mixin) {
	 		mixinProto = mixin.prototype;
	 		for(var key in mixinProto) {
	 			proto[key] = mixinProto[key];
	 		}
	 	});
	 	// 3. Mixin with props
	 	if(props) {
	 		for(var key in props) {
	 			proto[key] = props[key];
	 		}
	 	}
	 	// 4. Asign proto
	 	for(var keyProto in proto) {
	 		new_.prototype[keyProto] = proto[keyProto];
	 	}
	 	new_.prototype.super = function (method, args) {
	 		if(this.super_ && this.super_[method]) {
				return this.super_[method].apply(this, args);
	 		}
	 	};
	 	// 5. Return!
	 	return new_;
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

	// Inject mixinOf
	// TODO
	def.mixinOf = function(Class, Mixin) {
		if(!Class._mixins_) {
			return false;
		}
		return Class._mixins_[Mixin];
	}

	// normalizeArguments([string name] [, function parent] [, array mixins] [, object props])
	function normalizeArguments(arg0, arg1, arg2, arg3) {
		console.log('normalizeArguments:inputs', arguments);
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
