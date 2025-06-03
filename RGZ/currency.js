function initCurrencyCalculator() {
    fetch('https://www.cbr-xml-daily.ru/daily_json.js')
        .then(response => response.json())
        .then(data => {
            const rate = data.Valute.IDR.Value / data.Valute.IDR.Nominal;
            document.getElementById('currentRate').textContent = `1 IDR = ${rate.toFixed(6)} RUB`;
            window.currentRate = rate;
        })
        .catch(error => {
            console.error('Ошибка загрузки курса валют:', error);
            document.getElementById('currentRate').textContent = 'Не удалось загрузить курс';
            window.currentRate = 0.0045;
        });
}

function convert(direction) {
    if (!window.currentRate) {
        alert('Курс валют не загружен. Попробуйте позже.');
        return;
    }
    if (direction === 'rubToIdr') {
        const rub = parseFloat(document.getElementById('rub').value);
        if (!isNaN(rub)) {
            document.getElementById('idr').value = (rub / window.currentRate).toFixed(2);
        }
    } else if (direction === 'idrToRub') {
        const idr = parseFloat(document.getElementById('idr2').value);
        if (!isNaN(idr)) {
            document.getElementById('rub2').value = (idr * window.currentRate).toFixed(2);
        }
    }
}

function initCurrencyChart() {
    const dates = [
        "1 мая", "6 мая", "7 мая", "8 мая",
        "13 мая", "14 мая", "15 мая", "16 мая", "17 мая",
        "20 мая", "21 мая", "22 мая", "23 мая", "24 мая",
        "27 мая", "28 мая", "29 мая"
    ];
    const rates = [
        48.5455, 49.6657, 49.3034, 49.0901,
        49.0321, 48.8271, 48.5263, 48.475, 48.8472,
        48.9611, 48.8043, 48.6121, 48.5808, 48.8634,
        48.9034, 49.1254, 48.9718
    ];
    const ctx = document.getElementById('currencyChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'Курс IDR к RUB',
                data: rates,
                backgroundColor: '#0077ff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: { color: 'white' },
                    title: { display: true, text: 'Курс (RUB)', color: 'white' }
                },
                x: {
                    ticks: { color: 'white' },
                    title: { display: true, text: 'Дата', color: 'white' }
                }
            },
            plugins: {
                legend: { labels: { color: 'white' } },
                tooltip: { titleColor: 'white', bodyColor: 'white' }
            },
            onClick: (e, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const date = dates[index];
                    const rate = rates[index].toFixed(6);
                    document.getElementById('chartInfo').innerHTML = `<strong>${date}</strong>: 1 IDR = ${rate} RUB`;
                    chart.data.datasets[0].backgroundColor = rates.map((r, i) =>
                        i === index ? 'rgb(255, 255, 255)' : '#0077ff'
                    );
                    chart.update();
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.currency-section')) {
        initCurrencyCalculator();
        initCurrencyChart();
    }
});
