import {useState} from 'react'
import DataHeader  from '../DataObjects/DataHeader'
import {v4 as uuid} from 'uuid'


//Crates a set of DataHeaders, for use with a mainTable
export default function useHeaders(dataHeaders = []) {
	
	function normalize(headerArray){
		let totalWidth = 0
		headerArray.forEach((hdr)=>{
			if(hdr.visible){totalWidth = totalWidth + hdr.width}
		})
		
		return headerArray.map((hdr, i)=>{
			hdr.width = 99 * (hdr.width / totalWidth)
			hdr.index = i
			return hdr
		})
	}
	
	const [headers, setHeadersFinal] = useState(normalize(dataHeaders.map((hdr) => {
		return (new DataHeader(hdr))
	})))
	
	
	const [savedLayouts, setSavedLayouts] = useState({})
	const [settingsEngine, setSettingsEngine] = useState({ save: () => { } })
	const [tokenTrigger, setTokenTrigger] = useState(false)
	
	
	//Coverts the current layout to JSON and saves it
	function saveLayout(layoutName){
		const newLayouts = {...savedLayouts}
		
		const saveID = uuid()
		
		newLayouts[saveID] = {
			name: layoutName,
			headerOptions: {}
		}
		
		headers.forEach((h)=>{
			newLayouts[saveID].headerOptions[h.headerID] = {
				visible: h.visible,
				filterList: []
			}
			
			Object.values(h.filterList).forEach((f) => {
				if (f.options) { newLayouts[saveID].headerOptions[h.headerID].filterList.push( f.options )}
			})
		})
		
		setSavedLayouts(newLayouts)
		setTokenTrigger(true)
	}
	
	function loadLayout(id){
		if(savedLayouts[id]){
			
			const newHeaders = []
			
			headers.forEach(h=>{
				h.clearFilter()
				h.setVisible(savedLayouts[id].headerOptions[h.headerID].visible)
				
				savedLayouts[id].headerOptions[h.headerID].filterList.forEach((f)=>{
					h.addFilter(f)
				})
				
				newHeaders.push(h)
			})
				
			setHeaders(normalize(newHeaders))
		}
	}
	
	function deleteLayout(id){
		const newLayouts = {...savedLayouts}
		delete newLayouts[id]
		setSavedLayouts(newLayouts)
		setTokenTrigger(true)
	}
	
	
	//Saves a list of unique values in each column (header) - to be used in the filter dropdowns
	function embedData(data, metaData) {
		
		const newHeaders = [...headers]
		
		newHeaders.forEach((hdr) => {
			hdr.embedData(data, metaData)
		})

		//using Immer to edit the header state while keeping it immutable
		setHeaders(newHeaders)
	}
	
	function applyToken(token){
		const newSettings = JSON.parse(token)
		setSavedLayouts(newSettings.savedLayouts)
	}
	
	
	function setHeaders(headerList) {
		setHeadersFinal(normalize(headerList))
	}
	
	//If settings have changed since the last render, create and save a new token
	if (tokenTrigger) {
		setTokenTrigger(false)
		
		const res = {
			savedLayouts: savedLayouts
		}

		settingsEngine.save(JSON.stringify(res))
	}

	return ({
		get: () => {return headers},
		
		set: setHeaders,
		
		embedData: embedData,
		applyToken: applyToken,
		saveLayout: saveLayout,
		loadLayout: loadLayout,
		deleteLayout: deleteLayout,
		getSavedLayouts: ()=>{return savedLayouts},
		setSettingsEngine: setSettingsEngine
	})
}