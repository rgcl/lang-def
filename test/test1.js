
// TODO, incomplete test!

var Eatable = def({
	eat: function () {
		return 'yummy'
	}
})

var Animal = def([Eatable], {
	new: function (sex) {
		this.sex = sex;
	},
	play: function () {
		return ':)'
	}
})

var Person = def(Animal, {
	new: function (name, sex) {
		this.super(sex);
		this.name = name;
	},
	speak: function() {
		return 'Hi, my name is ' + this.name;
	}
})