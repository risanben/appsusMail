
import { utilService } from './../services/util.service.js';
const { useState, useRef, useEffect } = React

export function MailFilter({ filterBy, onSetFilter }) {
	const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
	const debouncedSetFilter = useRef(utilService.debounce(onSetFilter, 500))

	useEffect(() => {
		debouncedSetFilter.current(filterByToEdit)
	}, [filterByToEdit])

	function handleChange({ target }) {
		const { name: field, value } = target
		setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
	}

	return (
		<form className="header-search">
			<div className="input-container">
				<label title="search" htmlFor="txt" className="material-symbols-outlined">
					search
				</label>
				<input
					value={filterByToEdit.txt}
					onChange={handleChange}
					type="text"
					name="txt"
					id="txt"
					placeholder={`Search`}
				/>
			</div>
		</form>
	)
}
