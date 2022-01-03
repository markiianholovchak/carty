// Adding navbar linking functionality

const navbar = document.querySelector(".navbar");
navbar.addEventListener("click", (evt) => {
	if (!evt.target.matches(".navbar__link")) return;
	const gotoSection = evt.target.dataset.goto;
	document.querySelector(`.${gotoSection}`).scrollIntoView({
		behavior: "smooth",
	});
});

learnMoreBtn = document.querySelector("#learnMoreBtn");
learnMoreBtn.addEventListener("click", (e) => {
	e.preventDefault();
	const gotoSection = e.target.dataset.goto;
	document.querySelector(`.${gotoSection}`).scrollIntoView({
		behavior: "smooth",
	});
});

// https://my.api.mockaroo.com/cars.json?key=93a4dee0

const carsContainer = document.querySelector(".OursCar__cars");
const loadCarsButton = document.querySelector("#loadCars");
const chart1Container = document.querySelector(".chart1__container");
const chart2Container = document.querySelector(".chart2__container");

const renderNineCars = (cars) => {
	cars.forEach((car) => {
		const markUp = `<div class="car">
        <div class="car__left">${car.brand} ${car.model}</div>
        <div class="car__right">
            <ul class="car__description">
                <li>Year: ${car.year}</li>
                <li>Mileage: ${car.mileage}km</li>
                <li>Country of origin: ${car.country}</li>
                <li>Color: ${car.color}</li>
            </ul>
        </div>
    </div>`;
		carsContainer.insertAdjacentHTML("beforeEnd", markUp);
	});
};

const renderCars = (cars) => {
	// Create html markup for each car
	firstNineCars = cars.slice(0, 9);
	renderNineCars(firstNineCars);
	cars = cars.slice(9);
	loadCarsButton.addEventListener("click", () => {
		anotherNineCars = cars.slice(0, 9);
		renderNineCars(anotherNineCars);
		cars = cars.slice(9);
	});
};

const renderCharts = (cars) => {
	// Chart 1:
	const firstChartData = {
		Volkswagen: 0,
		Mazda: 0,
		"Mercedes-Benz": 0,
		Ford: 0,
		Toyota: 0,
		BMW: 0,
		Kia: 0,
		Audi: 0,
	};
	let years = {};
	cars.forEach((car) => {
		if (Object.keys(firstChartData).includes(car.brand)) {
			firstChartData[car.brand]++;
		}
		if (Object.keys(years).includes(car.year.toString())) {
			years[car.year]++;
		} else {
			years[car.year] = 1;
		}
	});
	const periods = {
		1970: 0,
		2010: 0,
		2000: 0,
		1990: 0,
		1980: 0,
	};

	Object.keys(years).forEach((year) => {
		if (year >= 2010) {
			periods[2010] += years[year];
		} else if (year < 2010 && year >= 2000) {
			periods[2000] += years[year];
		} else if (year < 2000 && year >= 1990) {
			periods[1990] += years[year];
		} else if (year < 1990 && year >= 1980) {
			periods[1980] += years[year];
		} else {
			periods[1970] += years[year];
		}
	});
	const chart1const = document.getElementById("chart1").getContext("2d");
	const chart1 = new Chart(chart1const, {
		type: "doughnut",
		data: {
			labels: Object.keys(firstChartData),
			datasets: [
				{
					label: "Monthly sale",
					data: Object.values(firstChartData),
					backgroundColor: [
						"rgba(255, 99, 132, 0.2)",
						"rgba(228, 255, 99, 0.2)",
						"rgba(54, 162, 235, 0.2)",
						"rgba(255, 206, 86, 0.2)",
						"rgba(75, 192, 192, 0.2)",
						"rgba(153, 102, 255, 0.2)",
						"rgba(255, 159, 64, 0.2)",
						"rgba(148, 255, 99, 0.2)",
					],
					borderColor: [
						"rgba(255, 99, 132, 1)",
						"rgba(228, 255, 99, 1)",
						"rgba(54, 162, 235, 1)",
						"rgba(255, 206, 86, 1)",
						"rgba(75, 192, 192, 1)",
						"rgba(153, 102, 255, 1)",
						"rgba(255, 159, 64, 1)",
						"rgba(148, 255, 99, 1)",
					],
					borderWidth: 1,
				},
			],
		},
	});

	// Chart 2:
	const chart2const = document.getElementById("chart2").getContext("2d");
	const chart2S = new Chart(chart2const, {
		type: "bar",
		data: {
			labels: Object.keys(periods).map((period) => {
				if (period === "1970") {
					return "<1980";
				}
				return `${period}-${parseInt(period) + 9}`;
			}),
			datasets: [
				{
					label: "Cars sold",
					data: Object.values(periods),
					backgroundColor: [
						"rgba(255, 99, 132, 0.2)",
						"rgba(54, 162, 235, 0.2)",
						"rgba(75, 192, 192, 0.2)",
						"rgba(153, 102, 255, 0.2)",
						"rgba(255, 159, 64, 0.2)",
						"rgba(148, 255, 99, 0.2)",
					],
					borderColor: [
						"rgba(255, 99, 132, 1)",
						"rgba(54, 162, 235, 1)",
						"rgba(75, 192, 192, 1)",
						"rgba(153, 102, 255, 1)",
						"rgba(255, 159, 64, 1)",
						"rgba(148, 255, 99, 1)",
					],
					borderWidth: 1,
				},
			],
		},
		options: {
			plugins: {
				legend: { display: false },
				title: {
					display: true,
					text: "Sold cars according to their year",
				},
			},
		},
	});
};

const setLoadingButton = (action, ...containers) => {
	for (let container of containers) {
		if (action === "add") {
			const markUp = `
			<svg class="loadingIcon">
				<use xlink:href="./img/sprite.svg#icon-loading" />
			</svg>
			`;
			container.insertAdjacentHTML("beforeBegin", markUp);
		} else if (action === "clear") {
			container.parentNode.removeChild(container.previousElementSibling);
		}
	}
};

const fetchData = async () => {
	setLoadingButton("add", carsContainer, chart1Container, chart2Container);
	const response = await fetch(
		"https://my.api.mockaroo.com/cars.json?key=93a4dee0"
	);
	const data = await response.json();
	setLoadingButton("clear", carsContainer, chart1Container, chart2Container);
	renderCars(data);
	renderCharts(data);
};
fetchData();
