import React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTimes} from '@fortawesome/free-solid-svg-icons'

export default function SortMenu(props){
	
	function sortData(e){
		props.dataHeaders.addSortRule(props.header.index, e.target.value)
	}
	
	const sortDir = props.header.sortRule

	const cancelIcon = <span className = 'sortIcon' onClick={(e)=>{
		props.dataHeaders.removeSortRule(props.header.index)
		e.stopPropagation()
	}}>
		<FontAwesomeIcon icon={faTimes} />
	</span>
	
	return (
		<div className='SortMenu'>
			<button onClick={sortData} className='fullButton sortButton' value={'asc'}>
				Sort Ascending
				{sortDir === 'asc' ? cancelIcon : null}
			</button>
			
			<button onClick={sortData} className='fullButton sortButton' value={'desc'}>
				Sort Descending
				{sortDir === 'desc' ? cancelIcon : null}
			</button>
		</div>
	)
}