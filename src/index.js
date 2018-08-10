import * as d3 from 'd3';
import * as vertexShader from './shaders/vertex.glsl';
import * as fragmentShader from './shaders/fragment.glsl';

var regl = require('regl')();

const width = window.innerWidth;
const height = window.innerHeight;

const points = d3.range(5000).map(() => ({
  x: Math.random() * width,
  y: Math.random() * height,
  color: [0, Math.random(), 0],
  pointSize: Math.random() * 6 + 2
}));

const draw = regl({
  vert: vertexShader,
  frag: fragmentShader,
  attributes: {
    position: points.map(p => [p.x, p.y]),
    color: points.map(p => p.color),
    pointSize: points.map(p => p.pointSize)
  },
  uniforms: {
    u_resolution: regl.prop('u_resolution')
  },
  count: points.length,
  primitive: 'points'
});

regl.frame(()=> {

  regl.clear({ color: [0.1, 0.1, 0.1, 1]});

  draw({
    u_resolution: [width, height]
  });

});
