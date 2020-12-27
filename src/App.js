'use strict';

import { useEffect, useRef } from "react";

const glsl = `
const vec4 bitEnc = vec4(1.,255.,65025.,16581375.);
const vec4 bitDec = 1./bitEnc;
vec4 EncodeFloatRGBA (float v) {
    vec4 enc = bitEnc * v;
    enc = fract(enc);
    enc -= enc.yzww * vec2(1./255., 0.).xxxy;
    return enc;
}

float DecodeFloatRGBA (vec4 v) {
    return dot(v, bitDec);
}


float shift_right (float v, float amt) { 
  v = floor(v) + 0.5; 
  return floor(v / exp2(amt)); 
}
float shift_left (float v, float amt) { 
  return floor(v * exp2(amt) + 0.5); 
}
float mask_last (float v, float bits) { 
  return mod(v, shift_left(1.0, bits)); 
}
float extract_bits (float num, float from, float to) { 
  from = floor(from + 0.5); to = floor(to + 0.5); 
  return mask_last(shift_right(num, from), to - from); 
}
vec4 encode_float (float val) { 
  if (val == 0.0) return vec4(0, 0, 0, 0); 
  float sign = val > 0.0 ? 0.0 : 1.0; 
  val = abs(val); 
  float exponent = floor(log2(val)); 
  float biased_exponent = exponent + 127.0; 
  float fraction = ((val / exp2(exponent)) - 1.0) * 8388608.0; 
  float t = biased_exponent / 2.0; 
  float last_bit_of_biased_exponent = fract(t) * 2.0; 
  float remaining_bits_of_biased_exponent = floor(t); 
  float byte4 = extract_bits(fraction, 0.0, 8.0) / 255.0; 
  float byte3 = extract_bits(fraction, 8.0, 16.0) / 255.0; 
  float byte2 = (last_bit_of_biased_exponent * 128.0 + extract_bits(fraction, 16.0, 23.0)) / 255.0; 
  float byte1 = (sign * 128.0 + remaining_bits_of_biased_exponent) / 255.0; 
  return vec4(byte4, byte3, byte2, byte1); 
}
`

function range(n) {
  return [...Array(n).keys()];
}

function batch(n, arr) {
  const l = arr.length;
  return range(l/n)
    .map(x=> arr.slice(n*x, n*(x+1)));
}

function toGreyScale(arr) {
  return batch(4, arr).map(chunk => {
    const [r,g,b] = [...chunk];
    return r;
  });
}

function toRGBAScale(arr) {
  return batch(4, arr).map(chunk => {
    const [r,g,b,a] = [...chunk];
    return {r,g,b,a};
  });
}

function toGreyScaleMatrix(w, arr) {
  return batch(w, toGreyScale(arr));
}

async function fetchImage(url) {
  const image = new Image();
  image.src = url;
  document.body.append(image);  
  return new Promise((done, reject) => {
    image.onerror = reject;
    image.onload = done;
  }).then(()=>image);
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
async function loadImage(gl, image) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be downloaded over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(gl.TEXTURE_2D,  0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);    
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}



function image(name, image) {
  return {
    type: 'image',
    name,
    image
  }
}

export function uniform1f(name, value) {
  return {
    type: "uniform1f",
    name,
    value
  };
}

export function array2D(name, [w, h], data) {
  return {
    type: "array2D",
    name,
    w, 
    h,
    data
  };
}

function output(type, [w, h]) {
  return {
    type, //uint8|int32|float32
    w, h,
  };
}

function program([vs, fs], result, variables) {
  return {
    vs, 
    fs,
    result,
    variables
  }
}


function bindProgram(gl, [vs, fs]) {
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vertexShader, vs);
  gl.shaderSource(fragmentShader, fs);
  gl.compileShader(vertexShader);

  console.log(gl.getShaderInfoLog(vertexShader));  
  
  gl.compileShader(fragmentShader);
  
  console.log(gl.getShaderInfoLog(fragmentShader));  
  
  var p = gl.createProgram();
  gl.attachShader(p, vertexShader);
  gl.attachShader(p, fragmentShader);
  gl.linkProgram(p);
  gl.useProgram(p);

  return p;
}

