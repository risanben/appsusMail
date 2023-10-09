const { useState, useEffect } = React
const { useSearchParams } = ReactRouterDOM

import { noteService } from '../services/note.service.js'
import { showErrorMsg } from '../../../services/event-bus.service.js'
import { ColorBgcNote } from './color-bgc-note.jsx'
import { NoteTxt } from './note-txt.jsx'
import { NoteImg } from './note-img.jsx'
import { NoteVideo } from './note-video.jsx'

export function AddNote({ saveNote }) {
	const [searchParamsFromMail, setSearchParamsFromMail] = useSearchParams()
	const [isPaletteShown, setIsPaletteShown] = useState(false)
	const [isPinned, setIsPinned] = useState(false)
	const [newNote, setNewNote] = useState(noteService.getEmptyNoteFromMail(searchParamsFromMail))
	const [noteType, setNoteType] = useState('NoteTxt')

	useEffect(() => {
		document.addEventListener('click', () => setIsPaletteShown(false))
		return () => {
			document.removeEventListener('click', () => setIsPaletteShown(false))
		}
	}, [])

	function togglePalette(ev) {
		ev.stopPropagation()
		setIsPaletteShown(prev => !prev)
	}

	function onSetNoteStyle(newStyle) {
		setNewNote(prevNote => ({ ...prevNote, style: { ...newStyle } }))
	}

	function handleChange({ target }) {
		const field = target.name
		const value = target.value

		if (field === 'title') {
			setNewNote(prevNote => ({ ...prevNote, info: { ...prevNote.info, title: value } }))
			searchParamsFromMail.set('title', value)
			setSearchParamsFromMail(searchParamsFromMail)
		} else if (field === 'txt') {
			setNewNote(prevNote => ({ ...prevNote, info: { title: prevNote.info.title, [field]: value } }))
			searchParamsFromMail.set('txtFromMail', value)
			setSearchParamsFromMail(searchParamsFromMail)
		} else {
			setNewNote(prevNote => ({ ...prevNote, info: { title: prevNote.info.title, [field]: value } }))
		}
	}

	function onSaveNote(ev) {
		if (!newNote.info.txt && !newNote.info.title) {
			showErrorMsg('Title or text required')
			return
		}
		ev.preventDefault()
		saveNote(newNote)
		setNewNote(noteService.getEmptyNote())
	}

	function togglePinned(ev) {
		newNote.isPinned = !newNote.isPinned
		setNewNote(prevNote => ({ ...prevNote, ...isPinned }))
		ev.stopPropagation()
		setIsPinned(prev => !prev)
	}

	function setTypeByName({ target }) {
		const field = target.getAttribute('name')
		setNoteType(field)
		setNewNote(prevNote => ({ ...prevNote, type: field }))
	}

	const isPinnedClass = isPinned ? 'pinned' : ''
	const {
		info: { title, txt },
	} = newNote
	return (
		<section className="add-note" style={newNote.style}>
			<span onClick={togglePinned} className={`${isPinnedClass} material-symbols-outlined pin-icon `}>
				push_pin
			</span>

			<section className="input-container ">
				<input onChange={handleChange} value={title} type="text" name="title" id="title" placeholder="Title" />

				<DynamicNoteType
					noteType={noteType}
					handleChange={handleChange}
					txt={txt}
					imgUrl={newNote.info.imgUrl}
					videoUrl={newNote.info.videoUrl}
					todos={newNote.info.todos}
					newNote={newNote}
					setNewNote={setNewNote}
				/>
			</section>

			<div className="btn-container flex space-between">
				<div className="tool-bar">
					<span className="material-symbols-outlined" title="Change color" onClick={ev => togglePalette(ev)}>
						palette
					</span>
					{isPaletteShown && <ColorBgcNote onSetNoteStyle={onSetNoteStyle} />}
					<span className="material-symbols-outlined" name="NoteTxt" title="Add text" onClick={setTypeByName}>
						text_format
					</span>
					<span
						className="material-symbols-outlined"
						name="NoteImg"
						title="Add image"
						onClick={setTypeByName}>
						image
					</span>
					<span
						className="material-symbols-outlined"
						name="NoteVideo"
						title="Add video"
						onClick={setTypeByName}>
						movie
					</span>
				</div>
				<button onClick={onSaveNote} className="add-btn">
					Add
				</button>
			</div>
		</section>
	)
}

function DynamicNoteType({ noteType, handleChange, txt, imgUrl, videoUrl, todos, newNote, setNewNote }) {
	switch (noteType) {
		case 'NoteTxt':
			return <NoteTxt handleChange={handleChange} txt={txt} />
		case 'NoteImg':
			return <NoteImg handleChange={handleChange} imgUrl={imgUrl} />
		case 'NoteVideo':
			return <NoteVideo handleChange={handleChange} videoUrl={videoUrl} />
	}
}
