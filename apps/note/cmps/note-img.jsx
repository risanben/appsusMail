export function NoteImg({ handleChange, imgUrl }) {
	return (
		<section className="note-img flex column space-between">
			<input
				onChange={handleChange}
				value={imgUrl || ''}
				type="text"
				name="imgUrl"
				id="imgUrl"
				placeholder="Enter img url..."
			/>

			{imgUrl && <img className="img" src={imgUrl} alt=""></img>}
		</section>
	)

	//
}
