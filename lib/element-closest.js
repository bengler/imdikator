if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector
}

if (!Element.prototype.closest) {
	console.log('tries to create a .closest() function because it does not exist')
	Element.prototype.closest = function (s) {
		let el = this
		if (!document.documentElement.contains(el)) return null

		do {
			console.log(el.matches(s))
			if (el.matches(s)) return el
			el = el.parentElement
		} while (el !== null)
		return null
	}
}
