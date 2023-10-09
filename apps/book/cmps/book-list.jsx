const { Link } = ReactRouterDOM

import { BookPreview } from './book-preview.jsx'

export function BookList({ books, onRemoveBook }) {
	return (
		<ul className="book-list">
			{books.map(book => (
				<li key={book.id}>
					<BookPreview book={book} />
					<section>
						<button onClick={() => onRemoveBook(book.id)}>Remove Book</button>
						<Link to={`/book/${book.id}`}>Details</Link>
						<Link to={`/book/edit/${book.id}`}>Edit</Link>
					</section>
				</li>
			))}
		</ul>
	)
}
