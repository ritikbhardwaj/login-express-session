$(document).ready(() => {
	// Check for click events on the navbar burger icon
	$('.navbar-burger').click(function() {
		// Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
		$('.navbar-burger').toggleClass('is-active');
		$('.navbar-menu').toggleClass('is-active');
	});

	let data = {};
	$('button.button').click(() => {
		data.email = $('.field#email input').val();
		data.password = $('.field#password input').val();

		fetch('/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then(response => response.json())
			.then(data => {
				if (data.authenticated) {
					window.location.href = '/dashboard';
				} else {
					$('.field#password p.help').text(data.message);
					$('.field#password p.help').css('display', 'block');
				}
			})
			.catch(error => {
				console.error('Error:', error);
			});
	});
});
