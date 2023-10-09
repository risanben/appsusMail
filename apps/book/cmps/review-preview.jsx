
export function ReviewPreview({ review }) {

    const { fullname, rating, readAt, description } = review

    return (
        <article className="review-preview">
            <h2>Full Name: {fullname}</h2>
            <h4>Rating: {rating}</h4>
            <h4>Read At: {readAt}</h4>
            <h4>Description: {description}</h4>
        </article>
    )
}