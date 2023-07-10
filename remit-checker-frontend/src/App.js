import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import wiseService from './services/wise.js';
import axios from "axios";
import sunwayMoneyService from './services/sunwaymoney';
import moneyMatchService from './services/moneymatch';
import { ComparisonTable } from './components/ComparisonTable';

function App() {
	const [wiseData, setWiseData] = useState([])
	const [sourceAmount, setSourceAmount] = useState(10000)
	const [targetCurrency, setTargetCurency] = useState('USD')
	const [sourceCurrency, setSourceCurrency] = useState('MYR')
	const [targetAmount, setTargetAmount] = useState([])
	const [sunwayMoneyData, setSunwayMoneyData] = useState([])
	const [moneyMatchData, setMoneyMatchData] = useState([])
	const [lastUpdated, setLastUpdated]= useState([])
	
	useEffect(() => {document.title = `Remit Checker`})

	const getAll = async () => {
		await getWise();
		await getSunwayMoney();
		await getMoneyMatch()
	}

	useEffect(() => {
		getAll()
		}, [sourceAmount])

	// useEffect(() => {
	// 	getSunwayMoney()
	// 	}, [sourceAmount])

	// useEffect(() => {
	// 	getMoneyMatch()
	// 	}, [sourceAmount])

	const getWise = async () => {
		const response = await wiseService.getWiseOutput(sourceAmount, sourceCurrency, targetCurrency)
		setWiseData(await response)
		setTargetAmount(await response.targetAmount)
		const timeDate = new Date()
		timeDate.toLocaleString("en-UK", { timeZone: 'Asia/Shanghai' })
		const timeDate2 = (new Intl.DateTimeFormat('en-US', {dateStyle: 'full', timeStyle: 'long', timeZone: 'Asia/Kuala_Lumpur'}).format(timeDate))
		setLastUpdated(timeDate2)
		// console.log(response.targetAmount)
		// console.log(response)
		// console.log(example)
		return response
	}

	const getSunwayMoney = async () => {
		const response = await sunwayMoneyService.getSunwayMoneyOutput()
		setSunwayMoneyData(await response)
		return response
	}

	const getMoneyMatch = async () => {
		const response = await moneyMatchService.getMoneyMatchOutput()
		setMoneyMatchData(await response)
		return response
	}

	// const handleAmountChange = async () => {

	// }

	const handleFormSubmission = (event) => {
		event.preventDefault()
		getAll()
	}
	
	return (
    <div className='app'>
		<div className='center'>
			<div className='header'>
				Check exchange rate of various fintech remittance companies
			</div>
			<div className='input-section'>
				<form className='input-form' onSubmit={handleFormSubmission}>
						<span>Source amount in MYR:</span> <input value={sourceAmount} onChange={(event) => {
						setSourceAmount(event.target.value); 
						}}></input>
						<button className='run-check-button' onClick={() => getWise()}>Check</button>
				</form>
					<div>
						Click the 'check' button to manually refresh the exchange rate and fees data.
					</div>
			</div>
			<ComparisonTable sourceAmount={sourceAmount} sourceCurrency= {sourceCurrency} targetCurrency={targetCurrency} wiseData={wiseData} sunwayMoneyData={sunwayMoneyData} moneyMatchData={moneyMatchData}></ComparisonTable>
			{/* <div className='wise'>
				<div>
					Wise fees in {sourceCurrency}: {wiseData.fee}
				</div>
				<div>
					Amount available for exchange: {sourceAmount - wiseData.fee}
				</div>
				<div>
					Wise exchange rate: {parseFloat(wiseData.rate)} <br></br>
				</div>
				<div>
					Wise amount in {targetCurrency} (after fees): {(parseFloat(wiseData.rate) * (sourceAmount - wiseData.fee)).toFixed(2)}<br></br>
				</div>
			</div> */}
			{/* <div className='sunway-money'>
				<div>
					Sunway Money fees in {sourceCurrency}: {sunwayMoneyData.fee}
				</div>
				<div>
					Amount available for exchange: {sourceAmount - sunwayMoneyData.fee}
				</div>
				<div>
					Sunway Money rate: {(sunwayMoneyData.rate)} <br></br>
				</div>
				<div>
					Sunway Money amount in {targetCurrency} (after fees): {((sunwayMoneyData.rate) * (sourceAmount - sunwayMoneyData.fee)).toFixed(2)}<br></br>
				</div>
			</div> */}
			{/* <div className='money-match'>
				<div>
					Money Match fees in {sourceCurrency}: {moneyMatchData.fee}
				</div>
				<div>
					Amount available for exchange: {sourceAmount - moneyMatchData.fee}
				</div>
				<div>
					Money Match rate: {(moneyMatchData.rate)}<br></br>
				</div>
				<div>Money Match amount in {targetCurrency} (after fees): {((sourceAmount -moneyMatchData.fee)*(moneyMatchData.rate)).toFixed(2)}</div>
			</div> */}
			
			<div className='last-updated-time'>
				Data last updated: {JSON.stringify(lastUpdated).replace(/"/g, '')}
			</div>
			<div>
				<p>
					Note 1: In the interest of making an apples-to-apples comparison, the basis for the remittances above are as funded from an external source (e.g. FPX), and directly deposited via the fintech service to a destination bank account. 
				</p>
				<p>
					Note 2: Transaction limits are not incorporated into this calculator. Fintech remittances usually have an MYR30,000 daily transaction limit. Check with the service provider for more info.
				</p>
				<p>
					Disclaimer: Information shown in this page are for demonstration purposes only and is not to be relied upon.
				</p>
			</div>
		</div>
    </div>
  );
}
export default App;
