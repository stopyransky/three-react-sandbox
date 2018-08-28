import THREE from '../three';

export function makeTextSprite(message, opts) {
  const parameters = opts || {};
  const fontFace = parameters.fontFace || 'Arial';
  const fontSize = parameters.fontSize || 36;

  let canvas = document.createElement('canvas');
  
  let context = canvas.getContext('2d');
  
  context.font = fontSize + 'px ' + fontFace;
  context.textAlign = 'center';
  
  // context.strokeStyle = 'rgba(255, 0, 0, 1.0)';
  // context.strokeRect(0, 0, canvas.width, canvas.height);
  // context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'rgba(255, 255, 255, 1.0)';
  // context.fillStyle('white');
  context.fillText(message, canvas.width/2, canvas.height/2, canvas.width);

  // canvas contents will be used for a texture
  const texture = new THREE.CanvasTexture(canvas);
  // texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    useScreenCoordinates: false
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  
  sprite.scale.set(0.3, 0.3, 1.0);
  // sprite.translate(0.2, 1);
  return sprite;
}
