import {useState, useEffect} from 'react'
import useModuleData from '../Hooks/UseModuleData'


//Initialises a Dataset and caches the value
export default function useDataset(fetcher, defaultValue = [{}]) {
	
	const fetchFunction = fetcher.TouchPointIsSubdataset ? fetcher.func : fetcher 
	
	//The array contains an empty object by default
	const [data, setData] = useState(defaultValue)
	const [metaData, setMetaData] = useState([{visible: true, filteredBy: ''}])
	const [status, setStatus] = useState('Pending')
	const [lastResolved, setLastResolved] = useState()
	const [headers, setHeaders] = useState({ get: () => { return [] } })
	const [subs, setSubs] = useState([])
	
	//Search data on change
	const searchText = useModuleData().get('TouchPointSearchText')
	
	useEffect(() => {
		setData(produce(data, draftData => {
			draftData.map((r) => {

				r.TouchPointMetaSearchHide = false
				
				if(searchText){
					r.TouchPointMetaSearchHide = !headers.get().some((hdr) => {
						return hdr.dataType.search(r[hdr.headerID], searchText)
					})
				}

				return r
			})
		}))
	}, [searchText])

	//Filters the data based on given headers
	function filterData(values){
		
		const newMetaData = []
		
		values.forEach((r) => {
			
			const rowMeta = {}
			
			rowMeta.filteredBy = ''
			
			let noRender = false
			headers.get().forEach((h) => {
				//filter
				if (!h.filter(r[h.headerID], r)) {
					noRender = true
					rowMeta.filteredBy = rowMeta.filteredBy + [h.headerID] + ';'
				}
			})

			rowMeta.visible = !noRender 
			newMetaData.push(rowMeta)
		})
		
		return newMetaData
	}
	
	//Fetch data and update state once the operation is complete. Keep the old value in the meantime
	async function fetchData() {
		setStatus('Pending')

		try {
			const value = await fetchFunction()
			
			setMetaData(filterData(value))
			setData(value)
			
			setStatus('Resolved')
			setLastResolved(Date())
			
			subs.forEach((subRefresh) => {
				subRefresh()
			})

			return status
		} catch (e) {
			setStatus('Rejected')
			console.error(e)
			return status
		}
	}
	
	//If it's a subdataset, forward the refresh request to the parent
	async function refreshData(){
		if(fetcher.TouchPointIsSubdataset){
			fetcher.refreshParent()
		} else if (status !== 'Pending') {
			fetchData()
		}
	}
	
	//Automatically run the fetching function the first time, then wait for a refresh
	//If the dataset was spawned by a parent dataset, send its refresh function to the parent, so it can refresh when the parent refreshes
	useEffect(()=>{ 
		fetchData() 
		if(fetcher.TouchPointIsSubdataset){
			fetcher.embedInParent(fetchData)
		}
	},[])
	
	//Return a Dataset object
	return ({
		read: () => { return data },
		getMetaData: ()=>{ return metaData },

		refresh:refreshData,

		status: status,
		lastResolved: lastResolved,
		setHeaders: setHeaders,
		isDataset: true,
		
		filter: () => {
			const newMeta = filterData(data)
			setMetaData(newMeta)
			headers.embedData(data, newMeta)
		},
		
		
		sub: (filterFunction) =>{
			return {
				func: async () => {
					return (data.filter((r) => filterFunction(r)))
				}, 
				
				embedInParent: (refresher) => {
					const newSubs = [...subs]
					newSubs.push(refresher)
					setSubs(newSubs)
				}, 
				
				refreshParent: refreshData,
				
				TouchPointIsSubdataset: true,
			}
		}
	})
}