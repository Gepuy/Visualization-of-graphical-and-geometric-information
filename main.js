'use strict';

let gl;                         // The webgl context.
let surface;                    // A surface model
let lightSurface;               // A light surface model
let shProgram;                  // A shader program
let shLightProgram;             // A light shader program
let spaceball;                  // A SimpleRotator object that lets the user rotate the view by mouse.

let zoomFactor = -10;
const zoomStep = 1;
const zoomIn = document.getElementById('zoomIn');
const zoomOut = document.getElementById('zoomOut');

function deg2rad(angle) {
    return angle * Math.PI / 180;
}

// Constructor for ShaderProgram
function ShaderProgram(name, program) {
    this.name = name;
    this.prog = program;

    this.iAttribVertex = -1;
    this.iProjectionMatrix = -1
    this.iModelMatrix = -1
    
    this.Use = function() {
        gl.useProgram(this.prog);
    }
}

/* Draws the scene */
function draw() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let lightLocation = lightSurface.getLocation();

    let projection = m4.perspective(Math.PI / 8, 1, 0.1, 100);
    let trackballView = spaceball.getViewMatrix();
    let rotateToPointZero = m4.axisRotation([0.707, 0.707, 0], 0.7);
    let translateToPointZero = m4.translation(0, 0, zoomFactor);

    let modelMatrix = m4.multiply(translateToPointZero, m4.multiply(rotateToPointZero, trackballView));
    
    let lightModel = m4.translation(lightLocation[0], lightLocation[1], lightLocation[2]);
    lightModel = m4.multiply(trackballView, lightModel);
    lightModel = m4.multiply(rotateToPointZero, lightModel);
    lightModel = m4.multiply(translateToPointZero, lightModel);

    shProgram.Use();

    gl.uniformMatrix4fv(shProgram.iModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(shProgram.iProjectionMatrix, false, projection);
    gl.uniform4fv(shProgram.iLightLocation, m4.transformVector(lightModel, [0.0, 0.0, 0.0, 1.0], []));        
    gl.uniform3fv(shProgram.iColor, [1.0, 0.5, 0.2]);

    surface.Draw();

    shLightProgram.Use();

    gl.uniformMatrix4fv(shLightProgram.iModelMatrix, false, lightModel);
    gl.uniformMatrix4fv(shLightProgram.iProjectionMatrix, false, projection);
    lightSurface.Draw();
}

/* Initialize the WebGL context */
function initGL() {
    let prog = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    let progLight = createProgram(gl, vertexLightShaderSource, fragmentLightShaderSource);

    shProgram = new ShaderProgram('Basic', prog);
    shLightProgram = new ShaderProgram('Light', progLight);

    shProgram.iAttribVertex = gl.getAttribLocation(prog, "in_vertex");
    shProgram.iAttribNormal = gl.getAttribLocation(prog, "in_normal");
    shProgram.iModelMatrix = gl.getUniformLocation(prog, "model");
    shProgram.iProjectionMatrix = gl.getUniformLocation(prog, "projection");
    shProgram.iLightLocation = gl.getUniformLocation(prog, "light_location");
    shProgram.iColor = gl.getUniformLocation(prog, "color");

    shLightProgram.iAttribVertex = gl.getAttribLocation(progLight, "in_vertex");
    shLightProgram.iProjectionMatrix = gl.getUniformLocation(progLight, "projection");;
    shLightProgram.iModelMatrix = gl.getUniformLocation(progLight, "model");

    surface = new Model('Surface');
    surface.CreateSurfaceData();

    lightSurface = new Light();

    gl.enable(gl.DEPTH_TEST);
}

/* Creates a program */
function createProgram(gl, vShader, fShader) {
    let vsh = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vsh, vShader);
    gl.compileShader(vsh);
    if (!gl.getShaderParameter(vsh, gl.COMPILE_STATUS)) {
        throw new Error("Error in vertex shader: " + gl.getShaderInfoLog(vsh));
    }

    let fsh = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fsh, fShader);
    gl.compileShader(fsh);
    if (!gl.getShaderParameter(fsh, gl.COMPILE_STATUS)) {
        throw new Error("Error in fragment shader: " + gl.getShaderInfoLog(fsh));
    }

    let prog = gl.createProgram();
    gl.attachShader(prog, vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error("Link error in program: " + gl.getProgramInfoLog(prog));
    }
    return prog;
}

zoomIn.addEventListener('click', () => {
    zoomFactor += zoomStep;
    draw();
});

zoomOut.addEventListener('click', () => {
    zoomFactor -= zoomStep;
    draw();
});

function update(){
    surface.CreateSurfaceData();
    draw();
}

/* Initialize the app */
function init() {
    let canvas;
    try {
        canvas = document.getElementById("webglcanvas");
        gl = canvas.getContext("webgl2");
        if (!gl) {
            throw "Browser does not support WebGL";
        }
    } catch (e) {
        document.getElementById("canvas-holder").innerHTML = "<p>Sorry, could not get a WebGL graphics context.</p>";
        return;
    }

    try {
        initGL();
    } catch (e) {
        document.getElementById("canvas-holder").innerHTML =
            "<p>Sorry, could not initialize the WebGL graphics context: " + e + "</p>";
        return;
    }

    spaceball = new TrackballRotator(canvas, draw, 0);

    draw();
}
