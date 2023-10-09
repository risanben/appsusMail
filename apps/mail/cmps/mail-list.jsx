const { Fragment } = React

import { MailPreview } from './mail-preview.jsx'

export function MailList({ mails, onUpdateMail, onRemoveMail, onToggleTrash }) {
	return <Fragment>
		{!!mails.length && (
			<ul className="clean-list mail-list">
				{mails.map(mail => (
					<MailPreview
						key={mail.id}
						mail={mail}
						onRemoveMail={onRemoveMail}
						onUpdateMail={onUpdateMail}
						onToggleTrash={onToggleTrash}
					/>
				))}
			</ul>
		)}
		{!mails.length && <h1 className="no-mails-info">No mails here</h1>}
	</Fragment>

}
