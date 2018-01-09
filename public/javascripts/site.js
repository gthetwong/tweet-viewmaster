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
        camera.position.z = 400;

        var light = new THREE.DirectionalLight(0xffffff);
        light.position.set(100, 200, 400);
        scene.add(light);
        var ambientLight = new THREE.AmbientLight(0xffffff);
        ambientLight.position.set(0, 200, -400);
        scene.add(ambientLight);


        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize( window.innerWidth, window.innerHeight );

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        document.body.appendChild( renderer.domElement );
    }

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
        var sphere = new THREE.SphereGeometry(10,10,10);
        var material = new THREE.MeshStandardMaterial();
        var mesh = new THREE.Mesh(sphere, material);
        mesh.position.x = Math.random() * 2500 * (Math.random() < 0.5? -1:1);
        mesh.position.y = Math.random() * 2500 * (Math.random() < 0.5? -1:1);
        mesh.position.z = Math.random() * 2500 * (Math.random() < 0.5? -1:1);
        mesh.tweetData = data;
        if (tweetSpheres.length > 10000) {
            let old = tweetSpheres.shift();
            console.log(old);
            scene.remove(old);
        }
        scene.add(mesh);
        tweetSpheres.push(mesh);
        console.log(tweetSpheres.length);

        window.setTimeout(function() {
            scene.remove(mesh);
        }, 20000);
    }

    function addTweet(data) {

    }

    function animate() {
        requestAnimationFrame(animate);

        for (var i = 0; i < tweetSpheres.length; i++) {
            tweetSpheres[i].position.y += .001 * Math.cos(Date.now() * 0.000001);
            tweetSpheres[i].rotation.y += .01;
        }

        renderer.render(scene, camera);
        controls.update();
    }
})();
