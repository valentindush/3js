import  * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


//Import some images

import nebula from '../img/nebula.jpg'
import stars from '../img/stars.jpg'

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled  = true
// renderer.setClearColor(0xFFAE00)

document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

const orbit = new OrbitControls(camera, renderer.domElement)

//grid
const grid = new THREE.GridHelper(50)
scene.add(grid)

camera.position.set(-10,30,30)
orbit.update()


//dat 

const gui = new dat.GUI()




// Create a cube

const geometry = new THREE.BoxGeometry(2,2,2)
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00FF00 })
const cube = new THREE.Mesh(geometry, boxMaterial)
scene.add(cube)

cube.receiveShadow = true
cube.castShadow = true

const planeGeometry = new THREE.PlaneGeometry(50,50)
const planeMesh = new THREE.MeshStandardMaterial({ 
    color: 0xFFFFFF,
    side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry, planeMesh)
plane.receiveShadow = true
scene.add(plane)

plane.rotation.x = -Math.PI / 2

cube.rotation.x = 2
cube.rotation.y = 2


//Sphere

const sphereGeometry  = new THREE.SphereGeometry(4, 40, 40)
const sphereMaterial = new THREE.MeshStandardMaterial({color: 0x00EE,})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)

sphere.castShadow = true

sphere.position.y = 10

const options = {
    sphereColor: "#ffea00",
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1

}



gui.add(options, 'wireframe').onChange((e)=>{
    sphere.material.wireframe = e
})

gui.add(options, 'speed', 0 , 0.1)
gui.add(options, 'penumbra', 0 , 1)
gui.add(options, 'angle', 0 , 0.3)
gui.add(options, 'intensity', 0 , 1)

gui.addColor(options, 'sphereColor').onChange((e)=>{
    sphere.material.color.set(e)
})


// const ambientLight = new THREE.AmbientLight(0xFFFfff)
// scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1)
// scene.add(directionalLight)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 2)
// scene.add(directionalLightHelper)
// directionalLight.shadow.camera.top = 10

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(dLightShadowHelper)

// directionalLight.castShadow = true

// directionalLight.position.set(10, 20, 0)


//Spotlight Light

const spotLight = new THREE.SpotLight(0xFFFFFF)
scene.add(spotLight)
spotLight.position.set(-100, 100, 0)

const sLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(sLightHelper)
spotLight.castShadow = true
spotLight.angle = 0.3

//FOG

// scene.fog = new THREE.Fog(0xFFFFFF, 0, 20)
// scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01)

const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

let step = 0

const animate = (time)=>{
    cube.rotation.x = time / 1000
    cube.rotation.y = time / 1000

    step += options.speed
    sphere.position.y = 10 * Math.abs(Math.sin(step))

    spotLight.angle = options.angle,
    spotLight.penumbra = options.penumbra,
    spotLight.intensity = options.intensity

    sLightHelper.update()

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)


//Textures

const texttureLoader = new THREE.TextureLoader()
// scene.background = texttureLoader.load(stars)
const cubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoader.load([
    nebula,
    nebula,
    nebula,
    nebula,
    stars,
    stars,
])

const cube2Geometry = new THREE.BoxGeometry(4,4,4)
const cube2Material = new THREE.MeshBasicMaterial({
    color: 0xFFEA00,
    map: texttureLoader.load(nebula)
})

const cube2Mulitmateral = [
    new THREE.MeshBasicMaterial({map: texttureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map: texttureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map: texttureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: texttureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map: texttureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: texttureLoader.load(nebula)}),
]

const cube2 = new THREE.Mesh(cube2Geometry, cube2Mulitmateral)
scene.add(cube2)

cube2.position.set(0, 15,10)


//Make the canvas responsive

window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})