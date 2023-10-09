export function MailSort({ onSetSortBy, sortBy }) {

	const sorts = ['read', 'starred', 'date', 'subject']

	function onChangeSort(by) {
		const dir = (sortBy.by !== by) ? 1 : sortBy.dir * -1
		const newSort = {
			by,
			dir
		}
		onSetSortBy(newSort)
	}

	function getSortBtnClassName(sort) {
		let className = "sort-by-" + sort
		if (sortBy.by === sort) {
			className += ' active'
		}
		return className
	}

	return (
		<section className="mail-sort">
			{
				sorts.map(sort => <button key={sort}
					onClick={() => onChangeSort(sort)}
					className={getSortBtnClassName(sort)}
				>
					{sort}
					{(sortBy.by === sort && sortBy.dir === 1) && <span className="material-symbols-outlined">arrow_downward</span>}
					{(sortBy.by === sort && sortBy.dir === -1) && <span className="material-symbols-outlined">arrow_upward</span>}
				</button>)
			}
		</section>
	)
}
