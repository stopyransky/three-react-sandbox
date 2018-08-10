    uniform vec2 u_resolution;
    
    attribute vec2 position;
    attribute vec3 color;
    attribute float pointSize;
    
    varying vec3 fragColor;

    vec2 normalizeCoords(vec2 vector) {
      return vec2(2.0, -2.0) * ((vector / u_resolution) - vec2(0.5, 0.5));
    }

    void main() {
      fragColor = vec3(color);
      gl_PointSize = pointSize;
      gl_Position = vec4(normalizeCoords(position), 0.0, 1.0);
    }
