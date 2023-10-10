const { useEffect, useState, Fragment } = React
const { Outlet, useSearchParams, useParams, useNavigate, useLocation } = ReactRouterDOM
import { showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service.js'
import { MailList } from '../cmps/mail-list.jsx'
import { mailService } from '../services/mail.service.js'
import { MailSidebar } from '../cmps/mail-sidebar.jsx'
import { MailDetails } from '../cmps/mail-details.jsx'
import { MailFilter } from '../../../cmps/mail-filter.jsx'
import { MailSort } from '../cmps/mail-sort.jsx'

export function MailIndex() {
	const location = useLocation()
	const params = useParams()
	const navigate = useNavigate()

	const [searchParams, setSearchParams] = useSearchParams()

	const [mails, setMails] = useState([])
	const [filterBy, setFilter] = useState(mailService.getFilterFromParams(searchParams, params.folder))
	const [sortBy, setSortBy] = useState(mailService.getSortFromParams(searchParams))
	const [unreadCount, setUnreadCount] = useState(0)
	const [selectedMailsIds, setSelectedMailsIds] = useState([])


	useEffect(() => {
		loadMails()
		renderSearchParams()
	}, [filterBy, sortBy])

	useEffect(() => {
		// 1st WAY for folders : Filter in the backend by folders ->
		// everytime params change -> update filterBy -> trigger reLoading the mails
		if (filterBy.folder === params.folder) return
		setFilter(prevFilter => ({ ...prevFilter, status: params.folder }))
	}, [params.folder])

	useEffect(() => {
		loadUnReadCount()
	}, [mails])

	function onSetFilter(filter) {
		setFilter(prevFilter => ({ ...prevFilter, ...filter }))
	}

	function renderSearchParams() {
		const filterForParams = {
			txt: filterBy.txt || '',
			isRead: filterBy.isRead || '',
			isStarred: filterBy.isStarred || '',
			sortBy: sortBy.by || ''
		}
		setSearchParams(filterForParams)

	}

	async function loadMails() {
		try {
			const mails = await mailService.query(filterBy, sortBy)
			setMails(mails)
		} catch (err) {
			showErrorMsg('Error fetching emails')
			console.log('Had issues loading mails', err);
		}
	}

	async function onUpdateMail(mail) {
		try {
			const updatedMail = await mailService.save(mail)
			setMails(prevMails => prevMails.map(mail => mail.id === updatedMail.id ? updatedMail : mail))
		} catch (err) {
			showErrorMsg('Can not update mail')
			console.log('Had issues updating mail', err);
		}
	}

	async function onToggleTrash(mail) {
		try {
			const updatedMail = await mailService.save(mail)
			// Filter it out of the current state (based on folder and ux logic)
			setMails(prevMails => {
				return prevMails.filter(mail => mail.id !== updatedMail.id)
			})
			showSuccessMsg('Mail was sent to trash')
		} catch (err) {
			showErrorMsg('Can not update mail')
			console.log('Had issues updating mail', err);
		}
	}

	async function onArchiveSelected() {
		try {
			const mailsToArchive = await Promise.all(selectedMailsIds.map((id) => mailService.get(id)))
			const mailsToSave = mailsToArchive.map(m => {
				return {
					...m,
					removedAt: Date.now()
				}
			})
		 const savedMails = await Promise.all(mailsToSave.forEach((m) => archiveSelected(m)))
		 
			
		} catch (err) {
			console.log('cannot delete all mails ', err)
		}
	}

	async function archiveSelected(mail){
		try {
			const updatedMail = await mailService.save(mail)
			// Filter it out of the current state (based on folder and ux logic)
			setMails(prevMails => {
				return prevMails.filter(mail => mail.id !== updatedMail.id)
			})
			showSuccessMsg('Mail was sent to trash')
		} catch (err) {
			showErrorMsg('Can not update mail')
			console.log('Had issues updating mail', err);
		}
	}

	async function onRemoveMail(mailId) {
		try {
			if (!confirm('are you sure you want to delete mail forever?')) return
			await mailService.remove(mailId)
			// these mails are only shown when we're at the "removed" page, so we can act like we're "deleting" them from that page.
			setMails(prevMails => prevMails.filter(mail => mail.id !== mailId))
			showSuccessMsg(`Email removed!`)
		} catch (err) {
			showErrorMsg('An error occurred')
			console.log('Had issues removing mail', err);
		}
	}

	async function onAddMail(mail) {
		try {
			const savedMail = await mailService.save({ ...mail })
			if (params.folder === 'sent' || (params.folder === 'draft' && savedMail.isDraft)) {
				setMails(prevMails => [savedMail, ...prevMails])
			}
			if (!savedMail.isDraft) navigate('/mail/' + params.folder)

			const msg = savedMail.isDraft ? 'Mail saved to draft' : 'Mail Sent to ' + savedMail.to
			showSuccessMsg(msg)

			return savedMail
		} catch (err) {
			showErrorMsg('Sending mail failed')
			console.log('Had issues sending mail', err);
		}
	}

	async function loadUnReadCount() {
		const unReadCount = await mailService.getUnreadCount()
		document.title = `Appsus Mail (${unReadCount})`
		setUnreadCount(unReadCount)
	}

	function getMailsByFolder() {
		// 2nd WAY for folders : Filter in the client by folders -> everytime params change ->
		// re-rended happens -> trigger getMailsByFolder and get relevent mails only
		return mailService.filterMailsByFolder(mails, params.folder)
	}

	function toggleEmailSelection(emailId) {
		if (selectedMailsIds.includes(emailId)) {
			setSelectedMailsIds(selectedMailsIds.filter((id) => id !== emailId))
		} else {
			setSelectedMailsIds([...selectedMailsIds, emailId]);
		}
	}

	return (
		<Fragment>
			<main className="mail-index">

				<MailSidebar unreadCount={unreadCount} folder={params.folder} />
				<MailFilter onSetFilter={onSetFilter} filterBy={{ txt: filterBy.txt }} />
				{(!params.mailId || location.pathname.includes('compose')) && (
					<div className="mail-list-container">
						{selectedMailsIds.length > 0 && <section className='multiple-mails-action' onClick={onArchiveSelected}>Archive selected</section>}
						<MailSort onSetSortBy={setSortBy} sortBy={sortBy} />
						<MailList
							toggleEmailSelection={toggleEmailSelection}
							selectedMailsIds={selectedMailsIds}
							mails={mails}
							onUpdateMail={onUpdateMail}
							onRemoveMail={onRemoveMail}
							onToggleTrash={onToggleTrash}
						/>
					</div>
				)}
				{(location.pathname.includes('compose') || params.mailId) &&
					<Outlet context={{ onAddMail }} />}
			</main>
		</Fragment>
	)
}
