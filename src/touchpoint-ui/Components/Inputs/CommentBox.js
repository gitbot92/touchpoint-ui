import React, {useContext} from 'react'
import lockedContext from '../../Contexts/LockedContext'
import PropTypes from 'prop-types'
import './CommentBox.css'

export default function CommentBox(props) {
	
	//deccides if the component is locked based on props and parents in the tree
	const lockedFromAbove = useContext(lockedContext)
	const locked = props.locked || (lockedFromAbove && props.locked ===undefined)
		
	let lockedClass = ''
	if (locked){lockedClass = 'locked '}
	
	//handles the onChange event. Only fires if component is not locked
	function changeHandler(e){
		if(!locked && props.onChange !== undefined){
			props.onChange(e)
		} 
	}
	
	function blurHandler(e){
		if(!locked && props.onBlur){
			props.onBlur(e)
		} 
	}
	
	return (
		<textarea
			className={"input CommentBox " + lockedClass}
			defaultValue={props.defaultValue}
			onChange={changeHandler}
			readOnly={locked}
			placeholder={props.placeholder}
			onBlur = {blurHandler}
			style = {props.style}
			value={props.value}
		></textarea>
	)
}

//Proptypes
CommentBox.propTypes = {
	locked: PropTypes.bool,
	defaultValue: PropTypes.string,
	onChange: PropTypes.func,
	hidden: PropTypes.bool,
	onEnter: PropTypes.func,
	placeholder: PropTypes.string,
	className: PropTypes.string,
	height: PropTypes.string,
	width: PropTypes.string,
	value: PropTypes.string,
}

