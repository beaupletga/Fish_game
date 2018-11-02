document.addEventListener("keydown", on_keyboard_event, false);

var map_size=600;

var keyboard = new KeyboardState();

// array of the positions of the vertices of the mesh of the fish when the fin is at the extreme left position
var positions_start;
// array of the positions of the vertices of the mesh of the fish when the fin is at the extreme right position
var positions_end=[];

// angular speed of the fish
var angle_speed=4;
// linear speed of the fish
var speed=3;
// how much we increase the speed of the fish each time he eats something
var speed_step=0.1;
// how far need the head of the fish have to be from the food to consider that he eats it
var eps_proximity_food=20;

// alpha for the linear interpolation of the fin
var fin_alpha=1;
// speed for increasing and decreasing the alpha of the fin
var fin_speed=0.05;//nageoire
var descending=true;

// level variable
var level=0;

var texture_sand ="sand_texture.jpg"
var texture_water="under_water_texture.png"
var obj_file='fish_mesh.obj';
var mtl_file='fish_mesh.mtl'

function get_world_position_fish()
{
	var wpVector = new THREE.Vector3();
	app.scene.children[4].children[0].getWorldPosition(wpVector)
	return wpVector
}

// return true if the fish is alive else ow
function is_alive()
{
	if (get_world_position_fish().x<-map_size || get_world_position_fish().x>map_size)
	{
		return false
	}
	else if (get_world_position_fish().z<-map_size || get_world_position_fish().z>map_size)
	{
		return false
	}
	return true;
}

// return the norm of the array
function norm(array)
{
	var norm=0;
	for (var i=0;i<array.length;i++){
		norm+=array[i]**2
	}
	return norm**0.5
}

// move the fin by interpolating between two extreme position
function move_fin()
{
	var positions=app.scene.children[4].children[0].geometry.attributes.position.array
		
	if (descending && Math.abs(fin_alpha)<fin_speed){
		descending=false
	}
	else if (!descending && fin_alpha==1){
		descending=true
	}

	if (descending){
		fin_alpha-=fin_speed
	}
	else{
		fin_alpha+=fin_speed
	}

	for(var i=0;i<positions.length-3;i+=3)
	{
		positions[i]=fin_alpha*positions_start[i]+(1-fin_alpha)*positions_end[i]
	}
}

// add cube in the space
function add_cube()
{
	var geometry = new THREE.SphereGeometry( 10, 32, 32 );
	var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
	var cube = new THREE.Mesh( geometry, material );
	cube.position.x=Math.floor((2*Math.random()-1)*map_size*3/4)
	cube.position.z=Math.floor((2*Math.random()-1)*map_size*3/4)
	cube.position.y=50
	// cube.visible=false;
	app.scene.add( cube );	
}

function on_keyboard_event(event)
{
	var keyCode = event.which;
	if (keyCode==37)//left z
	{
		app.scene.children[4].children[0].rotation.y+=angle_speed*Math.PI/180
		app.scene.children[4].children[0].translateX(1);
	}
	if (keyCode==39)//right z
	{
		app.scene.children[4].children[0].rotation.y-=angle_speed*Math.PI/180
		app.scene.children[4].children[0].translateX(-1);
	}
	if (keyCode==38)//right z
	{
		console.log(app.scene.children[4].children[0].rotation)
		app.scene.children[4].children[0].rotation.x+=angle_speed*Math.PI/180
		// app.scene.children[4].children[0].translate(-1);
	}
	if (keyCode==40)//down y
	{
		app.scene.children[4].children[0].rotation.x-=angle_speed*Math.PI/180
		// add_cube();
	}
	if (keyCode==105)//down y
	{
		speed=0;
	}
}

// add sand to the floor with texture and perlin noise
function sand()
{
	texture = new THREE.TextureLoader().load( texture_sand );
	material = new THREE.MeshBasicMaterial( { map: texture} );

	var geometry = new THREE.PlaneGeometry(map_size*2, map_size*2, 50, 50);
	for (let i = 0; i < geometry.vertices.length; i++) 
	{
		let v = geometry.vertices[i];
		v.z=noise.simplex2(v.x /100, v.y/100)*20;
	}
	var mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x -= Math.PI / 2; 
	// mesh.visible=false
	app.scene.add(mesh);
}

