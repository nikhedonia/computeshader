import React from 'react';

const vertexShader = `
precision highp float;
attribute vec2 pos;
void main() {
  gl_Position = vec4(pos.x, pos.y, 0.0, 1.0);
}
`

const  fragmentShader = `
precision highp float;

uniform vec2 u_zoomCenter;
uniform float u_zoomSize;
uniform float t;
uniform int u_maxIterations;

vec2 f(vec2 x, vec2 c) {
  mat2 m = mat2(
    x.x, x.y - x.x*t, 
    -x.y, x.x + t*x.y*x.y/(x.x>0.0?x.x:1.0)
  );
  return m * x + c;
}
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b*cos( 6.28318*(c*t+d) );
}
void main() {
  vec2 uv = gl_FragCoord.xy / vec2(800.0, 800.0);
  vec2 c = u_zoomCenter + (uv * 4.0 - vec2(2.0)) * (u_zoomSize / 4.0);
  vec2 x = vec2(0.0);
  bool escaped = false;
  int iterations = 0;    
  
  for (int i = 0; i < 1200; i++) {
    if (i > u_maxIterations) break;
    iterations = i;
    x = f(x, c);
    if (length(x) > 2.0) {
      escaped = true;
      break;
    }
  }

  gl_FragColor = 
    escaped
      ? vec4(
        palette(float(iterations)/float(u_maxIterations), 
        vec3(0.0),vec3(0.59,0.55,0.75),
        vec3(0.1, 0.2, 0.3),vec3(0.75)),
        1.0
      ) 
      : vec4(vec3(0.85, 0.99, 1.0), 1.0);
}
`;



function main(canvas) {

  
  var gl = canvas.getContext("webgl");


  /* compile and link shaders */
  var vertex_shader = gl.createShader(gl.VERTEX_SHADER);
  var fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vertex_shader, vertexShader);
  gl.shaderSource(fragment_shader, fragmentShader);
  gl.compileShader(vertex_shader);

  console.log(gl.getShaderInfoLog(vertex_shader));  
  
  gl.compileShader(fragment_shader);
  
  console.log(gl.getShaderInfoLog(fragment_shader));  
  
  var mandelbrot_program = gl.createProgram();
  gl.attachShader(mandelbrot_program, vertex_shader);
  gl.attachShader(mandelbrot_program, fragment_shader);
  gl.linkProgram(mandelbrot_program);
  gl.useProgram(mandelbrot_program);

  /* create a vertex buffer for a full-screen triangle */
  var vertex_buf = gl.createBuffer(gl.ARRAY_BUFFER);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buf);
  gl.bufferData(
    gl.ARRAY_BUFFER, 
    new Float32Array([
      -1, 1, 
      1, 1, 
      1, -1,
      -1, -1
    ]), 
    gl.STATIC_DRAW);
  
  /* set up the position attribute */
  var position_attrib_location = gl.getAttribLocation(mandelbrot_program, "pos");
  gl.enableVertexAttribArray(position_attrib_location);
  gl.vertexAttribPointer(position_attrib_location, 2, gl.FLOAT, false, 0, 0);

  /* find uniform locations */
  var zoom_center_uniform = gl.getUniformLocation(mandelbrot_program, "u_zoomCenter");
  var zoom_size_uniform = gl.getUniformLocation(mandelbrot_program, "u_zoomSize");
  var max_iterations_uniform = gl.getUniformLocation(mandelbrot_program, "u_maxIterations");
  var t_uniform = gl.getUniformLocation(mandelbrot_program, "t");
  gl.uniform1f(t_uniform, 0.0);
  
  /* these hold the state of zoom operation */
  var zoom_center = [0.0, 0.0];
  var zoom_size = 4.0;
  var max_iterations = 500;
    
  var renderFrame = function () {
    /* bind inputs & render frame */
    gl.uniform2f(zoom_center_uniform, zoom_center[0], zoom_center[1]);
    gl.uniform1f(zoom_size_uniform, zoom_size);
    gl.uniform1i(max_iterations_uniform, max_iterations);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    console.log("draw");
  }

  setTimeout(renderFrame);
  let i = 0;
  setInterval(()=>{
    i++;

    gl.uniform1f(t_uniform, Math.sin(i*0.03) * Math.sin(i*0.03) );
    renderFrame();
  }, 33)
}
   

function App () {
  React.useEffect(()=>{
    setTimeout( () => {
      try {
        const canvas = document.querySelector('#webgl');
        console.log(canvas);
        main(canvas);
      } catch (e) {
        console.log(e);
      }
    }, 10);
  })
  
  return (
    <div className="App">
      <canvas id="webgl" width="800px" height="800px"/>
    </div>
  );
}


export default App