import era = require('./engine/era')

(async function (): Promise<void> {
	await era.init()
	era.title('Hello Era.js')
	era.page()
	era.t('123321')
	era.t()
	era.t('aaaa')
	era.t()
	era.t('abababa')
	era.t()
	era.b('click this to change!', function (): void {
		era.page()
		era.t('You are in a new page now!')
	})
})()
