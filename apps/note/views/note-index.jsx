const { useEffect, useState } = React
const { useSearchParams } = ReactRouterDOM

import { noteService } from '../services/note.service.js'
import { eventBusService, showSuccessMsg } from '../../../services/event-bus.service.js'
import { NoteList } from '../cmps/note-list.jsx'
import { AddNote } from '../cmps/add-note.jsx'

export function NoteIndex() {
	const [searchParams, setSearchParams] = useSearchParams()
	const [notes, setNotes] = useState([])
	const [filterBy, setFilterBy] = useState(noteService.getDefaultFilter(searchParams))

	useEffect(() => {
		loadNotes()
		if (filterBy.txt) {
			setSearchParams(filterBy)
		}
	}, [filterBy])

	useEffect(() => {
		document.title = 'Appsus Notes'
		const unsubscribe = eventBusService.on('input-changed', txt => {
			setFilterBy(prevFilter => ({ ...prevFilter, txt }))
		})
		return unsubscribe
	}, [])

	function loadNotes() {
		noteService.query(filterBy).then(setNotes)
	}

	function onSetNoteStyle(noteId, newStyle) {
		noteService.get(noteId).then(note => {
			const newNote = { ...note, style: newStyle }
			noteService.save(newNote).then(() => loadNotes())
		})
	}

	function onRemoveNote(noteId) {
		noteService.remove(noteId).then(() => {
			const updatedNotes = notes.filter(note => note.id !== noteId)
			setNotes(updatedNotes)
			showSuccessMsg(`Note removed!`)
		})
	}

	function saveNote(newNote) {
		noteService.save(newNote).then(newNote => {
			setNotes(prevNotes => [...prevNotes, newNote])
			showSuccessMsg('Note saved')
		})
	}

	function duplicateNote(note) {
		const newNote = { ...note, id: null }
		noteService.save(newNote).then(note => {
			setNotes(prevNotes => [...prevNotes, note])
		})
	}

	function togglePinned(note) {
		const newNote = { ...note, isPinned: !note.isPinned }
		noteService.save(newNote).then(loadNotes)
	}

	return (
		<section className="note-index main-layout">
			<AddNote saveNote={saveNote} />
			<NoteList
				onSetNoteStyle={onSetNoteStyle}
				notes={notes}
				onRemoveNote={onRemoveNote}
				togglePinned={togglePinned}
				duplicateNote={duplicateNote}
				saveNote={saveNote}
			/>
		</section>
	)
}
