import { MailFolderList } from './mail-folder-list.jsx'

const { useState } = React
const { Link } = ReactRouterDOM

export function MailSidebar({ folder, unreadCount }) {
	const [isExpanded, setIsExpanded] = useState(false)

	const { matches: isLargeScreen } = window.matchMedia('(min-width:768px')
	const shouldExpandClass = isExpanded && isLargeScreen ? 'expanded' : ''
	const shouldExpand = isExpanded && isLargeScreen
	return (
		<section
			className={`${shouldExpandClass}  mail-sidebar`}
			onMouseOut={() => setIsExpanded(false)}
			onMouseOver={() => setIsExpanded(true)}>
			<Link className="compose-icon-container" to={`/mail/${folder}/compose`}>
				<span className="compose-icon material-symbols-outlined">edit</span>
				{shouldExpand && <span className="compose-text">Compose</span>}
			</Link>
			<MailFolderList unreadCount={unreadCount} isExpanded={shouldExpand} folder={folder} />
		</section>
	)
}
