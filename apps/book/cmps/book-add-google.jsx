const { useEffect, useState } = React
const { useNavigate } = ReactRouterDOM

import { bookService } from '../services/book.service.js'
import { showSuccessMsg } from '../../../services/event-bus.service.js'

export function BookAddFromGoogle() {
	const [booksFromGoogle, setbooksFromGoogle] = useState([])
	const [searchWord, setSearchWord] = useState('Harry')
	const navigate = useNavigate()

	useEffect(() => {
		loadBooksFromGoogle(searchWord)
	}, [searchWord])

	function loadBooksFromGoogle(searchWord) {
		bookService.getBooksFromGoogle(searchWord).then(setbooksFromGoogle)
	}

	function handleChange({ target }) {
		const value = target.value
		setSearchWord(() => value)
	}

	function onAddGoogleBook(book) {
		bookService.addGoogleBook(book).then(() => {
			showSuccessMsg('Booked saved')
			navigate('/book')
		})
	}

	return (
		<section className="book-add-from-google">
			<h1>Add book from Google</h1>
			<label htmlFor="search-book">Search book from google</label>
			<input type="text" id="search-book" name="search-book" onChange={handleChange} value={searchWord}></input>
			<section>
				<ul>
					{booksFromGoogle.map(book => (
						<li key={book.title}>
							{book.title}
							<button onClick={() => onAddGoogleBook(book)}> + </button>
						</li>
					))}
				</ul>
			</section>
		</section>
	)
}
