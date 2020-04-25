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
            },
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'all cases in the last 30 days'
                }
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
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Total of all cases'
                }
            }
        });
    }
};
xmlhttpAllCases.open("GET", "https://api.covid19api.com/dayone/country/morocco", true);
xmlhttpAllCases.send();

/* new cases for today */
const xmlhttpTodayCases = new XMLHttpRequest();
xmlhttpTodayCases.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        
        const res = JSON.parse(this.responseText);
        const moroccoStats = res.Countries.filter((country) => country.CountryCode === "MA" );
        const newConfirmed = moroccoStats[0].NewConfirmed;
        const newRecovered = moroccoStats[0].NewRecovered;
        const newDeaths    = moroccoStats[0].NewDeaths;
        debugger
        document.getElementById('total-confirmed').innerHTML = moroccoStats[0].TotalConfirmed;
        document.getElementById('total-recovered').innerHTML = moroccoStats[0].TotalRecovered;
        document.getElementById('total-deaths').innerHTML = moroccoStats[0].TotalDeaths;
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
            },
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Today\'s new cases'
                }
            }
        });
    }
}
xmlhttpTodayCases.open("GET", "https://api.covid19api.com/summary", true);
xmlhttpTodayCases.send();