
const { useState, useEffect } = React

export function BookFilter({ filterBy, onSetFilter }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
   
    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        const value = target.type === 'number' ? (+target.value || '') : target.value
        setFilterByToEdit(prevFilterBy => ({ ...prevFilterBy, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    const { title, maxPrice } = filterByToEdit
    return (
        <section className="book-filter">
            <h2>Filter Our Books</h2>

            <form onSubmit={onSubmitFilter}>
                <label htmlFor="title">Book Title:</label>
                <input value={title} onChange={handleChange} name="title" id="title" type="text" placeholder="By Title" />

                <label htmlFor="maxPrice">Max Price:</label>
                <input value={maxPrice} onChange={handleChange} type="number" name="maxPrice" id="maxPrice" placeholder="By Max Price" />

                <button>Filter Books</button>
            </form>

        </section>
    )
}