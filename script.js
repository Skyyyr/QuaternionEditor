document.addEventListener("DOMContentLoaded", function() {
  const canvasContainer = document.getElementById('canvas-container');
  const rotateX = document.getElementById('rotateX');
  const rotateY = document.getElementById('rotateY');
  const rotateZ = document.getElementById('rotateZ');
  const rotateXInput = document.getElementById('rotateX-input');
  const rotateYInput = document.getElementById('rotateY-input');
  const rotateZInput = document.getElementById('rotateZ-input');
  const calculateBtn = document.getElementById('calculate');
  const quaternionOutput = document.getElementById('quaternion-output');

  // Initialize Three.js scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
  canvasContainer.appendChild(renderer.domElement);

  // Create a cube with different colors on each face
  const geometry = new THREE.BoxGeometry();
  const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Right
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Left
    new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Top
    new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Bottom
    new THREE.MeshBasicMaterial({ color: 0x00ffff }), // Front
    new THREE.MeshBasicMaterial({ color: 0xff00ff })  // Back
  ];
  const cube = new THREE.Mesh(geometry, materials);
  scene.add(cube);

  // Add text labels to each face of the cube
  const loader = new THREE.FontLoader();
  loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const options = {
      font: font,
      size: 0.2,
      height: 0.02,
    };

    const createTextMesh = (text) => {
      const textGeometry = new THREE.TextGeometry(text, options);
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      // Center the text
      textGeometry.computeBoundingBox();
      const centerOffsetX = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
      const centerOffsetY = -0.5 * (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y);
      textMesh.position.set(centerOffsetX, centerOffsetY, 0);

      return textMesh;
    };

    const textRight = createTextMesh('Right');
    textRight.position.set(0.5, 0, 0);
    textRight.rotation.y = Math.PI / 2;
    cube.add(textRight);

    const textLeft = createTextMesh('Left');
    textLeft.position.set(-0.5, 0, 0);
    textLeft.rotation.y = -Math.PI / 2;
    cube.add(textLeft);

    const textTop = createTextMesh('Top');
    textTop.position.set(0, 0.5, 0);
    textTop.rotation.x = -Math.PI / 2;
    cube.add(textTop);

    const textBottom = createTextMesh('Bottom');
    textBottom.position.set(0, -0.5, 0);
    textBottom.rotation.x = Math.PI / 2;
    cube.add(textBottom);

    const textFront = createTextMesh('Front');
    textFront.position.set(0, 0, 0.5);
    cube.add(textFront);

    const textBack = createTextMesh('Back');
    textBack.position.set(0, 0, -0.5);
    textBack.rotation.y = Math.PI;
    cube.add(textBack);
  });

  // Create axis helpers
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  camera.position.z = 5;

  function updateCubeRotation() {
    const x = THREE.Math.degToRad(rotateX.value);
    const y = THREE.Math.degToRad(rotateY.value);
    const z = THREE.Math.degToRad(rotateZ.value);

    cube.rotation.set(x, y, z);
    renderer.render(scene, camera);
  }

  function calculateQuaternion() {
    const x = THREE.Math.degToRad(rotateX.value);
    const y = THREE.Math.degToRad(rotateY.value);
    const z = THREE.Math.degToRad(rotateZ.value);

    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(new THREE.Euler(x, y, z, 'XYZ'));

    quaternionOutput.textContent = `x: ${quaternion.x.toFixed(4)}, y: ${quaternion.y.toFixed(4)}, z: ${quaternion.z.toFixed(4)}, w: ${quaternion.w.toFixed(4)}`;
  }

  function syncInputs(slider, input) {
    input.value = slider.value;
    updateCubeRotation();
  }

  function syncSliders(input, slider) {
    slider.value = input.value;
    updateCubeRotation();
  }

  rotateX.addEventListener('input', () => syncInputs(rotateX, rotateXInput));
  rotateY.addEventListener('input', () => syncInputs(rotateY, rotateYInput));
  rotateZ.addEventListener('input', () => syncInputs(rotateZ, rotateZInput));

  rotateXInput.addEventListener('input', () => syncSliders(rotateXInput, rotateX));
  rotateYInput.addEventListener('input', () => syncSliders(rotateYInput, rotateY));
  rotateZInput.addEventListener('input', () => syncSliders(rotateZInput, rotateZ));

  calculateBtn.addEventListener('click', calculateQuaternion);

  // Initial render
  renderer.render(scene, camera);
});
