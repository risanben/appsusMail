export function NoteVideo({ handleChange, videoUrl }) {
	return (
		<section className="note-video flex column space-between">
			<input
				onChange={handleChange}
				value={videoUrl || ''}
				type="text"
				name="videoUrl"
				id="videoUrl"
				placeholder="Enter video url..."
			/>
			{videoUrl && <iframe className="video" src={videoUrl} alt=""></iframe>}
		</section>
	)
}
