(function(){
	var socket = io();
	socket.on('tweet', function(data){
		console.log(data);
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
})();
