import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const MAIL_KEY = 'mailDB'

const loggedInUser = {
	email: 'user@appsus.com',
	fullName: 'Mahatma Appsus',
}

_createMails()

const debouncedGet = utilService.debouncePromise(get)

export const mailService = {
	query,
	get,
	debouncedGet,
	remove,
	save,
	getEmptyMail,
	getDefaultFilter,
	getLoggedUser,
	getMailFromSearchParams,
	getFilterFromParams,
	getDefaultSort,
	getUnreadCount,
	filterMailsByFolder
}

function query(filterBy = {}, sortBy = getDefaultSort()) {
	return storageService.query(MAIL_KEY).then(mails => {
		mails = _filterMails(mails, filterBy)
		_sortMails(mails, sortBy)
		return mails
	})
}

function get(mailId) {
	return storageService.get(MAIL_KEY, mailId)
}

function getUnreadCount() {
	return storageService.query(MAIL_KEY)
		.then(mails => mails.filter(mail => !mail.isRead).length)
}

function remove(mailId) {
	return storageService.remove(MAIL_KEY, mailId)
}

function save(mail) {
	if (mail.id) {
		return storageService.put(MAIL_KEY, mail)
	} else {
		mail.sentAt = Date.now()
		mail.from = getLoggedUser().email
		return storageService.post(MAIL_KEY, mail)
	}
}

function getEmptyMail(
	subject = '',
	body = '',
	sentAt = '',

	from = '',
	to = '',
	isRead = false,
	isStarred = false,
	removedAt = null
) {
	return { id: '', subject, body, sentAt, from, to, isRead, isStarred, removedAt }
}

function getDefaultFilter() {
	return {
		status: 'inbox',
		txt: '',
		isRead: null,
		isStarred: null,
		labels: []
	}
}

function getDefaultSort() {
	return {
		by: 'date',
		dir: 1
	}
}

function getFilterFromParams(searchParams, folder) {
	// console.log('folder', folder);
	const filterBy = {
		status: folder,
		txt: searchParams.get('txt') || '',
		isRead: searchParams.get('isRead') || null,
		isStarred: searchParams.get('isStarred') || null,
		labels: searchParams.get('labels') || []
	}
	// console.log('filterBy from params', filterBy);
	// for (const field in defaultFilter) {
	// 	filterBy[field] = searchParams.get(field) || ''
	// }
	return filterBy
}

function getMailFromSearchParams(searchParams = { get: () => { } }) {
	return {
		id: '',
		subject: searchParams.get('subject') || '',
		body: searchParams.get('body') || '',
		sentAt: '',
		from: '',
		to: '',
		isRead: '',
		isStarred: '',
		removedAt: '',
	}
}

function getLoggedUser() {
	return loggedInUser
}

function _filterMails(mails, filterBy) {
	if (filterBy.status) {
		mails = filterMailsByFolder(mails, filterBy.status)
	}
	if (filterBy.txt) {
		const regExp = new RegExp(filterBy.txt, 'i')
		mails = mails.filter(mail => regExp.test(mail.subject) || regExp.test(mail.body) || regExp.test(mail.from))
	}
	if (filterBy.isRead !== null && filterBy.isRead !== undefined) {
		mails = mails.filter(mail => mail.isRead === filterBy.isRead)
	}
	return mails

}

function filterMailsByFolder(mails, folder) {
	switch (folder) {
		case 'inbox':
			mails = mails.filter(mail => (mail.to === loggedInUser.email) && !mail.removedAt && !mail.isDraft)
			break
		case 'sent':
			mails = mails.filter(mail => (mail.from === loggedInUser.email) && !mail.removedAt && !mail.isDraft)
			break
		case 'starred':
			mails = mails.filter(mail => mail.isStarred && !mail.removedAt && !mail.isDraft)
			break
		case 'trash':
			mails = mails.filter(mail => mail.removedAt)
			break
		case 'draft':
			mails = mails.filter(mail => mail.isDraft && !mail.removedAt)
			console.log('I thought I removed the drafts option. how did you get here? ')
			break
	}
	return mails
}

