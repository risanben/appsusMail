const { Link } = ReactRouterDOM
const { useEffect } = React
export function Home() {
	useEffect(() => {
		document.title = 'Appsus'
	}, [])

	return (
		<main className="home">
			<section className="img-container">
				<h1>Experience our amazing friendly designed tools for free!</h1>
				<button
					//anchor href with id doesn't work with react, and we don't have hashlinks installed, so we use this hack.
					// image ratio is 1.5 so we scroll 1.5 it's width, and then 75px for header size.
					// in real scenarios, we will use React router anchor, which isn't installed here.
					onClick={() => window.scrollTo({ top: document.body.scrollWidth / 1.5 + 75, behavior: 'smooth' })}
					className="started-btn">
					Get Started
				</button>
				<img src="./assets/img/hero-img.jpg"></img>
			</section>
			<h2 className="our-features">Our Features </h2>
			<section className="card-container">
				<div className="card appsus-mail flex column align-center">
					<img className="card-img" src="./assets/img/mail_logo.svg" alt=""></img>
					<h3>Appsus mail</h3>

					<p>Send and receive mails with our encrypted mailing service</p>

					<Link to="/mail/inbox">Learn more</Link>
				</div>

				<div id="our-features" className="card appsus-keep flex column align-center">
					<img className="card-img" src="./assets/img/notes_logo.svg" alt=""></img>
					<h3>Appsus keep</h3>
					<p>Quickly capture what's on your mind. Add notes and photos to Appsus Notes </p>
					<Link to="/note">Learn more</Link>
				</div>

				<div className="card appsus-books flex column align-center">
					<img className="card-img" src="./assets/img/books_logo.png" alt=""></img>

					<h3>Appsus books</h3>
					<p>Search the world's most comprehensive index of full-text books</p>

					<Link to="/book">Learn more</Link>
				</div>
			</section>

			<section className="help">
			<Link to='/mail/inbox/compose?to=help@appsus.com&subject=help&body=i would like to receive assistant with...'>Need help? contact us</Link>
			</section>

			<h2 className="our-team">Our Team </h2>

			<section className="about-us-container flex column">
				<article className="stav flex">
					<div className="stav-img-container">
						<img src="./assets/img/stav-img.jpeg" alt="" />
					</div>
					<div className="about-details flex column">
						<h4>Stav Tohami</h4>
						<p>
							23 years old from Caesarea, Israel. Passionate about coding and always up for a challenge.
							Studying web development in Coding-Academy.
						</p>
					</div>
					<div className="about-tool-bar flex">
						<i className="icon fa-brands fa-linkedin-in"></i>
						<i className="icon fa-brands fa-facebook"></i>
						<a target="_blank" href="https://github.com/stavTo">
							<i className="icon fa-brands fa-github"></i>
						</a>
					</div>
				</article>

				<article className="ido flex">
					<div className="ido-img-container">
						<img src="./assets/img/ido-img.jpeg" alt="" />
					</div>
					<div className="about-details flex column">
						<h4>Ido Kadosh</h4>
						<p>
							21 years old from Kadima, Israel. Always trying to learn new things! Studying web
							development in Coding-Academy.
						</p>
					</div>
					<div className="about-tool-bar flex">
						<a target="_blank" href="https://www.linkedin.com/in/ido-kadosh-717729252/">
							<i className="icon fa-brands fa-linkedin-in"></i>
						</a>
						<i className="icon fa-brands fa-facebook"></i>
						<a target="_blank" href="https://github.com/Ido-Kadosh">
							<i className="icon fa-brands fa-github"></i>
						</a>
					</div>
				</article>
			</section>
		</main>
	)
}
