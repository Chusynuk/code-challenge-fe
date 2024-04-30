const FormatDate = (date: string) => {
	const day = new Date(date).getDate();
	const month = new Date(date).getMonth();
	const year = new Date(date).getFullYear();

	return `${day}.${month}.${year}`;
};

const FullTimeStamp = (date: string) => {
	const day = new Date(date).getDate();
	const month = new Date(date).getMonth();
	const year = new Date(date).getFullYear();
	const hours = new Date(date).getHours();
	const minutes = new Date(date).getMinutes();
	const seconds = new Date(date).getSeconds();

	return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};


export { FormatDate,FullTimeStamp };
