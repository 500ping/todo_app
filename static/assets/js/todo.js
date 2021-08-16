jQuery(document).ready(function($) {

	"use strict";

	function ajax_post_setup(form) {
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
	};

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

		ajax_post_setup(form);

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
		const taskID = $(this).data('taskid');
		const form = $('#task-form'); // use task form to get csrf token

		ajax_post_setup(form);

		$.post('/task/' + taskID + '/delete/', {}).done(function (response) {
			if (response.status === 'success') {
				deleteTask(taskID);
			} else {
				alert(response.status);
			};
		});
	})

	$('#list-tasks').on('click', 'input', function (event) {
		event.preventDefault();

		const taskID = $(this).data('taskid');
		const form = $('#task-form'); // use task form to get csrf token

		ajax_post_setup(form);

		$.post('/task/' + taskID + '/change_status/', {}).done(function (response) {
			if (response.status === 'success') {
				editTask(response.task.id, response.task.name, response.task.status);
			} else {
				alert(response.status);
			};
		});
	});

	function createTask(taskID, taskName, taskStatus) {
		const task = `<li id="taskno-${taskID}">
						<label>
							<input type="checkbox" data-taskid="${taskID}" ${taskStatus ? 'checked' : ''}><i class="check-box"></i><span>${taskName}</span>
							<a href='javascript:void(0);' data-taskid="${taskID}" class="fa fa-times delete-task-button"></a>
							<a href="javascript:void(0);" data-toggle="modal" data-target="#add-task-modal" data-type="edit" data-taskid="${taskID}" class="fa fa-pencil"></a>
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