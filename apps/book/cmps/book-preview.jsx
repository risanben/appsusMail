
import { utilService } from "../../../services/util.service.js"

export function BookPreview({ book }) {
  const { title, listPrice: { amount, currencyCode }, thumbnail, } = book

  return (
    <article className="book-preview">
      <h2>Book Title: {title}</h2>
      <h4>
        Price: {amount}
        {utilService.getSymbolCurrency(currencyCode)}
      </h4>
      <img
        src={thumbnail ? `${thumbnail}` : `../assets/img/default-book.png`}
        alt=""
      />
    </article>
  )
}
