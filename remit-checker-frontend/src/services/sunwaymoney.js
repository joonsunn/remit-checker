import axios from "axios";

const baseUrl = '/api/sunwaymoney'

const getSunwayMoneyOutput = async () => {
	const response = await axios.get(baseUrl)

	return response.data
}

const sunwayMoneyService = {
	getSunwayMoneyOutput
}

export default sunwayMoneyService