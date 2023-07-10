const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios')
const cheerio = require('cheerio')
const middleware = require('./utils/middleware')
const { default: gql } = require('graphql-tag')
const gqlprint = require('graphql').print
// import { print } from 'graphql'
// const gql = require('graphql-tag')
// import gql from 'graphql-tag'
const qs = require('node:querystring')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.errorHandler)

app.get('/api/wise', async (request, response, next) => {
	const headers = {
		'Content-Type': 'application/json',
		'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/112.0'
	}
	const params = request.query
	// console.log("queryParams:", params)
	// const info = await axios.get('https://wise.com/gateway/v1/price?sourceAmount=1000&sourceCurrency=MYR&targetCurrency=USD&profileCountry=MY&profileType=PERSONAL&markers=FCF_PRICING')
	const info = await axios.get('https://wise.com/gateway/v1/price', {headers, params})
	// const info = await axios.get(`https://wise.com/gateway/v3/price?sourceAmount=${queryParams.sourceAmount}&sourceCurrency=${queryParams.sourceCurrency}&targetCurrency=${queryParams.targetCurrency}&profileCountry=MY&profileType=PERSONAL&markers=FCF_PRICING`)

	const filteredInfo = info.data.filter(item => item["payInMethod"] === "FPX" && item["payOutMethod"] === "BANK_TRANSFER")[0]
	// console.log(filteredInfo)
	const infoData = {
		rate: filteredInfo["midRate"],
		fee: filteredInfo["total"],
		fintech: "Wise",
	}

	return response.json(infoData)
})

app.get('/api/sunwaymoney', async (request, response, next) => {
	const baseUrl = 'https://sunwaymoney.com/information/getRate/USD'
	const headers = {
		'Content-Type': 'application/json',
		'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/112.0'
	}
	const info = await axios.get(baseUrl, {headers})
	const infoData = {
		rate: parseFloat(info.data.myrRate),
		fee: parseFloat(1.00),
		fintech: 'Sunway Money'
	}

	// const infoData = info.data

	return response.json(infoData)
})

app.get('/api/cimbsg', async (request, response, next) => {
	const baseUrl = 'https://www.cimbclicks.com.sg/sgd-to-myr'
	const headers = {
		// 'Content-Type': 'application/json',
		'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/112.0'
	}
	const info = await axios.get(baseUrl, {headers})
	console.log(info)

	const infoData = info.data

	return response.send(infoData)
})

app.get('/api/yahoofinance', async (request, response, next) => {
	const baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/SGDMYR=X?region=US&lang=en-US&includePrePost=false&interval=2m&useYfid=true&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance'

	const headers = {
		'Content-Type': 'application/json',
		'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/112.0'
	}

	const info = await axios.get(baseUrl, {headers})
	console.log(info)

	const infoData = info.data

	return response.send(infoData)
})

app.get('/api/moneymatch', async (request, response, next) => {
	const baseUrl1 = 'https://transfer.moneymatch.co/utility/rate/MYR/USD'
	const baseUrl2 = 'https://transfer.moneymatch.co/fees?from=MYR&to=USD'
	const headers = {
		'Content-Type': 'application/json',
		'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/112.0'
	}

	const rate = await axios.get(baseUrl1, {headers})
	const fee = await axios.get(baseUrl2, {headers})
	const infoData = {
		rate: rate.data,
		fee: parseFloat((fee.data).toFixed(2)),
		fintech: 'Money Match'
	}
	// console.log(info)
	// const infoData = info.data
	return response.json(infoData)
})

// app.get('/api/worldremit', async (request, response, next) => {
// 	const baseUrl = 'https://cors-anywhere.herokuapp.com/https://api.worldremit.com/graphql'
// 	const headers = {
// 		'content-type': 'application/json',
// 		'x-wr-platform': 'Web',
// 		'user-agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
// 		'origin': 'https://www.worldremit.com',
// 		'x-requested-with': 'XMLHttpRequest'
// 	}

// 	const variables = {
// 			"amount":9995,"type":"SEND","sendCountryCode":"MY","sendCurrencyCode":"MYR","receiveCountryCode":"US","receiveCurrencyCode":"USD","payOutMethodCode":"BNK","correspondentId":"66"
// 		}
	
// 	const query = "mutation createCalculation($amount: BigDecimal!, $type: CalculationType!, $sendCountryCode: CountryCode!, $sendCurrencyCode: CurrencyCode!, $receiveCountryCode: CountryCode!, $receiveCurrencyCode: CurrencyCode!, $payOutMethodCode: String, $correspondentId: String) {\n  createCalculation(\n    calculationInput: {amount: $amount, send: {country: $sendCountryCode, currency: $sendCurrencyCode}, type: $type, receive: {country: $receiveCountryCode, currency: $receiveCurrencyCode}, payOutMethodCode: $payOutMethodCode, correspondentId: $correspondentId}\n  ) {\n    calculation {\n      id\n      informativeSummary {\n        fee {\n          value {\n            amount\n            __typename\n          }\n          __typename\n        }\n        appliedPromotions\n        totalToPay {\n          amount\n          __typename\n        }\n        __typename\n      }\n      send {\n        amount\n        __typename\n      }\n      receive {\n        amount\n        __typename\n      }\n      exchangeRate {\n        value\n        crossedOutValue\n        __typename\n      }\n      __typename\n    }\n    errors {\n      ...GenericCalculationError\n      ...ValidationCalculationError\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment GenericCalculationError on GenericCalculationError {\n  __typename\n  message\n  genericType: type\n}\n\nfragment ValidationCalculationError on ValidationCalculationError {\n  __typename\n  message\n  type\n  code\n  description\n}"

// 	const options = {
// 		method: 'POST',
// 		url: 'https://countries.trevorblades.com/graphql',
// 		headers: {
// 			'content-type': 'application/json',
// 		},
// 		data: {
// 			query: `
// 			{
// 				countries {
// 				  name
// 				}
// 			}
// 		  `
// 		}
// 	}

// 	const data2 = {
// 		variables: variables, 
// 		query: query
// 	}
// 	const info = await axios.post(baseUrl, {headers: {
// 		'content-type': 'application/json',
// 		'x-wr-platform': 'Web',
// 		'user-agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
// 		'origin': 'https://www.worldremit.com',
// 		'x-requested-with': 'XMLHttpRequest'
// 	}
// , data: qs.stringify(data2)})
// 	const infoData = info.data
// 	console.dir(infoData, {depth: null})

// 	return response.json(infoData)
// })


module.exports = app