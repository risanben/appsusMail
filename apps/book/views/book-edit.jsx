const { useEffect, useState } = React
const { useParams, useNavigate } = ReactRouterDOM

import { bookService } from '../services/book.service.js'
import { showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service.js'

export function BookEdit() {
	const [bookToEdit, setBookToEdit] = useState(bookService.getEmptyBook())
	const navigate = useNavigate()
	const params = useParams()
	document.title = 'Appsus Books'

	useEffect(() => {
		if (params.bookId) loadBook()
	}, [])

	function loadBook() {
		bookService
			.get(params.bookId)
			.then(setBookToEdit)
			.catch(err => {
				console.log('Had issued in book edit:', err)
				navigate('/book')
				showErrorMsg('Book not found!')
			})
	}

	function handleChange({ target }) {
		const field = target.name
		const value = target.type === 'number' ? +target.value || '' : target.value
		if (field === 'amount') {
			setBookToEdit(prevBook => ({ ...prevBook, listPrice: { ...prevBook.listPrice, amount: value } }))
		} else {
			setBookToEdit(prevBook => ({ ...prevBook, [field]: value }))
		}
	}

	function onSaveBook(ev) {
		ev.preventDefault()
		bookService.save(bookToEdit).then(() => {
			navigate('/book')
			showSuccessMsg('Booked saved')
		})
	}

	const {
		title,
		listPrice: { amount },
		description,
		pageCount,
		language,
		publishedDate,
	} = bookToEdit
	return (
		<section className="book-edit">
			<h2>{bookToEdit.id ? 'Edit' : 'Add'} Book</h2>

			<form onSubmit={onSaveBook} className="flex column justify-center book-edit-form">
				<label htmlFor="title">Title:</label>
				<input required onChange={handleChange} value={title} type="text" name="title" id="title" />

				<label htmlFor="amount">Price:</label>
				<input required onChange={handleChange} value={amount} type="number" name="amount" id="amount" />

				<label htmlFor="description">Description:</label>
				<textarea
					className="description"
					onChange={handleChange}
					value={description}
					type="text"
					name="description"
					id="description"></textarea>

				<label htmlFor="pageCount">Page Count:</label>
				<input onChange={handleChange} value={pageCount} type="number" name="pageCount" id="pageCount" />

				<label htmlFor="language">Language:</label>
				<select onChange={handleChange} id="language" value={language} name="language">
					<option value="en">English</option>
					<option value="he">Hebrew</option>
					<option value="sp">Spanish</option>
				</select>

				<label htmlFor="publishedDate">Published Date</label>
				<input
					onChange={handleChange}
					value={publishedDate}
					type="date"
					name="publishedDate"
					id="publishedDate"
				/>

				<button>{bookToEdit.id ? 'Save' : 'Add'}</button>
			</form>
		</section>
	)
}
