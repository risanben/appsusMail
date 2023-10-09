const { useEffect, useState } = React
const { useParams, useNavigate } = ReactRouterDOM
const { Link } = ReactRouterDOM

import { showSuccessMsg } from '../../../services/event-bus.service.js'
import { LongTxt } from '../cmps/long-txt.jsx'
import { ReviewList } from '../cmps/review-list.jsx'
import { bookService } from '../services/book.service.js'
import { utilService } from '../../../services/util.service.js'

export function BookDetails() {
	const [book, setBook] = useState(null)
	const [nextBookId, setNextBookId] = useState(null)
	const [prevBookId, setPrevBookId] = useState(null)
	document.title = 'Appsus Books'

	const { bookId } = useParams()
	const navigate = useNavigate()

	useEffect(() => {
		loadBook()
		loadNextBookId()
		loadPrevBookId()
	}, [bookId])

	function loadBook() {
		bookService
			.get(bookId)
			.then(book => {
				setBook(book)
			})
			.catch(err => {
				console.log('Had issued in book details:', err)
				navigate('/book')
			})
	}

	function onBack() {
		navigate('/book')
	}

	if (!book) return <div>Loading...</div>

	const {
		thumbnail,
		reviews,
		id,
		title,
		subtitle,
		listPrice: { amount, isOnSale, currencyCode },
		pageCount,
		publishedDate,
		description,
	} = book

	function txtPageCount() {
		if (pageCount > 500) return 'Serious Reading'
		else if (pageCount > 200) return 'Descent Reading'
		else if (pageCount < 100) return 'Light Reading'
		else return ''
	}

	function txtPublishDate() {
		const currentYear = new Date().getFullYear()
		const diff = currentYear - publishedDate

		if (diff > 10) return 'Vintage'
		else if (diff < 1) return 'New'
		else return ''
	}

	function getPriceColor() {
		if (amount > 150) return 'red'
		else if (amount < 20) return 'green'
		else return ''
	}

	function onRemoveReview(bookId, reviewId) {
		bookService.removeReview(bookId, reviewId)
		const updatedReviews = book.reviews.filter(review => review.id !== reviewId)
		setBook(prevBook => ({ ...prevBook, reviews: [...updatedReviews] }))
		showSuccessMsg('Review deleted')
	}

	function loadNextBookId() {
		bookService.getNextBookId(bookId).then(setNextBookId)
	}

	function loadPrevBookId() {
		bookService.getPrevBookId(bookId).then(setPrevBookId)
	}

	return (
		<section className="book-details">
			<h1>Book Title: {title}</h1>
			<h2>Sub Title: {subtitle}</h2>
			<h3 className={getPriceColor()}>
				Price: {amount}
				{utilService.getSymbolCurrency(currencyCode)}
			</h3>
			<h3 className="on-sale">{isOnSale ? 'On Sale!' : ''}</h3>
			<img src={thumbnail ? `${thumbnail}` : `../assets/img/default-book.png`} alt={title} />
			<h3>Description:</h3>
			<LongTxt txt={description} length={100} />
			<h3>
				Published date: {publishedDate} | {txtPublishDate()}
			</h3>
			<h3>
				Number of pages: {pageCount} | {txtPageCount()}{' '}
			</h3>

			<Link to={`/book/${id}/review`}>Add Review</Link>

			{!!book.reviews.length && <ReviewList reviews={reviews} onRemoveReview={onRemoveReview} bookId={id} />}
			<section>
				<Link to={`/book/${nextBookId}`}>Next book</Link>

				<Link to={`/book/${prevBookId}`}>Prev book</Link>
			</section>
			<button onClick={onBack}>Back</button>
		</section>
	)
}
