const { useNavigate, createSearchParams } = ReactRouterDOM
const { useState, useEffect, Fragment } = React
import { utilService } from '../../../services/util.service.js'
import { mailService } from '../services/mail.service.js'

export function MailPreview({ mail, onRemoveMail, onUpdateMail, onToggleTrash, folder }) {
	const { from, subject, body, sentAt, to, removedAt, isRead, isStarred } = mail

	const [isExpanded, setIsExpanded] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		if (isExpanded && !isRead) {
			onToggleIsRead()
		}
	}, [isExpanded])

	function onToggleIsExapnded(ev) {
		ev.stopPropagation()
		setIsExpanded(prev => !prev)

	}

	function getDateText(ms) {
		const timeStamp = new Date(ms)
		return utilService.formatMailDate(timeStamp)
	}

	function onToggleIsStarred(ev) {
		ev.stopPropagation() // prevent mail opening when starred
		const updatedMail = {
			...mail,
			isStarred: !mail.isStarred
		}
		onUpdateMail(updatedMail)
	}

	function onToggleIsRead(ev) {
		if (ev) ev.stopPropagation()
		const updatedMail = {
			...mail,
			isRead: !mail.isRead
		}
		onUpdateMail(updatedMail)
	}

	function onToggleRemovedAt(ev) {
		ev.stopPropagation()
		const updatedMail = {
			...mail,
			removedAt: mail.removedAt ? null : Date.now()
		}
		onToggleTrash(updatedMail)
	}

	function onGoToDetails(ev) {
		ev.stopPropagation()
		navigate(`details/${mail.id}`)
	}

	function onSendToNotes(ev) {
		ev.stopPropagation()
		const mailToSend = { title: subject, txtFromMail: body }
		navigate({
			pathname: '/note',
			search: `?${createSearchParams(mailToSend)}`,
		})
	}


	const isReadClass = isRead ? '' : 'unread'
	const isStarredClass = isStarred ? 'starred' : 'un-starred'
	const starTitle = isStarred ? 'Starred' : 'Not starred'

	return (
		<Fragment>
			<li onClick={onToggleIsExapnded} className={`mail-preview ${isReadClass}`}>
				{/* <span className="material-symbols-outlined checkbox">check_box_outline_blank</span> */}
				<span
					onClick={onToggleIsStarred}
					title={starTitle}
					className={`${isStarredClass} material-symbols-outlined`}>
					star
				</span>
				<div className="main-mail-container">
					<span className="mail-from">{from}</span>
					<span className="mail-subject">{subject}</span>
					<span className="mail-separator">-</span>
					<span className="mail-body">{body}</span>
				</div>
				<span className="mail-date">{getDateText(sentAt)}</span>
				<div className="icons-container">
					{!removedAt && (
						<span
							onClick={ev => onSendToNotes(ev)}
							title="Save as note"
							className="save-as-note material-symbols-outlined">
							near_me
						</span>
					)}
					{removedAt && (
						<span title="Restore" onClick={onToggleRemovedAt} className="material-symbols-outlined">
							restore_from_trash
						</span>
					)}
					{!isRead && (
						<span
							title="Mark as read"
							onClick={ev => onToggleIsRead(ev)}
							className="mark-as-read material-symbols-outlined">
							drafts
						</span>
					)}
					{isRead && (
						<span
							title="Mark as unread"
							onClick={ev => onToggleIsRead(ev)}
							className="mark-as-unread material-symbols-outlined">
							mail
						</span>
					)}

					<span title="Delete"
						onClick={!removedAt ? onToggleRemovedAt : (ev) => {
							ev.preventDefault()
							onRemoveMail(mail.id)
						}}
						className="delete-icon material-symbols-outlined">
						delete
					</span>
				</div>
			</li>
			{isExpanded && (
				<li className={'full-mail'}>
					<span>
						<h2>{from}</h2>
						<h5>to {to}</h5>
						<span onClick={onGoToDetails} className="material-symbols-outlined">
							fullscreen
						</span>
						<p>{body}</p>
					</span>
				</li>
			)}
		</Fragment>
	)
}
