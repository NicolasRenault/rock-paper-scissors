/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./style.css", "./main.js"],
	theme: {
		colors: {
			primary: "rgb(220, 201, 182)",
			"primary-dark": "rgb(163, 145, 113)",
			secondary: "rgb(114, 125, 113)",
			"secondary-dark": "rgb(63, 66, 56)",
			"secondary-light": "rgb(171, 196, 171)",
			termary: "rgb(88, 66, 56)",
			"termary-light": "rgb(100, 66, 56)",
			font: "rgb(109, 76, 61)",
			"font-light": "rgb(221, 184, 146)",
			rock: "rgb(76, 76, 76)",
			paper: "rgb(255, 247, 240)",
			scissors: "rgb(199, 23, 23)",
		},
		borderWidth: {
			2: "2px",
			3: "3px",
			4: "4px",
			5: "5px",
		},
	},
};
