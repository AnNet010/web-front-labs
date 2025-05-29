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

    const dates = [];
    const rates = [];
    
    
    const today = new Date();
    const baseRate = 0.0045;
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString());
        
    
        const fluctuation = (Math.random() - 0.5) * 0.0002;
        rates.push(baseRate + fluctuation);
    }
    
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
                ticks: {
                    color: 'white'
                },
                title: {
                    display: true,
                    text: 'Курс (RUB)',
                    color: 'white' 
                }
            },
            x: {
                ticks: {
                    color: 'white'
                },
                title: {
                    display: true,
                    text: 'Дата',
                    color: 'white'
                }
            }
        },
        plugins: {
        legend: {
            labels: {
                color: 'white'
            }
        },
        tooltip: {
            titleColor: 'white',
            bodyColor: 'white'
        }
    },
        onClick: (e, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const date = dates[index];
                const rate = rates[index].toFixed(6);

                document.getElementById('chartInfo').innerHTML = `
                    <strong>${date}</strong>: 1 IDR = ${rate} RUB
                `;

                chart.data.datasets[0].backgroundColor = rates.map((r, i) =>
                    i === index ? 'rgb(255, 255, 255)' : '#0077ff'
                );
                chart.update();
            }
        }
    }
});

}

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.currency-section')) {
        initCurrencyCalculator();
        initCurrencyChart();
    }
});