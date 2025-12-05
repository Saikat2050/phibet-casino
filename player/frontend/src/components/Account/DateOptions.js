export const dateOptions = {
	autoHide: true,
	todayBtn: false,
	clearBtn: true,
	clearBtnText: "Clear",
	maxDate: new Date("2030-01-01"),
	minDate: new Date("1950-01-01"),
	theme: {
		background: " ",
		todayBtn: "",
		clearBtn: "  text-white",
		icons: " ",
		text: "   ",
		disabledText: " ",
		input: "    rounded-[0.313rem] h-[2.875rem] border-solid border-transparent focus:border-green-300 focus:  focus:outline-none",
		inputIcon: " ",
		selected: "",
	},
	defaultDate: null,
	language: "en",
	disabledDates: [],
	inputNameProp: "date",
	inputIdProp: "date",
	inputPlaceholderProp: "Select Date",
	inputDateFormatProp: {
		day: "numeric",
		month: "long",
		year: "numeric"
	}
}
