(function(){


	var socket = io();
	socket.connect();
	socket.on('tweet', function(data){
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
		setTimeout(function(){
			content.removeChild(container);
		}, 5000);
	});
	socket.on('error', function(data) {
		console.log(data);
	});
	var toggle = document.querySelector('.switch');
	toggle.addEventListener('click', socketSwitch.bind(this, socket));
	function socketSwitch(socket, e){
		var el = e.target;
		if (el.classList.contains('on')){
			el.classList.toggle('on');
			el.textContent = 'I am OFF.';
			socket.disconnect();
		} else {
			el.classList.toggle('on');
			el.textContent = 'I am ON.';
			socket.connect();
		}
	};

})();
