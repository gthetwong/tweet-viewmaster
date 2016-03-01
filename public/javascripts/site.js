(function() {

	var lastAction = {};
	var socket = io();
	socket.connect();

	socket.on('tweet', function(data) {
		var content = document.querySelector('.content');
		var container = document.createElement('div');
		var username = document.createElement('a');
		var tweetText = document.createElement('p');
		container.className = 'tweet';
		username.innerHTML = '<img src=' + data.user.profile_image_url + '>' + data.user.name + ', ' + data.user.screen_name;
		username.href = data.user.url;
		tweetText.innerHTML = data.text;
		container.appendChild(username);
		container.appendChild(tweetText);
		content.insertBefore(container, content.firstChild);
		setTimeout(function() {
			content.removeChild(container);
		}, 10000);
	});

	socket.on('error', function(data) {
		console.log(data);
	});

	var toggle = document.querySelector('.switch');
	toggle.addEventListener('click', function(e){
		var el = e.target;
		if (el.classList.contains('on')){
			el.classList.toggle('on');
			el.textContent = 'I am OFF.';
			socket.emit('end');
		} else {
			el.classList.toggle('on');
			el.textContent = 'I am ON.';
			socket.emit(lastAction.action, lastAction.query);
		}
	});


	var form = document.querySelector('form');
	form.addEventListener('submit', changeSubject);

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

	var trends = document.querySelector('.trends');
	trends.addEventListener('click', getTrends);

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
