import React, {useState} from 'react'
import MenuButton from '../MenuButton'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWindowRestore, faCheck, faTimes} from '@fortawesome/free-solid-svg-icons'
import './SaveTableLayout.css'
import ConfirmButton from '../../Inputs/ConfirmButton'

export default function SaveTableLayout(props) {
	
	const [saveName, setSaveName] = useState('')
	const [validClass, setValidClass] = useState('')
	
	function changeHandler(e){
		setSaveName(e.target.value)
		setValidClass('')
	}
	
	function commitHandler(){
		
		if(saveName.trim() === ''){
			setValidClass('invalid')
		} else{
			setSaveName('')
			props.headers.saveLayout(saveName)
		}	
	}
	
	function keyDownHandler(e) {
		if (e.key === 'Enter') {
			commitHandler()
			e.target.blur()
		}
	}
	
	
	function applyLayout(f){
		props.headers.loadLayout(f)
		props.data.filter()

	}
	
	const savedLayouts = props.headers.getSavedLayouts()
	
	return (
		<MenuButton
			locked={false}
			onClose={() => setValidClass('')}
			menuStyle = {{minWidth:'200px', maxWidth: '300px'}}
			menuContent={
				<div className='SaveTableLayout'>

					<div className='inputMenu'>
						<span>Save Current Layout</span>
						<br />
						<input className={'input ' + validClass}
							value={saveName}
							onChange={changeHandler}
							onKeyDown={keyDownHandler}
						/>
						<span className="commitIcon" onClick={commitHandler}>
							<FontAwesomeIcon icon={faCheck} />
						</span>
					</div>
					
					
					{Object.keys(savedLayouts).map((f) => {
						return (
							<button
								className = {'layoutButton'}
								key = {'saveLayoutButton' + f}
								onClick={()=>{applyLayout(f)}}
							>
								
								<ConfirmButton 
									className='cancelIcon'
									onClick = {(e)=>{
										props.headers.deleteLayout(f)
										e.stopPropagation()
									}}
									content = {<FontAwesomeIcon icon={faTimes} />}
									expandedContent = {'Delete'}
									style={{
										backgroundColor: 'var(--cardBG)',
										color: 'var(--lockedTextColor)',
										padding: '0 5px',
									}}
									locked = {false}
								/>
								
								<span className = 'layoutButtonText'>{savedLayouts[f].name}</span>
							</button>
						)
					})}


				</div>

			}>
				
			<span className=''>
				<FontAwesomeIcon icon={faWindowRestore} />
			</span> Saved Layouts
		</MenuButton>
	)
}