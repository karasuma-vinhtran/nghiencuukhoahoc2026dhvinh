function CheckModel() {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(true)
		}, 5000)
	})
}

export default CheckModel
