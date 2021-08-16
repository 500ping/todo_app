jQuery(document).ready(function($) {

	"use strict";

	// Widget Handler
	const widgetSocket = new WebSocket(
		'ws://'
		+ window.location.host
		+ '/ws/widget/'
	);

	widgetSocket.onmessage = function(e) {
		const data = JSON.parse(e.data);
		console.log(data);
		$('#count-user').text(data.widget.user_count);
		$('#tobuy-sum').text(data.widget.sum_tobuy);

		$('.count').each(function () {
			$(this).prop('Counter',0).animate({
				Counter: $(this).text()
			}, {
				duration: 1000,
				easing: 'swing',
				step: function (now) {
					$(this).text(Math.ceil(now));
				}
			});
		});
	};

	widgetSocket.onclose = function(e) {
		console.error('Chat socket closed unexpectedly');
	};

});