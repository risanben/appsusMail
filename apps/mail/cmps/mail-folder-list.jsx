const { Fragment } = React
const { useNavigate } = ReactRouterDOM

export function MailFolderList({ folder, isExpanded, unreadCount }) {
	const navigate = useNavigate()


	function setFilter(path) {
		// Could have been done with just <Link> Components... (requires to  queryParams)
		navigate(`/mail/${path}`)
	}

	return (
		<ul className="clean-list mail-filter">
			<li className={folder === 'inbox' ? 'active' : ''} onClick={() => setFilter('inbox')}>
				<span className="material-symbols-outlined">inbox</span>
				{isExpanded && (
					<Fragment>
						<span>Inbox</span>
						{unreadCount > 0 && <span className="unread-mail-count">{unreadCount}</span>}
					</Fragment>
				)}
			</li>
			<li className={folder === 'starred' ? 'active' : ''} onClick={() => setFilter('starred')}>
				<span className="material-symbols-outlined">star</span>
				{isExpanded && <span>Starred</span>}
			</li>
			<li className={folder === 'sent' ? 'active' : ''} onClick={() => setFilter('sent')}>
				<span className="material-symbols-outlined">send</span>
				{isExpanded && <span>Sent</span>}
			</li>
			<li className={folder === 'draft' ? 'active' : ''} onClick={() => setFilter('draft')}>
				<span className="material-symbols-outlined">draft</span>
				{isExpanded && <span>Drafts</span>}
			</li>
			<li className={folder === 'trash' ? 'active' : ''} onClick={() => setFilter('trash')}>
				<span className="material-symbols-outlined">Delete</span>
				{isExpanded && <span>Deleted</span>}
			</li>
		</ul>
	)
}