async function createProgram(canvas, {result, vs, fs, variables}) {
  canvas.width = result.w;
  canvas.height = result.h;

  const gl = canvas.getContext('webgl2');

  const program = bindProgram(gl, [vs, fs]);
  const positionLoc = gl.getAttribLocation(program, 'position');

  bindPosition(gl, positionLoc);
  let i = 0;
  for (const tex of variables) {
    switch (tex.type) {
      case 'uniform1f':
        bindUniform(gl, program, tex);
        continue;
      case 'array2D':
        await bindArray2D(gl, program, tex, i);
        continue;
      case 'image':
        await bindImage(gl, program, tex, i);
        ++i;
        continue;
    }
  }

  return {gl, program};
}

function bindPosition (gl, position) {
  // setup a full canvas clip space quad
  var points = gl.createBuffer(gl.ARRAY_BUFFER);
  gl.bindBuffer(gl.ARRAY_BUFFER, points);
  gl.bufferData(
    gl.ARRAY_BUFFER, 
    new Float32Array([
      -1, 1, 
      1, 1, 
      1, -1,
      -1, -1,
    ]), 
    gl.STATIC_DRAW);
  ;
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
}

function bindUniform(gl, program, {name, value}){
  const uniformLoc = gl.getUniformLocation(program, name);
  gl.uniform1f(uniformLoc, value);  // tell the shader the src texture is on texture unit 0
}

function bindArray2D(gl, program, {name, data, w, h}, id){
  const tex = gl.createTexture();
  const uniformLoc = gl.getUniformLocation(program, name);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  console.log({data})
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1); // see https://webgl2fundamentals.org/webgl/lessons/webgl-data-textures.html
  gl.texImage2D(
      gl.TEXTURE_2D,
      0,                // mip level
      gl.RGBA8,         // internal format
      w,
      h,
      0,                // border
      gl.RGBA,          // format
      gl.UNSIGNED_BYTE, // type
      data
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.uniform1i(uniformLoc, id);  // tell the shader the src texture is on texture unit 0
}

async function bindImage(gl, program, {name, image}, id) {
  gl.activeTexture(gl.TEXTURE0 + id);
  const texture = await loadImage(gl, image);
  console.log(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS, gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
  gl.bindTexture(gl.TEXTURE_2D, texture);
  const uniformLoc = gl.getUniformLocation(program, name);
  console.log(name, id)
  gl.uniform1i(uniformLoc, id);
}


async function run(canvas, prog) {
  const {gl} = await createProgram(canvas, prog);
  const {result} = prog;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);  

  return () => {
    const data = new Uint8Array(result.w * result.h * 4);
    gl.readPixels(0, 0, result.w, result.h, gl.RGBA, gl.UNSIGNED_BYTE, data);

    switch (result.type) {
      default:
      case 'uint8':
        return data;
      case 'float32':
        return new Float32Array(data.buffer)
      case 'int32':
        return new Int32Array(data.buffer)
    }
  }
}


const vs = `
  #version 300 es
  in vec4 position;
  void main() {
    gl_Position = position;
  }
`.trim();

const fs = `
  #version 300 es
  precision mediump float;

  float greyScale(vec3 x) {
    return dot(x, vec3( 0.2125, 0.7154, 0.0721 ));
  }

  int bucketOf(vec3 x, vec3 y) {
    float a = greyScale(x);
    float b = greyScale(y);
    int low = int(floor(a * 7.0));
    int high = int(floor(b * 7.0)) << 3;
    return low | high;
  }

  float entropyOf(int count, int total) {
    if (count == 0) {
      return 0.0;
    } else {
      float p = float(count) / (float(total));
      return -p*log(p);
    }
  }

  uniform float sp_width;
  uniform float sp_height;

  uniform float m_width;
  uniform float m_height;

  uniform sampler2D fixedTex;
  uniform sampler2D movingTex;


  out vec4 result;


  void main() {

    ivec2 offset = ivec2(
      gl_FragCoord.x,
      sp_height - gl_FragCoord.y
    );

    int buckets[64];
    for (int i = 0; i < 64; ++i) {
      buckets[i] = 0;
    }

    for (int i = 0; i < int(m_width); ++i) {
      for (int j = 0; j < int(m_height); ++j) {
        ivec2 uv = ivec2(i, j);
        vec3 fixedImg = texelFetch(fixedTex,  offset+uv, 0).rgb;
        vec3 movingImg = texelFetch(movingTex, uv, 0).rgb;
        int bucketId = bucketOf(fixedImg, movingImg);
        buckets[bucketId] += 1;
      }
    } 

    int total = 0;
    for (int i = 0; i < 64; ++i) {
      total += buckets[i];
    }


    float entropy  = 0.0;
    for (int i = 0; i < 64; ++i) {
      entropy += entropyOf(buckets[i], total);
    }

    vec3 color=vec3(entropy*0.2);


    result = vec4(color, 1);
  }
`.trim();


