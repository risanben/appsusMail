export function ColorBgcNote({ onSetNoteStyle }) {
	const colors = ['#ADD8E6', '#FF4040', '#FFF475', '#97FF9B', '#B1C2C8', '#FD56E1', '#E18EB6', '#F9A046', '#FFFFFF']

	function onChooseColor(color) {
		const newStyle = { backgroundColor: color }
		onSetNoteStyle(newStyle)
	}

	return (
		<section className="color-bgc-note">
			{colors.map(color => (
				<div
					className="color"
					key={color}
					style={{ backgroundColor: color }}
					onClick={() => onChooseColor(color)}></div>
			))}
		</section>
	)
}
