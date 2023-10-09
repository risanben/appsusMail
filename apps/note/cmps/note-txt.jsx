export function NoteTxt({ handleChange, txt }) {
	return (
		<section className="note-txt flex column space-between">
			<input onChange={handleChange} value={txt} type="text" name="txt" id="txt" placeholder="Enter Text..." />
		</section>
	)
}