function _sortMails(mails, sortBy) {
	if (sortBy.by === 'date') {
		mails.sort((mail1, mail2) => (mail2.sentAt - mail1.sentAt) * sortBy.dir)
	} else if (sortBy.by === 'starred') {
		mails.sort((mail1, mail2) => (mail2.isStarred - mail1.isStarred) * sortBy.dir)
	} else if (sortBy.by === 'read') {
		mails.sort((mail1, mail2) => (mail1.isRead - mail2.isRead) * sortBy.dir)
	} else if (sortBy.by === 'subject') {
		mails.sort((mail1, mail2) => mail1.subject.localeCompare(mail2.subject) * sortBy.dir)
	}
}

function _createMail(subject, body, sentAt, from, to, isRead, isStarred, removedAt = null) {
	const mail = getEmptyMail(subject, body, sentAt, from, to, isRead, isStarred, removedAt)
	mail.id = utilService.makeId()
	return mail
}

function _createMails() {
	let mails = utilService.loadFromStorage(MAIL_KEY)
	if (!mails || !mails.length) {
		mails = []
		mails.push(
			_createMail(
				'Urgent!',
				`Dear Sir:

I have been requested by the Nigerian National Petroleum Company to contact you for assistance in resolving a matter. The Nigerian National Petroleum Company has recently concluded a large number of contracts for oil exploration in the sub-Sahara region. The contracts have immediately produced moneys equaling US$40,000,000. The Nigerian National Petroleum Company is desirous of oil exploration in other parts of the world, however, because of certain regulations of the Nigerian Government, it is unable to move these funds to another region.
				
You assistance is requested as a non-Nigerian citizen to assist the Nigerian National Petroleum Company, and also the Central Bank of Nigeria, in moving these funds out of Nigeria. If the funds can be transferred to your name, in your United States account, then you can forward the funds as directed by the Nigerian National Petroleum Company. In exchange for your accommodating services, the Nigerian National Petroleum Company would agree to allow you to retain 10%, or US$4 million of this amount.
				
However, to be a legitimate transferee of these moneys according to Nigerian law, you must presently be a depositor of at least US$100,000 in a Nigerian bank which is regulated by the Central Bank of Nigeria.
				
If it will be possible for you to assist us, we would be most grateful. We suggest that you meet with us in person in Lagos, and that during your visit I introduce you to the representatives of the Nigerian National Petroleum Company, as well as with certain officials of the Central Bank of Nigeria.
				
Please call me at your earliest convenience at 18-467-4975. Time is of the essence in this matter; very quickly the Nigerian Government will realize that the Central Bank is maintaining this amount on deposit, and attempt to levy certain depository taxes on it.
				
Yours truly,
				
				Prince Alyusi Islassis`,
				Date.now() - 99999,
				'Alusi@Kingdom.com',
				'user@appsus.com',
				false,
				false
			)
		)
		mails.push(
			_createMail(
				'octopus!!!',
				`				⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠟⠛⠛⠻⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿
				⣿⣿⣿⣿⣿⠟⣉⣤⣶⣾⣿⣿⣿⣿⣷⣶⣤⣉⠻⣿⣿⣿⣿⣿⣿
				⣿⣿⣿⡟⣡⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡌⢻⣿⣿⣿⣿
				⣿⣿⡟⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⢿⣿⣿⣿
				⣿⣿⡇⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⢸⣿⣿⣿
				⣿⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿
				⣿⣿⣇⢹⣿⡿⠋⠉⠻⣿⣿⣿⣿⣿⣿⡿⠟⠿⣿⣿⡇⣸⣿⣿⣿
				⣿⣿⣿⡈⢿⣇⠀⠀⢀⣿⣿⡿⢿⣿⣿⣾⣿⣿⣾⡿⢁⣿⣿⣿⣿
				⣿⠟⢿⣷⡘⣿⣿⣿⣿⣿⣧⣴⣤⣴⣿⣿⣿⣿⣿⢃⣾⡿⠻⣿⣿
				⡏⡄⠸⠟⠃⠈⠛⠛⠿⣿⣿⣿⠿⠛⠛⠻⣿⡿⠁⠘⠿⠇⢀⢹⣿
				⡅⣿⣄⠀⣰⣾⣿⣷⡄⠘⠟⣡⣶⣿⣿⣦⠈⠁⠰⠿⠃⣠⣿⢸⣿
				⣷⡹⢿⡀⢿⣿⣿⣿⣿⠀⣴⣿⣿⡟⢁⡀⠀⢰⣤⣶⣾⣿⢃⣾⣿
				⣿⣿⣦⣀⠸⣿⣿⡟⠃⠸⣿⣿⣿⡇⠘⣛⠂⠾⠿⢟⣋⣵⣿⣿⣿
				⣿⣿⣿⣿⣧⡘⠿⣿⠰⣶⣍⣛⣛⣃⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
				⣿⣿⣿⣿⣿⣿⣶⣤⣀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿`,
				Date.now() - 21391293,
				'momo@momo.com',
				'user@appsus.com',
				true,
				true
			)
		)
		mails.push(
			_createMail(
				'Buy our stuff!',
				`Hey Mahatma,
				
I haven't heard back from you and that tells me one of three things:

1) You've already chosen a different company for this, and if that's the case please let me know so I can stop bothering you.
2) Yo're still interested but haven't had the time to get back to me yet.
3) You've fallen and can't get up - in that case let me know and I'll call 911.

Please let me know which one is it because I'm starting to worry... Thanks in advance
and looking forward to hearing from you.`,
				1551133930594,
				'momo@momo.com',
				'user@appsus.com',
				false,
				false
			)
		)
		mails.push(
			_createMail(
				'Regarding your job application',
				`Dear Mahatma,
				
Thank you for your interest in our Full Stack Manager position in our London office. 
We regret to inform you that we have filled this position.
We appreciate your interst in opportunities with us, and will retain your information for consideration for future openings.
we wish you the best of success in your employment search`,
				1551133930594,
				'momo@momo.com',
				'user@appsus.com',
				true,
				false
			)
		)
		mails.push(
			_createMail(
				'Money transfer',
				`Dear Alyusi,
I understand the urgency of the matter. I have the funds ready, and will meet you in Lagos at once.
Looking forward to meeting the representatives of the National Petroleum Company.

Many thanks, 
Mahatma`,
				1683893674944,
				'user@appsus.com',
				'Alusi@Kingdom.com',
				true,
				false
			)
		)
		mails.push(
			_createMail(
				'Job Application for Marketing Manager Position',
				`Dear Company,

I hope this email finds you well. My name is Mahatma, and I am writing to express my strong interest in the Marketing Manager position at Company, as advertised on [Job Board/Company Website].
		
With a solid background in marketing strategy and a proven track record of driving successful campaigns, I am confident in my ability to contribute to the growth and success of Company. I have 5 years of experience in marketing roles, including my most recent position as Marketing Specialist at my previous company. During my time there, I led cross-functional teams, developed and implemented comprehensive marketing plans, and successfully increased brand awareness and customer engagement.
		
In addition to my experience, I hold a Bachelor's degree in Marketing from University of my state and have a deep understanding of digital marketing techniques, social media management, and market research. I am also proficient in various marketing tools, including Google Analytics, SEO optimization, and CRM software.
		
I am particularly drawn to Company due to its innovative approach to marketing and its commitment to delivering exceptional results. I am excited about the opportunity to leverage my skills and contribute to your marketing initiatives.
		
Please find attached my resume for your review. I would greatly appreciate the opportunity to discuss how my qualifications align with the requirements of the Marketing Manager position. I am available for an interview at your convenience.
		
Thank you for considering my application. I look forward to the possibility of joining the talented team at Company.
		
Best regards,
		
Mahatma
123-456-7890`,
				Date.now() - 1232131,
				'user@appsus.com',
				'company@email.com'
			)
		)
		for (let i = 0; i < 30; i++) {
			mails.push(
				_createMail(
					utilService.makeLorem(utilService.getRandomIntInclusive(3, 6)),
					utilService.makeLorem(utilService.getRandomIntInclusive(25, 150)),
					utilService.getRandomIntInclusive(100000, Date.now()),
					`${utilService.makeLorem(1)}@appsus.com`,
					'user@appsus.com',
					utilService.getRandomIntInclusive(0, 1) ? true : false,
					utilService.getRandomIntInclusive(0, 1) ? true : false,
					utilService.getRandomIntInclusive(0, 5)
						? null
						: utilService.getRandomIntInclusive(100000, Date.now())
				)
			)
		}

		utilService.saveToStorage(MAIL_KEY, mails)
	}
}