// open the mouth of the fish (doesn't work)
function open_mouth()
{
	var positions=app.scene.children[4].children[0].geometry.attributes.position.array
	min_fish_z=min_array(positions,2)
	max_fish_z=max_array(positions,2)
	fish_width=max_fish_z-min_fish_z

	min_fish_y=min_array(positions,1)
	max_fish_y=max_array(positions,1)
	fish_height=max_fish_y-min_fish_y


	for(var i=0;i<positions.length-3;i+=3)
	{
		if (positions[i+2]<1/10*fish_width && positions[i+1]<1/3*fish_height)
		{
			positions[i+1]-=10;
		}
	}
}

// return the min of the array
function min_array(array,axis)
{
	min=Infinity
	for (var i=0;i<array.length;i+=3)
	{
		if (array[i+axis]<min){min=array[i+axis]}
	}
	return min
}

// return the max of an array
function max_array(array,axis)
{
	max=-Infinity
	for (var i=0;i<array.length;i+=3)
	{
		if (array[i+axis]>max){max=array[i+axis]}
	}
	return max
}


var OBJLoader2Example = (function () {
	var Validator = THREE.LoaderSupport.Validator;
	function OBJLoader2Example( elementToBindTo ) {
		this.renderer = null;
		this.canvas = elementToBindTo;
		this.aspectRatio = 1;
		this.recalcAspectRatio();
		this.scene = null;
		this.cameraDefaults = {
			posCamera: new THREE.Vector3( -1200.0, 500.0, .0 ),
			posCameraTarget: new THREE.Vector3( 0, 0, 0 ),
			near: 0.1,
			far: 10000,
			fov: 45
		};
		this.camera = null;
		this.cameraTarget = this.cameraDefaults.posCameraTarget;
		this.controls = null;
	}
	OBJLoader2Example.prototype.initGL = function () {
		this.renderer = new THREE.WebGLRenderer( {
			canvas: this.canvas,
			antialias: false,
			autoClear: true
		} );
		this.renderer.setClearColor( 0x050505 );
		texture = new THREE.TextureLoader().load( texture_water );
		this.scene = new THREE.Scene();
		this.scene.background=texture
		this.camera = new THREE.PerspectiveCamera( this.cameraDefaults.fov, this.aspectRatio, this.cameraDefaults.near, this.cameraDefaults.far );
		this.resetCamera();
		this.controls = new THREE.TrackballControls( this.camera, this.renderer.domElement );
		var ambientLight = new THREE.AmbientLight( 0x404040 );
		var directionalLight1 = new THREE.DirectionalLight( 0xC0C090 );
		var directionalLight2 = new THREE.DirectionalLight( 0xC0C090 );
		directionalLight1.position.set( -100, -50, 100 );
		directionalLight2.position.set( 100, 50, -100 );
		this.scene.add( directionalLight1 );
		this.scene.add( directionalLight2 );
		this.scene.add( ambientLight );
		var helper = new THREE.GridHelper( map_size*2, 60, 0xFF4444, 0x404040 );
		helper.visible=false
		this.scene.add( helper );
		
	};
	OBJLoader2Example.prototype.initContent = function () {
		var modelName = 'female02';
		this._reportProgress( { detail: { text: 'Loading: ' + modelName } } );
		var scope = this;
		var objLoader = new THREE.OBJLoader2();
		var callbackOnLoad = function ( event ) {
			scope.scene.add( event.detail.loaderRootNode );
			console.log( 'Loading complete: ' + event.detail.modelName );
			scope._reportProgress( { detail: { text: '' } } );

			// rotate the fish at the beginning 
			app.scene.children[4].children[0].geometry.rotateY(-3.14/2);
			app.scene.children[4].children[0].geometry.rotateX(3.14/2);
			var positions=app.scene.children[4].children[0].geometry.attributes.position.array

			// compute the width of the fish
			min_fish_z=min_array(positions,2)
			max_fish_z=max_array(positions,2)
			fish_width=max_fish_z-min_fish_z
			console.log("width of the fish",fish_width)

			// modify the position of the fish in order to center it
			for(var i=0;i<positions.length-3;i+=3)
			{
				positions[i]+=30
				positions[i+1]+=100
				positions[i+2]-=10
			}
			
			// create the two extreme position for the fin
			// positions_start is the position when the fin is at the extreme left
			// positions_end is the position when the fin is at the extreme right
			for(var i=0;i<positions.length-3;i+=3)
			{
				positions[i]+=0.5e-3*positions[i+2]**2
				// positions[i]-=0.7e-3*positions[i+2]**2
				positions_end.push(positions[i]-1.5e-3*positions[i+2]**2)
				// positions_end.push(-positions[i])
				positions_end.push(positions[i+1])
				positions_end.push(positions[i+2])
			}
			positions_start=positions.slice()
			// add the sand to the floor
			sand();
			// add the cube for feeding the fish at the beginning
			add_cube();
			
		};
		var onLoadMtl = function ( materials ) {
			objLoader.setModelName( modelName );
			objLoader.setMaterials( materials );
			objLoader.setLogging( true, true );
			
			objLoader.load( obj_file, callbackOnLoad, null, null, null, false );
			console.log(app.scene.children[4])
		};
		objLoader.loadMtl( mtl_file, null, onLoadMtl );
	};
	OBJLoader2Example.prototype._reportProgress = function( event ) {
		var output = Validator.verifyInput( event.detail.text, '' );
	};
	OBJLoader2Example.prototype.resizeDisplayGL = function () {
		this.controls.handleResize();
		this.recalcAspectRatio();
		this.renderer.setSize( this.canvas.offsetWidth, this.canvas.offsetHeight, false );
		this.updateCamera();
	};
	OBJLoader2Example.prototype.recalcAspectRatio = function () {
		this.aspectRatio = ( this.canvas.offsetHeight === 0 ) ? 1 : this.canvas.offsetWidth / this.canvas.offsetHeight;
	};
	OBJLoader2Example.prototype.resetCamera = function () {
		this.camera.position.copy( this.cameraDefaults.posCamera );
		this.cameraTarget.copy( this.cameraDefaults.posCameraTarget );
		this.updateCamera();
	};
	OBJLoader2Example.prototype.updateCamera = function () {
		this.camera.aspect = this.aspectRatio;
		this.camera.lookAt( this.cameraTarget );
		this.camera.updateProjectionMatrix();
	};

	OBJLoader2Example.prototype.render = function () {
		if ( ! this.renderer.autoClear ) this.renderer.clear();
		this.controls.update();
		// if the fish isn't alive then we return false
		if (!is_alive())
		{
			document.getElementById("score").text="You lost"
			return false
		}
		// we move the fin at each time
		move_fin();
		
		// we translate the fish by the z axis
		app.scene.children[4].children[0].translateZ(-speed);

		// if the head of the fish is close from a cube, then we consider the fish ate it
		if (Math.abs(get_world_position_fish().x-app.scene.children[6].position.x)<eps_proximity_food && 
		Math.abs(get_world_position_fish().z-app.scene.children[6].position.z)<eps_proximity_food)
		{
			// we remove the cube the fish ate
			app.scene.remove(app.scene.children[6])
			// we increase the speed of the fish after
			app.scene.children[4].children[0].scale.z+=speed_step
			// we add another cube 
			add_cube();
			level+=1
			// we increase the speed and the angular speed
			speed+=speed_step
			angle_speed+=speed_step
			// we display the score
			document.getElementById("score").text=level.toString()
		}

		app.scene.children[4].children[0].geometry.attributes.position.needsUpdate = true;
		this.renderer.render( this.scene, this.camera );
		return true;
	};
	return OBJLoader2Example;
})();
var app = new OBJLoader2Example( document.getElementById( 'example' ) );
var resizeWindow = function () {
	app.resizeDisplayGL();
};
var render = function () {
	
	requestAnimationFrame( render );
	lala=app.render();
	if (!lala)
	{
		return 
	}
};
window.addEventListener( 'resize', resizeWindow, false );
console.log( 'Starting initialisation phase...' );
app.initGL();
app.resizeDisplayGL();
app.initContent();
render();
