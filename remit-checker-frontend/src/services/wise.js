import axios from "axios";

const baseUrl = '/api/wise'

// const params = {
// 	sourceAmount: 1000,
// 	sourceCurrency: 'MYR',
// 	targetCurrency: 'USD',
// 	profileCountry: 'MY',
// 	profileType: 'PERSONAL',
// 	markers: 'FCF_PRICING'
// }

const getWiseOutput = async (sourceAmount, sourceCurrency, targetCurrency) => {
	
	const params = {
		sourceAmount: sourceAmount,
		sourceCurrency: sourceCurrency,
		targetCurrency: targetCurrency,
		profileCountry: 'MY',
		// profileType: 'PERSONAL',
		// markers: 'FCF_PRICING'
	}
	
	const response = await axios.get(`${baseUrl}`, {params})

	return response.data
}

// const getWiseMYRUSD = async ({ sourceAmount, sourceCurrency, targetCurrency }) => {
// 	const response = await getWiseOutput(sourceAmount, sourceCurrency, targetCurrency)
	
// 	const filteredResponse = response.filter(item => item["payInMethod"] === "BALANCE" && item["payOutMethod"] === "BANK_TRANSFER")[0]

// 	return filteredResponse.targetAmount
// }

const wiseService = {
	getWiseOutput
}

export default wiseService