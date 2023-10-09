const { useState, useEffect } = React

import { NotePreview } from './note-preview.jsx'

export function NoteList({ onSetNoteStyle, notes, onRemoveNote, duplicateNote, togglePinned }) {
	const [pinnedNotes, setPinnedNotes] = useState([])
	const [unPinnedNotes, setUnPinnedNotes] = useState([])

	useEffect(() => {
		filterPinnedNotes()
	}, [notes])

	function filterPinnedNotes() {
		const pinnedNotes = notes.filter(note => note.isPinned)
		const unPinnedNotes = notes.filter(note => !note.isPinned)
		setPinnedNotes(pinnedNotes)
		setUnPinnedNotes(unPinnedNotes)
	}

	return (
		<React.Fragment>
			{!!pinnedNotes.length && (
				<section className="note-list-pinned">
					<h1>Pinned</h1>
					<ul className="note-list clean-list">
						{pinnedNotes.map(note => (
							<li key={note.id}>
								<NotePreview
									onSetNoteStyle={onSetNoteStyle}
									note={note}
									onRemoveNote={onRemoveNote}
									togglePinned={togglePinned}
									duplicateNote={duplicateNote}
								/>
							</li>
						))}
					</ul>
				</section>
			)}

			<section className="note-list-unpinned">
				{!!pinnedNotes.length && <h1>Other</h1>}
				<ul className="note-list clean-list">
					{unPinnedNotes.map(note => (
						<li key={note.id}>
							<NotePreview
								onSetNoteStyle={onSetNoteStyle}
								note={note}
								onRemoveNote={onRemoveNote}
								togglePinned={togglePinned}
								duplicateNote={duplicateNote}
							/>
						</li>
					))}
				</ul>
			</section>
		</React.Fragment>
	)
}
