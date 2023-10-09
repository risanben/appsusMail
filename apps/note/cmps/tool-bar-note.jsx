const { useState, useEffect } = React
const { useNavigate, createSearchParams } = ReactRouterDOM

import { ColorBgcNote } from './color-bgc-note.jsx'

export function ToolBarNote({ note, onRemoveNote, duplicateNote, onSetNoteStyle }) {
	const [isPaletteShown, setIsPaletteShown] = useState(false)
	const navigate = useNavigate()

	const {
		info: { title, txt },
	} = note
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

	function onDuplicateNote(note) {
		duplicateNote(note)
	}

	function onExportMail() {
		navigate({
			pathname: '/mail/compose',
			search: `?${createSearchParams({ subject: title, body: txt })}`,
		})
	}

	return (
		<section className="tool-bar-note">
			<span className="material-symbols-outlined" title="Change color" onClick={ev => togglePalette(ev)}>
				palette
			</span>
			{isPaletteShown && <ColorBgcNote onSetNoteStyle={onSetNoteStyle} />}
			<span className="material-symbols-outlined" title="Duplicate note" onClick={() => onDuplicateNote(note)}>
				content_copy
			</span>
			<span className="material-symbols-outlined" onClick={onExportMail} title="Export as email">
				attach_email
			</span>
			<span className="material-symbols-outlined" title="Delete note" onClick={() => onRemoveNote(note.id)}>
				delete
			</span>
		</section>
	)
}
