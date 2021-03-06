import React from 'react'
import MainTableRow from './MainTableRow'
import Loading from '../Loading'

export default function TableBody(props) {
	
	//Counter for rendered rows
	let rowCount = 1
	
	//Loading option
	if (props.data.status === 'Pending' && !props.noLoading && props.data.isDataset && props.data.read().length === 0){
		return <div 
			style={{ 
				width: props.tableRef.current ? props.tableRef.current.clientWidth : '100%',
			}} 
			className='loadingContainer flexCenter'
		>
			<Loading style={{ fontSize: '40pt' }} />
		</div> 
	}
	
	return (
		<div className={'TableBody tableBody ' + props.data.lastResolved}>
			
			{props.dataArray.map((dr, idx) => {
				//render the allowed numebr of rows, on th selected page
				if (!props.pageSize || ((rowCount > props.activePage * props.pageSize) && (rowCount <= (1 + props.activePage) * props.pageSize))) {

					let renderRow = dr !== []
					
					
					if (props.searchable && props.metaData[idx]) {
						renderRow = !props.metaData[idx].searchHidden
					}

					renderRow = renderRow && (props.noFilter || (props.metaData[idx] && props.metaData[idx].visible))

					const rowKey = dr[props.data.primaryKey] ? dr[props.data.primaryKey] : idx

					if(renderRow){
						rowCount++
						
						return <MainTableRow
							dataRow={dr}
							dataset={props.data}
							dataHeaders={props.dataHeaders}
							rowKey={rowKey}
							key={rowKey}
							locked={props.locked}
							dynamic={props.dynamic}
							rowIndex={idx}
							nestedComponent={props.nestedComponent}
							nestedProps={props.nestedProps}
							noActive={props.noActive}
							tableRef={props.tableRef}
							expandedRows={props.expandedRows}
							setExpandedRows={props.setExpandedRows}
						/> 
					} else{
						return null
					}
						
				} else if (rowCount <= (1 + props.activePage) * props.pageSize) { rowCount++ }

				return null
			})}
			
		</div>
	)
}
