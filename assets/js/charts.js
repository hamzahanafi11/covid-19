const days      = [];
const confirmed = [];
const recovered = [];
const deaths    = [];
const colors = {
    confirmed : 'rgba(75, 61, 127, 0.6)',
    recovered : 'rgba(65, 212, 42, 0.6)',
    deaths    : 'rgba(232, 63, 82, 0.6)'
}

const xmlhttpAllCases = new XMLHttpRequest();
xmlhttpAllCases.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        const res = JSON.parse(this.responseText);
        const startIndex = res.length - 31;
        const endIndex   = res.length - 1;
        res.slice(startIndex, endIndex).forEach(element => {
            confirmed.push(element.Confirmed);
            recovered.push(element.Recovered);
            deaths.push(element.Deaths);
            days.push(element.Date.split("T")[0]);
        });
        const allCasesCtx = document.getElementById('all-cases').getContext('2d');
        const allCasesChart = new Chart(allCasesCtx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: '# of Confirmed',
                    data: confirmed,
                    fill: false,
                    borderColor: colors.confirmed,
                    borderWidth: 1
                },
                {
                    label: '# of Recovered',
                    data: recovered,
                    fill: false,
                    borderColor: colors.recovered,
                    borderWidth: 1
                },
                {
                    label: '# of Deaths',
                    data: deaths,
                    fill: false,
                    borderColor: colors.deaths,
                    borderWidth: 1
                }]
            }
        });
        const summaryCtx = document.getElementById('summary-cases').getContext('2d');
        const summaryChart = new Chart(summaryCtx, {
            type: 'pie',
			data: {
				datasets: [{
					data: [
						res[res.length - 1].Confirmed,
						res[res.length - 1].Recovered,
						res[res.length - 1].Deaths
					],
					backgroundColor: [
                        colors.confirmed,
                        colors.recovered,
                        colors.deaths
					],
				}],
				labels: [
					'# Confirmed',
					'# Recovered',
					'# Deaths'
				]
			},
			options: {
				responsive: true
			}
        });
        const newConfirmed = res[res.length - 2].Confirmed - res[res.length - 3].Confirmed;
        const newRecovered = res[res.length - 2].Recovered - res[res.length - 3].Recovered;
        const newDeaths    = res[res.length - 2].Deaths - res[res.length - 3].Deaths;
        const todaysCasesCtx = document.getElementById('today-cases').getContext('2d');
        const todaysCasesChart = new Chart(todaysCasesCtx, {
            type: 'bar',
            data: {
                labels: ['new cases'],
                datasets: [{
                    label: '# new confirmed',
                    backgroundColor: colors.confirmed,
                    borderWidth: 1,
                    data: [newConfirmed]
                },
                {
                    label: '# new recovered',
                    backgroundColor: colors.recovered,
                    borderWidth: 1,
                    data: [newRecovered]
                },
                {
                    label: '# new deaths',
                    backgroundColor: colors.deaths,
                    borderWidth: 1,
                    data: [newDeaths]
                }]
            }
        });
    }
};
xmlhttpAllCases.open("GET", "https://api.covid19api.com/dayone/country/morocco", true);
xmlhttpAllCases.send();