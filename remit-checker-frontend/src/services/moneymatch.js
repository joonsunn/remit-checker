import axios from "axios";

const baseUrl = '/api/moneymatch'

const getMoneyMatchOutput = async () => {
	const response = await axios.get(baseUrl)

	return response.data
}

const moneyMatchService = {
	getMoneyMatchOutput
}

export default moneyMatchService