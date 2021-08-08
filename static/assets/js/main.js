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

	// Task handle
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
			const taskID = button.data('taskid');

			// get task in view base on id
			const taskListElement = $('#taskno-' + taskID);
			const taskName = taskListElement.find('span').text();
			const taskStatus = taskListElement.find('input').is(':checked');	

			modal.find('.modal-title').text('Edit task');
			modal.find('.modal-body #task-id').val(taskID);
			modal.find('.modal-body #task-name').val(taskName);
			modal.find('.modal-body #task-status').prop('checked', taskStatus);
		};
	});

	$('#task-form').submit(function(event) {
		event.preventDefault();
		const form = $(this);

		// ajax setup
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

		const taskType = form.find('#task-type').val();
		const taskName = form.find('#task-name').val();
		const taskStatus = form.find('#task-status').is(':checked');		

		if (taskType === 'new') {
			let dataPayload = {
				name: taskName,
				status: taskStatus,
			};

			$.post('/task/', dataPayload).done(function (response) {
				console.log(response.new_task);
				if (response.status === 'success') {
					createTask(response.new_task.id, response.new_task.name, response.new_task.status);
					$('#add-task-modal').modal('hide');
				} else {
					alert(response.status);
				};
			});
		} else {
			const id = form.find('#task-id').val();
			let dataPayload = {
				name: taskName,
				status: taskStatus,
			};
			$.post('/task/' + id + '/', dataPayload).done(function (response) {
				console.log(response.task);
				if (response.status === 'success') {
					editTask(response.task.id, response.task.name, response.task.status);
					$('#add-task-modal').modal('hide');
				} else {
					alert(response.status);
				};
			});
		};
	});

	$('#list-tasks').on('click', '.delete-task-button', function () {
		const id = $(this).data('taskid');
		$.get('/task/' + id + '/delete/', {}).done(function (response) {
			if (response.status === 'success') {
				deleteTask(id);
			} else {
				alert(response.status);
			};
		});
	})

	function createTask(taskID, taskName, taskStatus) {
		const task = `<li id="taskno-${taskID}">
						<label>
							<input type="checkbox" ${taskStatus ? 'checked' : ''}><i class="check-box"></i><span>${taskName}</span>
							<a href='javascript:void(0);' data-taskid="${taskID}" class="fa fa-times delete-task-button"></a>
							<a href="javascript:void(0);" data-toggle="modal" data-target="#add-task-modal" data-type="edit" data-taskid="${taskID}" class="fa fa-pencil"></a>
							<a href='#' class="fa fa-check"></a>
						</label>
					</li>`;
		$('#list-tasks').append(task);
	};

	function editTask(taskID, taskName, taskStatus) {
		const taskListElement = $('#taskno-' + taskID);
		taskListElement.find('span').text(taskName);
		taskListElement.find('input').prop('checked', taskStatus);
	}

	function deleteTask(taskID) {
		const taskListElement = $('#taskno-' + taskID);
		taskListElement.fadeOut(300);
	};

});