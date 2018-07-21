var dexData = {
	"[\"Package Not Delivered\", \"Incorrect Address\", \"Security Delay\"]":[932, 212, 23],
	"[\"Refused By Recipient\", \"Not In/Business Closed\", \"Damaged- Not Complete\"]":[521, 324, 34],
	"[\"Damaged- Complete\", \"C O D Delivery\", \"Sorted to Wrong Route\"]":[545, 32, 23],
	"[\"Business Closed Due to Strike\", \"Payment Recieved\", \"Future Delivery\"]":[381, 342, 334],
	"[\"Release Signiture on File\", \"Delivered to Wrong Address\", \"Not Attempted\"]":[545, 322, 23],
	"[\"Shipment Refused\", \"Security Delay\", \"Wrong Route\"]":[921, 832, 634],
};
var total = 0;

function showChartView() {
	document.getElementById("chooseChart").className = "chosen";
	document.getElementById("chooseMap").className = "notChosen";
	document.getElementById("map").style.display = "none";
	document.getElementById("chart").style.display = "block";
	document.getElementById("tierNames").className = "chartTierNames";
	document.getElementById("chart-container").style.display = "block";
	
	showChart();
}

function showMapView() {
	document.getElementById("chooseMap").className = "chosen";
	document.getElementById("chooseChart").className = "notChosen";
	
	document.getElementById("map").style.display= "block";
	document.getElementById("chart").style.display= "none";
	document.getElementById("tierNames").className = "mapTierNames";
	document.getElementById("chart-container").style.display = "inline-flex";
	
	showMap();
}

var tooltipData = [];
var tooltipLabels = [];
function generateData() {
	var color = "rgb(75, 19, 136)";
	var gridColor = "rgba(0, 0, 0, 0.1)";
	var labels = [];
	var colors = [];
	var data = [];
	var gridlines = ["rgba(0, 0, 0, 0.1)"];
	var tierTotal;
	var tierNum = 1;
	
	for(var tier in dexData) {
		var label = JSON.parse(tier);
		tierTotal = 0;
		for (var i = 0; i < label.length; i++) {
			labels.push(label[i]);
			data.push(dexData[tier][i]);
			colors.push(color);
			if (i > 0) gridlines.push(gridColor);
			
			tierTotal += dexData[tier][i];
			total += dexData[tier][i];
		}
		gridlines.push('black');
		
		document.getElementById("tier"+tierNum).innerHTML = "Total: " + tierTotal;
		tierNum++;
		
		if(color == "rgb(75, 19, 136)") color = "rgb(234, 98, 20)";
		else color = "rgb(75, 19, 136)";
		
	}
	
	return {data: {
			labels: labels,
			datasets: [{
				label: 'Exception Count:',
				backgroundColor:  colors,
				borderColor:  colors,
				borderWidth: 1,
				data: data
			}]
		}, 
		gridColors: gridlines};
}

function generateMapData() {
	var labels = [];
	var tierNum = 1;
	var datasets = [];
	var data = [[], [], []];
	var color = ['rgb(42, 2, 68)', 'rgb(102, 54, 132)', 'rgb(205, 167, 229)'];
	var datasetLabels = [[], [], []];
	tooltipLabels = [[], [], []];
	tooltipData = [[], [], []];
	
	for(var tier in dexData) {
		var label = JSON.parse(tier);
		tierTotal = 0;
		
		for (var i = 0; i < label.length; i++) {
			data[i].push(dexData[tier][i]);
			tooltipLabels[i].push(label[i]);
			tooltipData[i].push(dexData[tier][i]);
			
			tierTotal += dexData[tier][i];
			total += dexData[tier][i];
			
		}

		document.getElementById("tier"+tierNum).innerHTML = "Total: " + tierTotal;
		labels.push("TIER " + tierNum);
		tierNum++;
	}
	
	var max = 0;
	var total = 0;
	for(var i = 0; i < 6; i++) {
		total = data[0][i] + data[1][i] + data[2][i];
		if (total > max) max = total;
	}
	
	for(var i = 0; i < 6; i++) {
		total = data[0][i] + data[1][i] + data[2][i];
		data[0][i] *= max / total;
		data[1][i] *= max / total;
		data[2][i] *= max / total;
	}
	
			datasets.push({
				label: datasetLabels[0],
				borderWidth: 5,
				data: data[0],
				backgroundColor:  color[0],
				borderColor:  'white'
			});
			
			datasets.push({
				label: datasetLabels[1],
				borderWidth: 5,
				data: data[1],
				backgroundColor:  color[1],
				borderColor:  'white'
			});
			
			datasets.push({
				label: datasetLabels[2],
				borderWidth: 5,
				data: data[2],
				backgroundColor:  color[2],
				borderColor:  'white'
			});
	
			
	
	return {data: {
			labels: labels,
			datasets: datasets
		}};
}

function showChart() {
			var ctx ;
			var chartData = generateData();
			ctx = document.getElementById('canvas').getContext('2d');
			var chart = new Chart(ctx, {
				type: 'bar',
				data: chartData.data,
				options: {
					responsive: true,
					maintainAspectRatio: false,
					legend: {
						display: false
					},
					tooltips: {
						displayColors: false
					},
					title: {
						display: false,
					},
					scales: {
						yAxes: [{
							ticks: {
								display: true
							},
						}],
						xAxes: [{
							ticks: {
								autoSkip: false,
								maxRotation: 90,
								minRotation: 90,
							},
							gridLines: {
								color: chartData.gridColors
							}
						}]
					}
				}
			});
			console.log(chart);
		};
		
function showMap() {
			var ctx ;
			var chartData = generateMapData();
			ctx = document.getElementById('mapCanvas').getContext('2d');
			var chart = new Chart(ctx, {
				type: 'horizontalBar',
				data: chartData.data,
				options: {
					responsive: true,
					maintainAspectRatio: false,
					legend: {
						display: false
					},
					tooltips: {
						displayColors: false,
						callbacks: {
							label: function(tooltipItems, data) { 
								return tooltipLabels[tooltipItems.datasetIndex][tooltipItems.index] + ' : ' + tooltipData[tooltipItems.datasetIndex][tooltipItems.index];
							}
						},
						axis: 'y'
					},
					title: {
						display: false
					},
					scales: {
						xAxes: [{
							stacked: true,
							display: false  
						}],
						yAxes: [{
							categoryPercentage: 1.0,
							barPercentage: 1.0,
							stacked: true,
							display: false
						}],
					}
				},
				plugins: [{
        afterDatasetsDraw: function (chart) {
			var ctx = chart.chart.ctx;
			ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
			ctx.textAlign = 'left';
			ctx.textBaseline = 'bottom';
			console.log(chart);

			for(var d in chart.data.datasets) {
				var dataset = chart.data.datasets[d];
				var padding = 15;
				for (var i = 0; i < dataset.data.length; i++) {
					if (d < 2) ctx.fillStyle = '#FFF'; // label color
					else ctx.fillStyle = '#000';
					ctx.font = "15pt Verdana";
					var label = tooltipLabels[d][i];
					
					var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
					
					var yPos = model.y + 8;
					var xPos = model.x - ctx.measureText(label).width - padding;
					
					if (d > 0) {
						var model2 = chart.data.datasets[d-1]._meta[Object.keys(chart.data.datasets[d-1]._meta)[0]].data[i]._model;
						if (xPos-padding > model2.x) ctx.fillText(label, xPos, yPos);
					} else {
						if (xPos > padding) ctx.fillText(label, xPos, yPos);
					}
					
					
				}
            }               
        }
       }]
	});
};

window.onload = showChart;
