
const { useState } = React

export function LongTxt({ txt, length }) {
    
    const [isOpen, setIsOpen] = useState(false)

    function cutTxtByLength() {
        if (txt.length < length || isOpen) return txt
        return txt.substring(0, length) + '...'
    }
    
    if (!txt) return
    return (
        <section>
            <p> {cutTxtByLength()} </p>
            {txt.length > length &&
                <button onClick={() => setIsOpen(isOpen => !isOpen)}>
                    {isOpen ? 'Read Less' : 'Read More'}
                </button>}
        </section>
    )
}