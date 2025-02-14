<html>
    <head></head>
    <body></body>
<div id="chart-container" style="width: 100%; height: 100%; overflow: visible;">
    <canvas id="myChart" width="400" height="400"></canvas>
</div>

<!-- Include Chart.js library -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    let myChart;

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
        console.log(`Cookie set: ${name} = ${value}`);
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

function getGoalDateFromCookie() {
  const dateString = getCookie('goal-weight-date');
  return dateString ? new Date(dateString) : null;
}

    function generateDynamicDataPoints(currentWeight, goalWeight) {
        const percentages = [1, 0.8, 0.72, 0.4, 0.3, 0];
        const weightData = percentages.map(p => {
            const weight = currentWeight + (goalWeight - currentWeight) * (1 - p);
            return weight.toFixed(2);
        });
        console.log('Generated weight data:', weightData);
        return weightData;
    }

    function generateDateLabels(startDate, endDate, numberOfPoints) {
        const dateLabels = [];
        const timeInterval = (endDate - startDate) / (numberOfPoints - 1);
        const currentYear = new Date().getFullYear();

        for (let i = 0; i < numberOfPoints; i++) {
            const date = new Date(startDate.getTime() + timeInterval * i);
            let dateString = date.toLocaleDateString('es-ES', { month: 'long', day: 'numeric' }); // Change to 'es-ES'
            
            if (date.getFullYear() !== currentYear) {
                dateString += `, ${date.getFullYear()}`;
            }
            
            dateLabels.push(dateString);
        }
        return dateLabels;
    }

function updateChartWithGoalData() {
  const currentWeight = parseFloat(getCookie('weight-kg'));
  const goalWeight = parseFloat(getCookie('goal-weight-kg'));

  if (isNaN(currentWeight) || isNaN(goalWeight)) {
    console.log('Current weight or goal weight cookie not found or invalid');
    return;
  }

  const numberOfPoints = 6;
  const weightData = generateDynamicDataPoints(currentWeight, goalWeight);

  const goalDate = getGoalDateFromCookie() || new Date();
  const currentDate = new Date();
  const dateLabels = generateDateLabels(currentDate, goalDate, numberOfPoints);

  console.log('Weight Data:', weightData);
  console.log('Date Labels:', dateLabels);

        const ctx = document.getElementById('myChart').getContext('2d');

        if (myChart) {
            myChart.destroy();
        }

        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dateLabels,
                datasets: [{
                    label: 'Weight',
                    data: weightData,
                    borderColor: '#FC846E',
                    borderWidth: 4,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 0,
                    pointBackgroundColor: 'transparent',
                    pointBorderColor: 'transparent',
                    pointBorderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        right: 20
                    }
                },
                scales: {
                    x: {
                        type: 'category',
                        title: {
                            display: false
                        },
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: 'rgba(255,255,255,0.8)',
                            display: true,
                            autoSkip: false,
                            maxRotation: 0,
                            minRotation: 0,
                            callback: function(value, index) {
                                if (index === 0 || index === this.getLabels().length - 1) {
                                    return this.getLabelForValue(value);
                                }
                                return '';
                            }
                        }
                    },
                    y: {
                        title: {
                            display: false
                        },
                        ticks: {
                            reverse: false,
                            color: 'rgba(255,255,255,0.8)',
                            stepSize: 1,
                            callback: function(value) {
                                return value + ' kg';
                            }
                        },
                        min: Math.min(...weightData),
                        max: Math.max(...weightData),
                        grid: {
                            display: true,
                            color: 'rgba(255, 255, 255, 0.2)',
                        },
                        border: {
                            display: false,
                            color: 'rgba(255,255,255,0.3)',
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true
                    },
                    annotation: {
                        annotations: {
                            line1: {
                                type: 'line',
                                yMin: goalWeight,
                                yMax: goalWeight,
                                borderColor: 'rgba(255, 255, 255, 0.5)',
                                borderWidth: 2,
                                label: {
                                    enabled: true,
                                    content: `Goal: ${goalWeight} kg`,
                                    position: 'end',
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    color: '#fff',
                                    font: {
                                        weight: 'bold'
                                    },
                                    xAdjust: 50,
                                    yAdjust: -10
                                }
                            }
                        }
                    }
                }
            }
        });
        updateGoalWeightDate();
        console.log('Chart updated successfully');
    }

    function updateGoalWeightDate() {
        const goalDate = getGoalDateFromCookie();
        if (goalDate) {
            const currentDate = new Date();
            
            // English format
            let englishDisplayDate;
            if (goalDate.getFullYear() === currentDate.getFullYear()) {
                englishDisplayDate = goalDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
            } else {
                englishDisplayDate = goalDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            }
            
            // Spanish format
            let spanishDisplayDate;
            if (goalDate.getFullYear() === currentDate.getFullYear()) {
                spanishDisplayDate = goalDate.toLocaleDateString('es-ES', { month: 'long', day: 'numeric' });
            } else {
                spanishDisplayDate = goalDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
            }
            
            // Update English elements
            document.querySelectorAll('[custom-data="goal-weight-date"]').forEach(element => {
                element.textContent = englishDisplayDate;
            });
            
            // Update Spanish elements
            document.querySelectorAll('[custom-data="goal-weight-date-es"]').forEach(element => {
                element.textContent = spanishDisplayDate;
            });
        }
    }

      document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('weightChangePerWeek')) {
    localStorage.setItem('weightChangePerWeek', '1.65');
  }

  updateChartWithGoalData();
  updateGoalWeightDate();
});

document.addEventListener('updateChartAndGoalDate', function() {
  updateChartWithGoalData();
  updateGoalWeightDate();
});
</script>
</body>
</html>