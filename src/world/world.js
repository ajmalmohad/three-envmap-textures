import * as THREE from 'three';
import gsap from 'gsap';
import * as dat from 'dat.gui';
import { camera, scene, renderer, orbit, scrinit, resize } from './utilities/scr';
import textureColor from './../images/textures/Door_Wood_001_basecolor.jpg';
import textureAlpha from './../images/textures/Door_Wood_001_opacity.jpg';
import textureRoughness from './../images/textures/Door_Wood_001_roughness.jpg';
import textureNormal from './../images/textures/Door_Wood_001_normal.jpg';
import textureHeight from './../images/textures/Door_Wood_001_height.png';
import textureMetalness from './../images/textures/Door_Wood_001_metallic.jpg';
import textureAmbient from './../images/textures/Door_Wood_001_ambientOcclusion.jpg';
import matCap1 from './../images/matcaps/3.png';
import gradient1 from './../images/gradients/5.jpg';
import nx from './../images/environmentMaps/3/nx.jpg';
import ny from './../images/environmentMaps/3/ny.jpg';
import nz from './../images/environmentMaps/3/nz.jpg';
import px from './../images/environmentMaps/3/px.jpg';
import py from './../images/environmentMaps/3/py.jpg';
import pz from './../images/environmentMaps/3/pz.jpg';

let cube, clock, cursor,geometry,material,sphere,torus,plane;

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const cubetextureLoader = new THREE.CubeTextureLoader(loadingManager);

const environmentMapTexture = cubetextureLoader.load(
	[px,nx,py,ny,pz,nz]
)

const colorTexture = textureLoader.load(textureColor);
const alphaTexture = textureLoader.load(textureAlpha);
const roughnessTexture = textureLoader.load(textureRoughness);
const normalTexture = textureLoader.load(textureNormal);
const heightTexture = textureLoader.load(textureHeight);
const metalnessTexture = textureLoader.load(textureMetalness);
const ambientOcculsionTexture = textureLoader.load(textureAmbient);
const matCapTexture = textureLoader.load(matCap1);
const gradientTexture = textureLoader.load(gradient1);

init();
animate();

function init() {
	//Init Scene Camera Renderer with orbit controls.
	scrinit("controls");

	//Clock
	clock = new THREE.Clock();

	//Cursor
	cursor = { x: 0, y: 0 }

	//GUI
	const gui = new dat.GUI()


	//Material

	// material = new THREE.MeshBasicMaterial({
	// 	side: THREE.DoubleSide,
	// 	transparent:true
	// });
	// material.map = colorTexture;
	// material.alphaMap = alphaTexture;

	// material = new THREE.MeshNormalMaterial({
	// 	side: THREE.DoubleSide,
	// });

	// material = new THREE.MeshMatcapMaterial({
	// 	side: THREE.DoubleSide,
	// });
	// material.matcap = matCapTexture;

	// material = new THREE.MeshDepthMaterial()

	// material = new THREE.MeshPhongMaterial()
	// material.shininess = 100;
	// material.specular = new THREE.Color(0xff0000)

	// material = new THREE.MeshToonMaterial()
	// material.gradientMap = gradientTexture
	// gradientTexture.minFilter = THREE.NearestFilter;
	// gradientTexture.magFilter = THREE.NearestFilter;
	// gradientTexture.generateMipmaps =  false;

	material = new THREE.MeshStandardMaterial({
		transparent:true,
		side:THREE.DoubleSide
	});
	material.metalness =0.7;
	material.roughness= 0.2;
	// material.map = colorTexture;
	// material.aoMap = ambientOcculsionTexture;
	// material.aoMapIntensity = 1;
	// material.displacementMap = heightTexture;
	// material.displacementScale = 0.05;
	// material.metalnessMap = metalnessTexture;
	// material.roughnessMap = roughnessTexture;
	// material.normalMap = normalTexture;
	// material.normalScale.set(0.5,0.5);
	// material.alphaMap = alphaTexture;
	material.envMap = environmentMapTexture;

	gui.add(material,'metalness').min(0).max(1).step(0.0001)
	gui.add(material,'roughness').min(0).max(1).step(0.0001)
	gui.add(material,'aoMapIntensity').min(0).max(5).step(0.0001)
	gui.add(material,'displacementScale').min(0).max(0.5).step(0.0001)
	// gui.add(turn,'false');

	//Material

	//Lights


	const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight)

	const pointLight = new THREE.PointLight(0xffffff, 0.5);
	pointLight.position.set(2,3,4);
	scene.add(pointLight)


	//Lights



	torus = new THREE.Mesh(
		new THREE.TorusBufferGeometry(0.4,0.2,64,128),
		material
	)
	sphere = new THREE.Mesh(
		new THREE.SphereBufferGeometry(0.5,64,64),
		material
	)
	plane = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(1,1,100,100),
		material,
	)
	scene.add(sphere, plane, torus );


	sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array,2));
	plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2));
	torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array,2));

	torus.position.x = -2;
	plane.position.x = 2;
}

function animate() {
	const elapsedTime = clock.getElapsedTime();
	orbit.update();

	sphere.rotation.x = elapsedTime*0.2;
	torus.rotation.x = elapsedTime*0.2;
	plane.rotation.x = elapsedTime*0.2;

	sphere.rotation.y = elapsedTime*0.25;
	torus.rotation.y = elapsedTime*0.25;
	plane.rotation.y = elapsedTime*0.25;

	//All Logic above this
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

function handleMousemove(e) {
	cursor.x = e.clientX / window.innerWidth - 0.5;
	cursor.y = -(e.clientY / window.innerHeight - 0.5);
}

function fullScreenhandler() {
	if (document.fullscreenElement) {
		document.exitFullscreen();
	} else {
		document.body.requestFullscreen();
	}
}

//Event Listeners
window.addEventListener('resize', resize);
window.addEventListener('mousemove', handleMousemove);
window.addEventListener('dblclick', fullScreenhandler);
