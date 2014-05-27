$(function () {
		var options = {
				chart: {
						borderWidth: 5,
						borderColor: '#e8eaeb',
						borderRadius: 0,
						renderTo: 'container',
						backgroundColor: '#f7f7f7',
						//zoomType: 'x',
						events: {
								load: chartLoad
						}	
				},
				title: {
						style: {
								'fontSize': '1em'
						},
						useHTML: true,
						x: -27,
						y: 8,
            text: '<span class="chart-title"> Drag and drop on a chart to add annotation  <span class="chart-href"> <a href="http://www.blacklabel.pl/highcharts" target="_blank"> Black Label </a> </span> <span class="chart-subtitle">plugin by </span></span>'
				},
				annotations: [{
						title: {
								text: '<span style="">drag me anywhere <br> dblclick to remove</span>',
								style: {
										color: 'red'
								}
						},
						anchorX: "left",
						anchorY: "top",
						allowDragX: true,
						allowDragY: true,
						x: 515,
						y: 55
				}, {
						title: 'drag me <br> horizontaly',
						anchorX: "left",
						anchorY: "top",
						allowDragY: false,
						allowDragX: true,
						xValue: 3,
						yValue: 10,
						shape: {
								type: 'path',
								params: {
										d: ['M', 0, 0, 'L', 110, 0],
										stroke: '#c55'
								}
						}
				}, {
						title: 'on point <br> drag&drop <br> disabled',
						linkedTo: 'high',
						allowDragY: false,
						allowDragX: false,   
						anchorX: "center",
						anchorY: "center",                      
						shape: {
								type: 'circle',
								params: {
										r: 40,
										stroke: '#c55'
								}
					}
				}, {
						x: 100,
						y: 200,
						title: 'drag me <br> verticaly',
						anchorX: "left",
						anchorY: "top",
						allowDragY: true,
						allowDragX: false,
						shape: {
								type: 'rect',
								params: {
									x: 0,
									y: 0,
									width: 55,
									height: 40
								}
						}
				}],
				series: [{
						data: [13, 4, 5, {y: 1, id: 'high'}, 2, 14, 3, 2, 11, 6]
				}]
		};
		
		var chart = new Highcharts.Chart(options, function (chart) {

				var container = chart.container,
						offsetX = chart.plotLeft - container.offsetLeft,
						offsetY = chart.plotTop - container.offsetTop;
				Highcharts.addEvent(container, 'mousedown', function (e) {
					var isInside = chart.isInsidePlot(e.clientX - offsetX, e.pageY - offsetY);
				}); 
		});
		
		function chartLoad() {
				var chart = this,
						container = chart.container,
						annotations = chart.annotations.allItems,
						annotation,
						clickX,
						clickY;
				
				function getParams(e){		
						
						function getRadius(e) {
							var x = e.pageX - container.offsetLeft,
									y = e.pageY - container.offsetTop,
									dx = Math.abs(x - clickX),
									dy = Math.abs(y - clickY);
							return parseInt(Math.sqrt(dx * dx + dy * dy), 10);
						}
						
						function getPath(e) {
							var x = e.pageX - container.offsetLeft,
									y = e.pageY - container.offsetTop,
									dx = x - clickX,
									dy = y - clickY;
							
							return ["M", 0, 0, 'L', parseInt(dx, 10), parseInt(dy, 10)];
						}
							
						function getWidth(e) {
							var x = e.clientX - container.offsetLeft,
									dx = Math.abs(x - clickX);
							
							return parseInt(dx, 10) + 1;
						}
						
						function getHeight(e) {
							var y = e.pageY - container.offsetTop,
									dy = Math.abs(y - clickY);
							
							return parseInt(dy, 10) + 1;
						}
						var shape = annotation.options.shape.params;
						
						var newShape = {};
						if(shape.r) {
								 newShape.r = getRadius(e);
						}
						if(shape.d) {
								 newShape.d = getPath(e);
						}
						if(shape.width) {
								 newShape.width = getWidth(e);
						}
						if(shape.height) {
								 newShape.height = getHeight(e);
						}
						return newShape;
				}
				
				function drag(e) {
						var shape = $("input[type='radio']:checked").val(),
								stroke = $("#stroke").val(),
								strokeWidth = $("#strokeWidth").val(),
								title = $("#title").val(),
								fill = $("#fill").val(),
								x = null,
								y = null,
								width = null,
								height = null,
								radius = null;
				
				
						clickX = e.pageX - container.offsetLeft;
						clickY = e.pageY - container.offsetTop;
						
						
						if (!chart.isInsidePlot(clickX - chart.plotLeft, clickY - chart.plotTop)) {
								return;
						}
						if(strokeWidth == '') {
							strokeWidth = 5;
						} else if(typeof strokeWidth == 'string') {
							strokeWidth = parseInt(strokeWidth, 10);
						}
						
						if(shape == 'rect') {
								x = 0;
								y = 0;
								width = 1;
								height = 1;
								radius = 1;
						}
						
						chart.addAnnotation({
								x: clickX,
								y: clickY,
								allowDragX: true,
								allowDragY: true,
								anchorX: 'left',
								anchorY: 'top',
								title: title,
								shape: {
										type: shape,
										params: {
												r: shape == 'circle' ? 1 : 0,
												d: shape == 'path' ? ['M', 0, 0, 'L', 1, 1] : null,
												x: x,
												y: y,
												width: width,
												height: height,
												rx: radius,
												fill: fill,
												stroke: stroke,
												strokeWidth: strokeWidth
										}
								}
						});
						
						annotation = annotations[annotations.length - 1];
				
						Highcharts.addEvent(document, 'mousemove', step);
				}
				
				function step(e) {
						// use renderer api for better performance
						annotation.shape.attr(getParams(e));
				}
				
				function drop(e) {
						Highcharts.removeEvent(document, 'mousemove', step);
						
						// store annotation details
						if(annotation){
							annotation.update({
									shape: {
											params: getParams(e)
									}
							});
						}
						annotation = null;
				}
				
				Highcharts.addEvent(container, 'mousedown', drag);
				Highcharts.addEvent(document, 'mouseup', drop);
			}
});
