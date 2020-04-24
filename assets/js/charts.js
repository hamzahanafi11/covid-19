const days      = [];
const confirmed = [];
const recovered = [];
const deaths    = [];

const xmlhttpAllCases = new XMLHttpRequest();
xmlhttpAllCases.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        const res = JSON.parse(this.responseText);
        const startIndex = res.length - 30;
        const endIndex   = res.length;
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
                    borderColor: 'rgba(237, 96, 14, 0.6)',
                    borderWidth: 1
                },
                {
                    label: '# of Recovered',
                    data: recovered,
                    fill: false,
                    borderColor: 'rgba(65, 212, 42, 0.6)',
                    borderWidth: 1
                },
                {
                    label: '# of Deaths',
                    data: deaths,
                    fill: false,
                    borderColor: 'rgba(232, 63, 82, 0.6)',
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
                        'rgba(237, 96, 14, 0.6)',
                        'rgba(65, 212, 42, 0.6)',
                        'rgba(232, 63, 82, 0.6)'
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
        debugger
        const todaysCasesCtx = document.getElementById('today-cases').getContext('2d');
        const todaysCasesChart = new Chart(todaysCasesCtx, {
            type: 'bar',
            data: {
                datasets: [{
                    label: '# new confirmed',
                    backgroundColor: 'rgba(237, 96, 14, 0.6)',
                    borderWidth: 1,
                    data: [res[res.length - 2].Confirmed - res[res.length - 3].Confirmed]
                },
                {
                    label: '# new recovered',
                    backgroundColor: 'rgba(65, 212, 42, 0.6)',
                    borderWidth: 1,
                    data: [res[res.length - 2].Recovered - res[res.length - 3].Recovered]
                },
                {
                    label: '# new deaths',
                    backgroundColor: 'rgba(232, 63, 82, 0.6)',
                    borderWidth: 1,
                    data: [res[res.length - 2].Deaths - res[res.length - 3].Deaths]
                }]
            }
        });
    }
};
xmlhttpAllCases.open("GET", "https://api.covid19api.com/dayone/country/morocco", true);
xmlhttpAllCases.send();


const xmlhttpTodaysCases = new XMLHttpRequest();
xmlhttpTodaysCases.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        const res = JSON.parse(this.responseText);
        
    }
}
const generateTodaysDate = () => {
    const today = new Date();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    return today.getFullYear()+"-"+month+"-"+today.getDate()+"T00:00:00Z";
}

const generateYesterdaysDate = () => {
    const today = new Date();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const yesterday = today.getDate() - 1;
    return today.getFullYear()+"-"+month+"-"+yesterday+"T00:00:00Z";
}
xmlhttpTodaysCases.open("GET", "https://api.covid19api.com/country/morocco/status/deaths?from="+generateTodaysDate()+"&to="+generateYesterdaysDate(), true);
xmlhttpTodaysCases.send();

