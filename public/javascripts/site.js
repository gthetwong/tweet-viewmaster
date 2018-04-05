;(function() {
    "use strict";
    function prev() {
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
    }

    var socket = io();
    var scene, camera, renderer, controls, INTERSECTED, raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2();
    var tweetSpheres = [];
		var moveForward = false;
		var moveBackward = false;
		var moveLeft = false;
		var moveRight = false;
		var canJump = false;
		var prevTime = performance.now();
		var velocity = new THREE.Vector3();
		var direction = new THREE.Vector3();
		var sphere = new THREE.SphereGeometry(10,10,10);
		var material = new THREE.MeshStandardMaterial();

		socket.connect();
		socket.emit('trends');
		socket.on('tweet', addTweetSphere);

    socket.on('error', function(data) {
        console.log(data);
    });

    init();
    animate();

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mouseup', onMouseUp, false);
    window.addEventListener('resize', onWindowResize, false);

    function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
        //camera.position.z = 400;

       // var light = new THREE.DirectionalLight(0xffffff);
       // light.position.set(100, 200, 400);
       // scene.add(light);
        var pointLight = new THREE.PointLight(0xffffff, .25, 0, 2);
        pointLight.position.set(0, 0, 0);
        scene.add(pointLight);


		//		var wallPanelGeometry = new THREE.SphereGeometry(1000, 10, 10);
		//		var material = new THREE.MeshStandardMaterial( {color: 0xffff00, side: THREE.BackSide, roughness: 0.2, metalness: 0.75});
		//		var wallMesh = new THREE.Mesh(wallPanelGeometry, material );

				//scene.add(wallMesh);

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize( window.innerWidth, window.innerHeight );



        //controls = new THREE.OrbitControls(camera, renderer.domElement);
				//controls.update();
        controls = new THREE.PointerLockControls(camera);
				controls.enabled = true;
				scene.add(controls);
				scene.add(controls.getObject());

        document.body.appendChild( renderer.domElement );

				document.addEventListener( 'keydown', onKeyDown, false );
				document.addEventListener( 'keyup', onKeyUp, false );
    }

	function onKeyDown( event ) {
			switch ( event.keyCode ) {
				case 38: // up
				case 87: // w
					moveForward = true;
					break;
				case 37: // left
				case 65: // a
					moveLeft = true; break;
				case 40: // down
				case 83: // s
					moveBackward = true;
					break;
				case 39: // right
				case 68: // d
					moveRight = true;
					break;
				case 32: // space
					if ( canJump === true ) velocity.y += 350;
						canJump = false;
					break;
			}
		};

	 function onKeyUp( event ) {
			switch( event.keyCode ) {
				case 38: // up
				case 87: // w
					moveForward = false;
					break;
				case 37: // left
				case 65: // a
					moveLeft = false;
					break;
				case 40: // down
				case 83: // s
					moveBackward = false;
					break;
				case 39: // right
				case 68: // d
					moveRight = false;
					break;
			}
		};

    function onWindowResize() {
        camera.aspect = window.innerWidth/ window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onMouseUp(e) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(scene.children);
        var tweetText = document.querySelector('.tweet');
        if (intersects.length > 0) {
            INTERSECTED = intersects[0].object;
            tweetText.innerText = INTERSECTED.tweetData.text;
            INTERSECTED.material.emissive.setHex(0x00ff00);
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        }
    }

    function onMouseMove(e) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            console.log(intersects[0]);
            if (INTERSECTED != intersects[0].object) {
                if (INTERSECTED) {
                    INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                }
                INTERSECTED = intersects[0].object;
                INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                INTERSECTED.material.emissive.setHex(0xff0000);
            }
        } else {
            if (INTERSECTED)
                INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            INTERSECTED = null;
        }
    }

    // Additional user info
    // data.user.profile_image_url
    // data.user.name
    // data.user.url
    // data.user.url
    // data.text
    function addTweetSphere(data) {
//        var sphere = new THREE.SphereGeometry(10,10,10);
//        var material = new THREE.MeshStandardMaterial();
        var mesh = new THREE.Mesh(sphere, material);
        mesh.position.x = Math.random() * 2500 * (Math.random() < 0.5? -1:1);
        mesh.position.y = Math.random() * 2500 * (Math.random() < 0.5? -1:1);
        mesh.position.z = Math.random() * 2500 * (Math.random() < 0.5? -1:1);
        mesh.tweetData = data;
        scene.add(mesh);
        tweetSpheres.push({mesh: mesh, material: material, geometry: sphere});
        //console.log(tweetSpheres.length);

        window.setTimeout(function() {
            scene.remove(mesh);

						sphere.dispose();
						material.dispose();
        }, 20000);
    }

		function removeTweet() {
        if (tweetSpheres.length > 10000) {
            let old = tweetSpheres.shift();
            //console.log(old);
            scene.remove(old.mesh);
//						old.material.dispose();
//						old.geometry.dispose();
        }
		}

    function addTweet(data) {

    }

    function animate() {
        requestAnimationFrame(animate);

        for (var i = 0; i < tweetSpheres.length; i++) {
            tweetSpheres[i].mesh.position.y += .001 * Math.cos(Date.now() * 0.000001);
            tweetSpheres[i].mesh.rotation.y += .01;
        }

				//controls.update();

				var time = performance.now();
				var delta = ( time - prevTime ) / 100;
				velocity.x -= velocity.x * 10.0 * delta;
				velocity.z -= velocity.z * 10.0 * delta;
				velocity.y -= velocity.y * 10.0 * delta; // 100.0 = mass

				direction.z = Number( moveForward ) - Number( moveBackward );
				direction.x = Number( moveLeft ) - Number( moveRight );
				direction.normalize(); // this ensures consistent movements in all directions

				if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
				if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

				//velocity.y = Math.max( 0, velocity.y );

				controls.getObject().translateX( velocity.x * delta );
				controls.getObject().translateY( velocity.y * delta );
				controls.getObject().translateZ( velocity.z * delta );

				//if ( controls.getObject().position.y < 10 ) {
				//	velocity.y = 0;
				//	controls.getObject().position.y = 10;
				//}
				prevTime = time;

        renderer.render(scene, camera);
    }
})();
