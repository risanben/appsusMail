const { useEffect, useState } = React
const { Link } = ReactRouterDOM

import { showSuccessMsg } from '../../../services/event-bus.service.js'
import { BookFilter } from '../cmps/book-filter.jsx'
import { BookList } from '../cmps/book-list.jsx'
import { bookService } from '../services/book.service.js'

export function BookIndex() {
	const [books, setBooks] = useState([])
	const [filterBy, setFilterBy] = useState(bookService.getDefaultFilter())
	document.title = 'Appsus Books'
	useEffect(() => {
		loadBooks()
	}, [filterBy])

	function loadBooks() {
		bookService.query(filterBy).then(setBooks)
	}

	function onRemoveBook(bookId) {
		bookService.remove(bookId).then(() => {
			const updatedBooks = books.filter(book => book.id !== bookId)
			setBooks(updatedBooks)
			showSuccessMsg(`Book removed!`)
		})
	}

	function onSetFilter(filterBy) {
		setFilterBy(prevFilterBy => ({ ...prevFilterBy, ...filterBy }))
	}

	return (
		<section className="book-index full main-layout">
			<BookFilter onSetFilter={onSetFilter} filterBy={filterBy} />
			<Link to="/book/edit">Add Book</Link>
			<Link to="/book/add-from-google">Add Book From Google</Link>
			<BookList books={books} onRemoveBook={onRemoveBook} />
		</section>
	)
}
