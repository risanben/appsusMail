const { Route, Routes } = ReactRouterDOM
const Router = ReactRouterDOM.HashRouter

import { AppHeader } from './cmps/app-header.jsx'
import { Home } from './views/home.jsx'
import { MailIndex } from './apps/mail/views/mail-index.jsx'
import { NoteIndex } from './apps/note/views/note-index.jsx'
import { MailCompose } from './apps/mail/cmps/mail-compose.jsx'
import { UserMsg } from './cmps/user-msg.jsx'
import { BookIndex } from './apps/book/views/book-index.jsx'
import { BookDetails } from './apps/book/views/book-details.jsx'
import { BookEdit } from './apps/book/views/book-edit.jsx'
import { AddReview } from './apps/book/cmps/add-review.jsx'
import { ReviewPreview } from './apps/book/cmps/review-preview.jsx'
import { BookAddFromGoogle } from './apps/book/cmps/book-add-google.jsx'
import { MailDetails } from './apps/mail/cmps/mail-details.jsx'

export function App() {
	return (
		<Router>
			<section className="app">
				<AppHeader />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/mail/:folder" element={<MailIndex />} >
						<Route path="/mail/:folder/details/:mailId" element={<MailDetails />} />
						<Route path="/mail/:folder/compose" element={<MailCompose />} />
					</Route>

					{/* <Route path="/note" element={<NoteIndex />} /> */}
					{/* 
					<Route path="/book" element={<BookIndex />} />
					<Route path="/book/:bookId" element={<BookDetails />} />
					<Route path="/book/edit/:bookId" element={<BookEdit />} />
					<Route path="/book/edit" element={<BookEdit />} />
					<Route path="/book/:bookId/review" element={<AddReview />} />
					<Route path="/book/:bookId/review/:reviewId" element={<ReviewPreview />} /> */}

					<Route path="/book/add-from-google" element={<BookAddFromGoogle />} />
				</Routes>
			</section>
			<UserMsg />
		</Router>
	)
}
