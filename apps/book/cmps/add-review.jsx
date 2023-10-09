const { useState } = React
const { useParams, useNavigate } = ReactRouterDOM

import { bookService } from "../services/book.service.js"
import { RateBySelect } from "./rate-by-select.jsx"
import { RateByStars } from "./rate-by-stars.jsx"
import { RateByTextbox } from "./rate-by-textbox.jsx"
import { showSuccessMsg } from "../../../services/event-bus.service.js"

export function AddReview() {
    const [newReview, setReviewToEdit] = useState(bookService.getEmptyReview())
    const [cmpType, setCmpType] = useState('select')

    const navigate = useNavigate()
    const params = useParams()
    const bookId = params.bookId

    function onBack() {
        navigate(`/book/${bookId}`)
    }

    function handleChange({ target }) {
        const field = target.name
        const value = target.type === 'number' ? (+target.value || '') : target.value
        setReviewToEdit(prevReview => ({ ...prevReview, [field]: value }))
    }

    function onSaveReview(ev) {
        ev.preventDefault()
        bookService.addReview(bookId, newReview)
            .then(() => {
                showSuccessMsg('Review saved')
                onBack()
            })
    }

    const { fullname, rating, readAt, description } = newReview

    return (
        <section className="add-review">
            <button className="exit-btn" onClick={onBack}>X</button>
            <form onSubmit={onSaveReview} className="add-review-form flex column justify-center">

                <label htmlFor="fullname">Full Name:</label>
                <input required onChange={handleChange} value={fullname}
                    type="text" name="fullname" id="fullname" />

                <label htmlFor="rating">Rating:</label>
                <h5>What is your experience from 1 to 5?</h5>
                <select onChange={(ev) => { setCmpType(ev.target.value) }}>
                    <option value="select">By Select</option>
                    <option value="text-box">By Text box</option>
                    <option value="stars">By Stars</option>
                </select>
                <section>
                    <DynamicCmp rating={rating} cmpType={cmpType} handleChange={handleChange} />
                </section>

                <label htmlFor="readAt">Read At:</label>
                <input onChange={handleChange} value={readAt} type="date"
                    name="readAt" id="readAt" />

                <label htmlFor="description">Share details of your own experience:</label>
                <textarea onChange={handleChange} value={description} type="text"
                    name="description" id="description" ></textarea>

                <button>Add Review</button>
            </form>
        </section>
    )
}

function DynamicCmp(props) {
    switch (props.cmpType) {
        case 'select':
            return <RateBySelect {...props} />
        case 'text-box':
            return <RateByTextbox {...props} />
        case 'stars':
            return <RateByStars {...props} />
    }
}
