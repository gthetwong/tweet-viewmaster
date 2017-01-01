;(function() {

	var lastAction = {};
	var socket = io();
	socket.connect();

	socket.on('tweet', function(data) {
		//add a new scene object with the tweet info

		//data.user.profile_image_url
		//data.user.name
		//data.user.url
		//data.user.url
		//data.text
	});

	socket.on('error', function(data) {
		console.log(data);
	});

	//var toggle = document.querySelector('.switch');
	//toggle.addEventListener('click', function(e){
	//	var el = e.target;
	//	if (el.classList.contains('on')){
	//		el.classList.toggle('on');
	//		el.textContent = 'I am OFF.';
	//		socket.emit('end');
	//	} else {
	//		el.classList.toggle('on');
	//		el.textContent = 'I am ON.';
	//		socket.emit(lastAction.action, lastAction.query);
	//	}
	//});


	//var form = document.querySelector('form');
	//form.addEventListener('submit', changeSubject);

	function changeSubject(e) {
		e.preventDefault();
		var el = e.target;
		var val = e.target.querySelector('input').value;
		socket.emit('end');
		socket.emit('search', val);
		lastAction.action = 'search';
		lastAction.query = val;
		if (!toggle.classList.contains('on')){
			toggle.classList.toggle('on');
			toggle.textContent = 'I am ON.';
		}
	}

	//var trends = document.querySelector('.trends');
	//trends.addEventListener('click', getTrends);

	function getTrends(e){
		socket.emit('end');
		socket.emit('trends');
		lastAction.action = 'trends';
		lastAction.query = '';
		if (!toggle.classList.contains('on')){
			toggle.classList.toggle('on');
			toggle.textContent = 'I am ON.';
		}
	}

})();