function SearchSpace({
  fixedUrl = 'butterfly2.jpg', 
  movingUrl = 'butterfly3.jpg'
}) {
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const fixedImageRef = useRef(null);
  const movingImageRef = useRef(null);

  useEffect(()=>{
    setTimeout(async () => {

      const [fixed, moving] = [
        fixedImageRef.current,
        movingImageRef.current
      ];

      await new Promise(done => setTimeout(done, 300));
      
      const searchSpace = [
        fixed.width - moving.width,
        fixed.height - moving.height,
      ];

      let prog = program(
        [vs, fs],
        output(
          'uint8', 
          searchSpace
        ), 
        [
          uniform1f("sp_width", searchSpace[0]),
          uniform1f("sp_height", searchSpace[1]),
          uniform1f("m_width", moving.width),
          uniform1f("m_height", moving.height),
          image("fixedTex", fixed),
          image("movingTex", moving)
        ]
      )



      const canvas = canvasRef.current;
      const start = Date.now();
      const getResult = await run(canvas, prog);
      const end = Date.now();
      const result =  getResult();
      const readEnd = Date.now();

      const time = end - start;
      const uploadTime = readEnd - end;
      const iterations = searchSpace[0]*searchSpace[1];
      const pixelsCompared = iterations * fixed.width * fixed.height;
      console.log({
        time,
        uploadTime,
        searchSpace,
        fixed: [fixed.width, fixed.height],
        moving: [moving.width, moving.height],
        iterations,
        pixelsCompared,
        itersPerSecond: iterations/time*1000,
        pixelsPerSecond: pixelsCompared/time*1000,
      })


      const matrix = toGreyScaleMatrix(searchSpace[0], result);
      const data = matrix
        .flatMap( (row, y) => 
          row.map( (value, x) => ({value, y, x})))
        .sort((a, b) => a.value - b.value);


      console.log({topResults5: data.slice(0,5)});


      // overlayCanvasRef.current.width = fixed.width;
      // overlayCanvasRef.current.height = fixed.height;
      // const ctx = overlayCanvasRef.current.getContext('2d');

      // ctx.drawImage(fixed, 0, 0);
      // ctx.drawImage(moving, data[0].x, data[0].y);

    }, 0);
  }, [fixedUrl, movingUrl]);

  return (
    <div>
      <div style={{display:'flex'}} >
        <div>
          <h2>Fixed Image (haystack)</h2>
          <img src={fixedUrl} ref={fixedImageRef} />
        </div>
        <div>
          <h2>Moving Image (needle)</h2>
          <img src={movingUrl} ref={movingImageRef} />
        </div>
        <div>
          <h2>SearchSpace (darker is better) </h2>
          <canvas ref={canvasRef} />
        </div>
        {/*<canvas ref={overlayCanvasRef} />*/}
        
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div>
      <h1> Image Alignment with WebGL </h1>
      <div>
        Goal: find "moving image" inside "fixed image".<br/>

        SearchSpace visualization shows how good the images are aligned at each x-y coordinate.
        Darker is better.<br/>

        Open console for performance metrics and results (ctrl+shift+i)
      </div>
      <SearchSpace fixedUrl="butterfly2.jpg" movingUrl="butterfly3.jpg" />
      <SearchSpace fixedUrl="butterfly2.jpg" movingUrl="butterfly4.jpg" />
      <SearchSpace fixedUrl="butterfly2.jpg" movingUrl="butterfly5.jpg" />
    </div>
  );  
}