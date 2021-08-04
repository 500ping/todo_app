$.noConflict();

jQuery(document).ready(function($) {

	"use strict";

	[].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
		new SelectFx(el);
	});

	jQuery('.selectpicker').selectpicker;

	$('.search-trigger').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').addClass('open');
	});

	$('.search-close').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').removeClass('open');
	});

	$('.equal-height').matchHeight({
		property: 'max-height'
	});

	// Counter Number
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

	// Menu Trigger
	$('#menuToggle').on('click', function(event) {
		var windowWidth = $(window).width();   		 
		if (windowWidth<1010) { 
			$('body').removeClass('open'); 
			if (windowWidth<760){ 
				$('#left-panel').slideToggle(); 
			} else {
				$('#left-panel').toggleClass('open-menu');  
			} 
		} else {
			$('body').toggleClass('open');
			$('#left-panel').removeClass('open-menu');  
		} 
			 
	}); 
	 
	$(".menu-item-has-children.dropdown").each(function() {
		$(this).on('click', function() {
			var $temp_text = $(this).children('.dropdown-toggle').html();
			$(this).children('.sub-menu').prepend('<li class="subtitle">' + $temp_text + '</li>'); 
		});
	});

	// Load Resize 
	$(window).on("load resize", function(event) { 
		var windowWidth = $(window).width();  		 
		if (windowWidth<1010) {
			$('body').addClass('small-device'); 
		} else {
			$('body').removeClass('small-device');  
		} 
		
	});

	// Add Task
	$('#add-task-modal').on('show.bs.modal', function (event) {
		const button = $(event.relatedTarget); // Button that triggered the modal

		const type = button.data('type'); // Extract info from data-* attributes

		// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
		// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
		const modal = $(this);

		modal.find('.modal-body #task-type').val(type);

		if (type === 'new') {
			modal.find('.modal-title').text('Add new task');
			modal.find('.modal-body #task-name').val('');
			modal.find('.modal-body #task-status').prop('checked', false);
		} else {
			const taskName = button.data('taskname');
			const taskStatus = button.data('taskstatus');

			modal.find('.modal-title').text('Edit task');
			modal.find('.modal-body #task-name').val(taskName);
			modal.find('.modal-body #task-status').prop('checked', taskStatus === 'True' ? true : false);
		};
	});

	$('#task-form').submit(function(event) {
		event.preventDefault();

		const form = $(this);

		const taskType = form.find('#task-type').val();
		const taskName = form.find('#task-name').val();
		const taskStatus = form.find('#task-status').is(':checked');		

		if (taskType === 'new') {
			const csrftoken = form.find("[name='csrfmiddlewaretoken']").val();

			function csrfSafeMethod(method) {
				// these HTTP methods do not require CSRF protection
				return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
			}
	
			$.ajaxSetup({
				beforeSend: function (xhr, settings) {
					if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
						xhr.setRequestHeader("X-CSRFToken", csrftoken);
					}
				}
			});
	
			let dataPayload = {
				name: taskName,
				status: taskStatus,
			};

			$.post('/task/', dataPayload).done(function (response) {
				console.log(response.status)
				if (response.status === 'success') {
					createTask(taskName, taskStatus);
				} else {
					alert(response.status);
				}
			});

			$('#add-task-modal').modal('hide');
		};
	});

	function createTask(taskName, taskStatus) {
		const task = `<li class="drag">
						<label>
							<input type="checkbox" ${taskStatus ? 'checked' : ''}><i class="check-box"></i><span>${taskName}</span>
							<a href='#' class="fa fa-times"></a>
							<a href='#' class="fa fa-pencil"></a>
							<a href='#' class="fa fa-check"></a>
						</label>
					</li>`;
		$('#list-tasks').append(task);
	};

});