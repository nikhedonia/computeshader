(this.webpackJsonpcomputeshader=this.webpackJsonpcomputeshader||[]).push([[0],{16:function(e,t,n){},18:function(e,t,n){"use strict";n.r(t);var r=n(0),i=n(1),a=n.n(i),c=n(9),o=n.n(c),u=(n(16),n(10)),s=n(2),l=n.n(s),f=n(3),h=n(4),d=n(7);function b(e,t){return function(e){return Object(d.a)(Array(e).keys())}(t.length/e).map((function(n){return t.slice(e*n,e*(n+1))}))}function m(e,t){return b(e,function(e){return b(4,e).map((function(e){var t=Object(d.a)(e),n=t[0];return t[1],t[2],n}))}(t))}function p(e,t){return j.apply(this,arguments)}function j(){return(j=Object(h.a)(l.a.mark((function e(t,n){var r;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.createTexture(),t.bindTexture(t.TEXTURE_2D,r),t.bindTexture(t.TEXTURE_2D,r),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,n),x(n.width)&&x(n.height)?t.generateMipmap(t.TEXTURE_2D):(t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR)),e.abrupt("return",r);case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function x(e){return 0==(e&e-1)}function g(e,t){return{type:"image",name:e,image:t}}function v(e,t){return{type:"uniform1f",name:e,value:t}}function T(e,t){var n=Object(f.a)(t,2);return{type:e,w:n[0],h:n[1]}}function E(e,t,n){var r=Object(f.a)(e,2);return{vs:r[0],fs:r[1],result:t,variables:n}}function O(e,t){var n=Object(f.a)(t,2),r=n[0],i=n[1],a=e.createShader(e.VERTEX_SHADER),c=e.createShader(e.FRAGMENT_SHADER);e.shaderSource(a,r),e.shaderSource(c,i),e.compileShader(a),console.log(e.getShaderInfoLog(a)),e.compileShader(c),console.log(e.getShaderInfoLog(c));var o=e.createProgram();return e.attachShader(o,a),e.attachShader(o,c),e.linkProgram(o),e.useProgram(o),o}function _(e,t){return y.apply(this,arguments)}function y(){return(y=Object(h.a)(l.a.mark((function e(t,n){var r,i,a,c,o,s,f,h,d,b,m;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r=n.result,i=n.vs,a=n.fs,c=n.variables,t.width=r.w,t.height=r.h,o=t.getContext("webgl2"),s=O(o,[i,a]),f=o.getAttribLocation(s,"position"),R(o,f),h=0,d=Object(u.a)(c),e.prev=9,d.s();case 11:if((b=d.n()).done){e.next=27;break}m=b.value,e.t0=m.type,e.next="uniform1f"===e.t0?16:"array2D"===e.t0?18:"image"===e.t0?21:25;break;case 16:return A(o,s,m),e.abrupt("continue",25);case 18:return e.next=20,w(o,s,m,h);case 20:return e.abrupt("continue",25);case 21:return e.next=23,U(o,s,m,h);case 23:return++h,e.abrupt("continue",25);case 25:e.next=11;break;case 27:e.next=32;break;case 29:e.prev=29,e.t1=e.catch(9),d.e(e.t1);case 32:return e.prev=32,d.f(),e.finish(32);case 35:return e.abrupt("return",{gl:o,program:s});case 36:case"end":return e.stop()}}),e,null,[[9,29,32,35]])})))).apply(this,arguments)}function R(e,t){var n=e.createBuffer(e.ARRAY_BUFFER);e.bindBuffer(e.ARRAY_BUFFER,n),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,1,1,1,1,-1,-1,-1]),e.STATIC_DRAW),e.enableVertexAttribArray(t),e.vertexAttribPointer(t,2,e.FLOAT,!1,0,0)}function A(e,t,n){var r=n.name,i=n.value,a=e.getUniformLocation(t,r);e.uniform1f(a,i)}function w(e,t,n,r){var i=n.name,a=n.data,c=n.w,o=n.h,u=e.createTexture(),s=e.getUniformLocation(t,i);e.bindTexture(e.TEXTURE_2D,u),console.log({data:a}),e.pixelStorei(e.UNPACK_ALIGNMENT,1),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,c,o,0,e.RGBA,e.UNSIGNED_BYTE,a),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.uniform1i(s,r)}function U(e,t,n,r){return S.apply(this,arguments)}function S(){return(S=Object(h.a)(l.a.mark((function e(t,n,r,i){var a,c,o,u;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=r.name,c=r.image,t.activeTexture(t.TEXTURE0+i),e.next=4,p(t,c);case 4:o=e.sent,console.log(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS,t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS)),t.bindTexture(t.TEXTURE_2D,o),u=t.getUniformLocation(n,a),console.log(a,i),t.uniform1i(u,i);case 10:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function D(e,t){return I.apply(this,arguments)}function I(){return(I=Object(h.a)(l.a.mark((function e(t,n){var r,i,a;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,_(t,n);case 2:return r=e.sent,i=r.gl,a=n.result,i.clearColor(0,0,0,1),i.clear(i.COLOR_BUFFER_BIT),i.drawArrays(i.TRIANGLE_FAN,0,4),e.abrupt("return",(function(){var e=new Uint8Array(a.w*a.h*4);switch(i.readPixels(0,0,a.w,a.h,i.RGBA,i.UNSIGNED_BYTE,e),a.type){default:case"uint8":return e;case"float32":return new Float32Array(e.buffer);case"int32":return new Int32Array(e.buffer)}}));case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var P="\n  #version 300 es\n  in vec4 position;\n  void main() {\n    gl_Position = position;\n  }\n".trim(),k="\n  #version 300 es\n  precision mediump float;\n\n  float greyScale(vec3 x) {\n    return dot(x, vec3( 0.2125, 0.7154, 0.0721 ));\n  }\n\n  int bucketOf(vec3 x, vec3 y) {\n    float a = greyScale(x);\n    float b = greyScale(y);\n    int low = int(floor(a * 7.0));\n    int high = int(floor(b * 7.0)) << 3;\n    return low | high;\n  }\n\n  float entropyOf(int count, int total) {\n    if (count == 0) {\n      return 0.0;\n    } else {\n      float p = float(count) / (float(total));\n      return -p*log(p);\n    }\n  }\n\n  uniform float amplification;\n  uniform float sp_width;\n  uniform float sp_height;\n\n  uniform float m_width;\n  uniform float m_height;\n\n  uniform sampler2D fixedTex;\n  uniform sampler2D movingTex;\n\n\n  out vec4 result;\n\n  float jointEntropy(ivec2 offset1, ivec2 offset2, sampler2D a, sampler2D b) {\n\n    int buckets[64];\n    for (int i = 0; i < 64; ++i) {\n      buckets[i] = 0;\n    }\n\n    for (int i = 0; i < int(m_width); ++i) {\n      for (int j = 0; j < int(m_height); ++j) {\n        ivec2 uv = ivec2(i, j);\n        vec3 fixedImg = texelFetch(a,  offset1+uv, 0).rgb;\n        vec3 movingImg = texelFetch(b, offset2+uv, 0).rgb;\n        int bucketId = bucketOf(fixedImg, movingImg);\n        buckets[bucketId] += 1;\n      }\n    } \n\n    int total = 0;\n    for (int i = 0; i < 64; ++i) {\n      total += buckets[i];\n    }\n\n\n    float entropy  = 0.0;\n    for (int i = 0; i < 64; ++i) {\n      entropy += entropyOf(buckets[i], total);\n    }\n\n    return entropy;\n  }\n\n\n  void main() {\n\n    ivec2 offset = ivec2(\n      gl_FragCoord.x,\n      sp_height - gl_FragCoord.y\n    );\n\n    float a = jointEntropy(offset, offset, fixedTex, fixedTex); \n    float b = jointEntropy(ivec2(0,0), ivec2(0,0), movingTex, movingTex); \n    float ab = jointEntropy(offset, ivec2(0,0), fixedTex, movingTex);\n    float totalEntropy = a + b;\n    float entropy = (totalEntropy - ab) / totalEntropy;\n\n    vec3 color=vec3(entropy*amplification);\n\n    result = vec4(color, 1);\n  }\n".trim();function X(e){var t=e.fixedUrl,n=void 0===t?"butterfly2.jpg":t,a=e.movingUrl,c=void 0===a?"butterfly3.jpg":a,o=Object(i.useRef)(null),u=(Object(i.useRef)(null),Object(i.useRef)(null)),s=Object(i.useRef)(null),d=Object(i.useState)(1),b=Object(f.a)(d,2),p=b[0],j=b[1],x=Object(i.useState)(!0),O=Object(f.a)(x,2),_=O[0],y=O[1],R=Object(i.useState)(null),A=Object(f.a)(R,2),w=A[0],U=A[1];return Object(i.useEffect)((function(){setTimeout(Object(h.a)(l.a.mark((function e(){var t,n,r,i,a,c,f,h,d,b,j,x,O,R,A,w,S,I;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=[u.current,s.current],n=t[0],r=t[1],!_){e.next=5;break}return e.next=4,new Promise((function(e){return setTimeout(e,300)}));case 4:y(!1);case 5:return i=[n.width-r.width,n.height-r.height],a=E([P,k],T("uint8",i),[v("amplification",p),v("sp_width",i[0]),v("sp_height",i[1]),v("m_width",r.width),v("m_height",r.height),g("fixedTex",n),g("movingTex",r)]),c=o.current,f=Date.now(),e.next=11,D(c,a);case 11:h=e.sent,d=Date.now(),b=h(),j=Date.now(),x=d-f,O=j-d,R=i[0]*i[1],A=R*n.width*n.height,w={time:x,uploadTime:O,searchSpace:i,fixed:[n.width,n.height],moving:[r.width,r.height],iterations:R,pixelsCompared:A,itersPerSecond:R/x*1e3,pixelsPerSecond:A/x*1e3},console.log(w),S=m(i[0],b),I=S.flatMap((function(e,t){return e.map((function(e,n){return{value:e,y:t,x:n}}))})).sort((function(e,t){return t.value-e.value})),console.log({topResults5:I.slice(0,5)}),U({benchmark:w,matches:I.slice(0,5)});case 25:case"end":return e.stop()}}),e)}))),0)}),[p,n,c]),Object(r.jsxs)("div",{children:[Object(r.jsx)("h1",{children:" Image Alignment with WebGL "}),Object(r.jsx)("div",{children:'Goal: find "moving image" inside "fixed image" SearchSpace visualization shows how good the score of each x-y offset. Lighter is better. Score is determined by computing the joint entropy (mutual information) between fixed and moving image. Open console for performance metrics and results (ctrl+shift+i)'}),Object(r.jsxs)("div",{style:{display:"flex"},children:[Object(r.jsxs)("div",{children:[Object(r.jsx)("h2",{children:"Fixed Image (haystack)"}),Object(r.jsx)("img",{src:n,ref:u})]}),Object(r.jsxs)("div",{children:[Object(r.jsx)("h2",{children:"Moving Image (needle)"}),Object(r.jsx)("img",{src:c,ref:s})]}),Object(r.jsxs)("div",{children:[Object(r.jsx)("h2",{children:"SearchSpace (Lighter is better) "}),Object(r.jsx)("canvas",{ref:o}),Object(r.jsx)("div",{children:Object(r.jsxs)("label",{children:[" Amplification:",Object(r.jsx)("input",{onChange:function(e){return j(e.target.value)},type:"number",defaultValue:"1.0",value:p})]})}),w&&Object(r.jsxs)("div",{style:{fontSize:"0.8em"},children:[Object(r.jsx)("h3",{children:"Results"}),Object(r.jsxs)("table",{children:[Object(r.jsx)("thead",{children:Object(r.jsxs)("tr",{children:[Object(r.jsx)("th",{children:"Name"}),Object(r.jsx)("th",{children:"Value"})]})}),Object(r.jsxs)("tbody",{children:[Object(r.jsxs)("tr",{children:[Object(r.jsx)("td",{children:"Compute Time"}),Object(r.jsx)("td",{children:w.benchmark.time})]}),Object(r.jsxs)("tr",{children:[Object(r.jsx)("td",{children:"Data Extraction Time"}),Object(r.jsx)("td",{children:w.benchmark.uploadTime})]}),w.matches.map((function(e,t){var n=e.x,i=e.y,a=e.value;return Object(r.jsxs)("tr",{children:[Object(r.jsxs)("td",{children:["match ",t+1]}),Object(r.jsxs)("td",{children:["offset: ",n," | ",i," (",a,")"]})]},t)}))]})]})]})]})]})]})}function F(){return Object(r.jsxs)("div",{children:[Object(r.jsx)(X,{fixedUrl:"butterfly2.jpg",movingUrl:"butterfly3.jpg"}),Object(r.jsx)(X,{fixedUrl:"butterfly2.jpg",movingUrl:"butterfly4.jpg"}),Object(r.jsx)(X,{fixedUrl:"butterfly2.jpg",movingUrl:"butterfly5.jpg"})]})}var L=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,19)).then((function(t){var n=t.getCLS,r=t.getFID,i=t.getFCP,a=t.getLCP,c=t.getTTFB;n(e),r(e),i(e),a(e),c(e)}))};o.a.render(Object(r.jsx)(a.a.StrictMode,{children:Object(r.jsx)(F,{})}),document.getElementById("root")),L()}},[[18,1,2]]]);
//# sourceMappingURL=main.76aa8a97.chunk.js.map