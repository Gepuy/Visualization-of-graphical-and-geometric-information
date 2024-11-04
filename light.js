function Light() {
    this.iVertexBuffer = gl.createBuffer();
    
    let haflSize = 0.06;
    let vertices = [
        // Front face
        -haflSize, -haflSize,  haflSize,  // Bottom-left
         haflSize, -haflSize,  haflSize,  // Bottom-right
         haflSize,  haflSize,  haflSize,  // Top-right
         haflSize,  haflSize,  haflSize,  // Top-right
        -haflSize,  haflSize,  haflSize,  // Top-left
        -haflSize, -haflSize,  haflSize,  // Bottom-left

        // Back face
        -haflSize, -haflSize, -haflSize,  // Bottom-left
        -haflSize,  haflSize, -haflSize,  // Top-left
         haflSize,  haflSize, -haflSize,  // Top-right
         haflSize,  haflSize, -haflSize,  // Top-right
         haflSize, -haflSize, -haflSize,  // Bottom-right
        -haflSize, -haflSize, -haflSize,  // Bottom-left

        // Left face
        -haflSize,  haflSize,  haflSize,  // Top-right
        -haflSize,  haflSize, -haflSize,  // Top-left
        -haflSize, -haflSize, -haflSize,  // Bottom-left
        -haflSize, -haflSize, -haflSize,  // Bottom-left
        -haflSize, -haflSize,  haflSize,  // Bottom-right
        -haflSize,  haflSize,  haflSize,  // Top-right

        // Right face
        haflSize,  haflSize,  haflSize,  // Top-left
        haflSize, -haflSize, -haflSize,  // Bottom-right
        haflSize,  haflSize, -haflSize,  // Top-right
        haflSize, -haflSize, -haflSize,  // Bottom-right
        haflSize,  haflSize,  haflSize,  // Top-left
        haflSize, -haflSize,  haflSize,  // Bottom-left

        // Top face
        -haflSize,  haflSize, -haflSize,  // Top-left
         haflSize,  haflSize, -haflSize,  // Top-right
         haflSize,  haflSize,  haflSize,  // Bottom-right
         haflSize,  haflSize,  haflSize,  // Bottom-right
        -haflSize,  haflSize,  haflSize,  // Bottom-left
        -haflSize,  haflSize, -haflSize,  // Top-left

        // Bottom face
        -haflSize, -haflSize, -haflSize,  // Top-right
        -haflSize, -haflSize,  haflSize,  // Top-left
         haflSize, -haflSize,  haflSize,  // Bottom-right
         haflSize, -haflSize,  haflSize,  // Bottom-right
         haflSize, -haflSize, -haflSize,  // Bottom-left
        -haflSize, -haflSize, -haflSize   // Top-right
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);

    this.Draw = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.vertexAttribPointer(shLightProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shLightProgram.iAttribVertex);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }

    this.getLocation = function() {
        let U = parseInt(document.getElementById('lightU').value) / 180.0;
        let V = parseInt(document.getElementById('lightV').value) / 180.0;
        let distance = 2.0;

        const pi = Math.PI;
        const phi = U * 2.0 * pi;

        const theta = V * pi;
        
        const x = distance * Math.sin(theta) * Math.cos(phi);
        const y = distance * Math.cos(theta);
        const z = distance * Math.sin(theta) * Math.sin(phi);
    
        return [ x, y, z ];
    }
}
