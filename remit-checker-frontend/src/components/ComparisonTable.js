export const ComparisonTable = ({sourceAmount, wiseData, sunwayMoneyData, moneyMatchData, sourceCurrency, targetCurrency}) => {
	const allData = [wiseData, sunwayMoneyData, moneyMatchData]
	// console.log(allData)

	return (
		<table className="comparison-table">
			<caption style={{display: 'none'}}>A comparison table of fintech remittance companies' exchange rates and final output amount.</caption>
			<thead>
				<tr>
					<th>Aspect</th>
					{allData.map((fintech, index) => <th style={fintech.fintech === 'Wise'? {backgroundColor:'yellowgreen'}: fintech.fintech === 'Sunway Money'? {backgroundColor: 'lightsalmon'}: fintech.fintech === 'Money Match'? {backgroundColor:'gold'}: {}} key={index}>{fintech.fintech}</th>)}
				</tr>
			</thead>
			<tbody>
				<tr>
					<th>Fee in {sourceCurrency}</th>
					{allData.map((fintech, index) => {console.log(fintech); return (<td key={index}>{fintech.fee? (fintech.fee).toFixed(2): ''}</td>)})}
				</tr>
				<tr>
					<th>{sourceCurrency} amount available to exchange</th>
					{allData.map((fintech, index) => <td key={index}>{(sourceAmount-fintech.fee).toFixed(2)}</td>)}
				</tr>
				<tr>
					<th>{sourceCurrency} -{">"} {targetCurrency} exchange rate</th>
					{allData.map((fintech, index) => <td key={index}>{fintech.rate}</td>)}
				</tr>
				<tr>
					<th>Final output amount in {targetCurrency}</th>
					{allData.map((fintech, index) => <td key={index}>{((sourceAmount-fintech.fee)*fintech.rate).toFixed(2)}</td>)}
				</tr>
			</tbody>
		</table>
	)

}