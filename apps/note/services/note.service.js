// note service

import { storageService } from '../../../services/async-storage.service.js'
import { utilService } from '../../../services/util.service.js'

const NOTE_KEY = 'noteDB'

_createNotes()

export const noteService = {
	query,
	get,
	remove,
	save,
	getEmptyNote,
	getDefaultFilter,
	getEmptyNoteFromMail,
}

function query(filterBy = {}) {
	return storageService.query(NOTE_KEY).then(notes => {
		if (filterBy.txt) {
			const regExp = new RegExp(filterBy.txt, 'i')
			notes = notes.filter(note => regExp.test(note.info.title) || regExp.test(note.info.txt))
		}
		return notes
	})
}

function get(noteId) {
	return storageService.get(NOTE_KEY, noteId)
}

function remove(noteId) {
	return storageService.remove(NOTE_KEY, noteId)
}

function save(note) {
	if (note.id) {
		return storageService.put(NOTE_KEY, note)
	} else {
		return storageService.post(NOTE_KEY, note)
	}
}

function getEmptyNote(
	txt = '',
	title = '',
	type = 'NoteTxt',
	isPinned = false,
	createdAt = Date.now(),
	backgroundColor = '#ffffff'
) {
	return {
		id: '',
		createdAt,
		type,
		isPinned,
		style: {
			backgroundColor,
		},
		info: {
			title,
			txt,
		},
	}
}

function getEmptyNoteFromMail(searchParams = { get: () => {} }) {
	return {
		id: '',
		createdAt: Date.now(),
		type: 'NoteTxt',
		isPinned: false,
		style: {
			backgroundColor: '#ffffff',
		},
		info: {
			title: searchParams.get('title') || '',
			txt: searchParams.get('txtFromMail') || '',
		},
	}
}

function getDefaultFilter(searchParams = { get: () => {} }) {
	return {
		txt: searchParams.get('txt') || '',
	}
}

function _createNotes() {
	let notes = utilService.loadFromStorage(NOTE_KEY)
	if (!notes || !notes.length) {
		notes = [
			{
				id: utilService.makeId(),
				createdAt: Date.now(),
				type: 'NoteTxt',
				isPinned: false,
				style: {
					backgroundColor: '#B1C2C8',
				},
				info: {
					title: 'Reminder',
					txt: 'Take out the trash before she leaves me!',
				},
			},
			{
				id: utilService.makeId(),
				createdAt: Date.now(),
				type: 'NoteTxt',
				isPinned: true,
				style: {
					backgroundColor: '#FD56E1',
				},
				info: {
					title: 'hahahahahha!',
					txt: 'Fullstack Me Baby!',
				},
			},
			{
				id: utilService.makeId(),
				createdAt: Date.now(),
				type: 'NoteTxt',
				isPinned: true,
				style: {
					backgroundColor: '#F9A046',
				},
				info: {
					title: 'Tomorrow!',
					txt: `Champions League semi-finals - 
                    Real Madrid Vs Manchester City`,
				},
			},
			{
				id: utilService.makeId(),
				createdAt: Date.now(),
				type: 'NoteImg',
				isPinned: false,
				style: {
					backgroundColor: '#97FF9B',
				},
				info: {
					title: 'Cool brooo',
					imgUrl: 'https://media.istockphoto.com/id/1154370446/photo/funny-raccoon-in-green-sunglasses-showing-a-rock-gesture-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=kkZiaB9Q-GbY5gjf6WWURzEpLzNrpjZp_tn09GB21bI=',
				},
			},
			{
				id: utilService.makeId(),
				createdAt: Date.now(),
				type: 'NoteVideo',
				isPinned: false,
				style: {
					backgroundColor: '#FF4040',
				},
				info: {
					title: 'Video',
					videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
				},
			},
			{
				id: utilService.makeId(),
				createdAt: Date.now(),
				type: 'NoteImg',
				isPinned: true,
				style: {
					backgroundColor: '#ADD8E6',
				},
				info: {
					title: 'Good night...',
					imgUrl: 'https://i.ytimg.com/vi/317jz-PU7Mg/maxresdefault.jpg',
				},
			},
			{
				id: utilService.makeId(),
				createdAt: Date.now(),
				type: 'NoteImg',
				isPinned: false,
				style: {
					backgroundColor: '#E18EB6',
				},
				info: {
					title: 'Puki and Muki...',
					imgUrl: 'https://paradepets.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTkxMzY1Nzg4NjczMzIwNTQ2/cutest-dog-breeds-jpg.jpg',
				},
			},
		]
		utilService.saveToStorage(NOTE_KEY, notes)
	}
}
