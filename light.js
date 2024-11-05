function Light() {
    this.iVertexBuffer = gl.createBuffer();
    
    let halfSize = 0.06;
    let vertices = [
        // Front face
        -halfSize, -halfSize,  halfSize,  // Bottom-left
         halfSize, -halfSize,  halfSize,  // Bottom-right
         halfSize,  halfSize,  halfSize,  // Top-right
         halfSize,  halfSize,  halfSize,  // Top-right
        -halfSize,  halfSize,  halfSize,  // Top-left
        -halfSize, -halfSize,  halfSize,  // Bottom-left

        // Back face
        -halfSize, -halfSize, -halfSize,  // Bottom-left
        -halfSize,  halfSize, -halfSize,  // Top-left
         halfSize,  halfSize, -halfSize,  // Top-right
         halfSize,  halfSize, -halfSize,  // Top-right
         halfSize, -halfSize, -halfSize,  // Bottom-right
        -halfSize, -halfSize, -halfSize,  // Bottom-left

        // Left face
        -halfSize,  halfSize,  halfSize,  // Top-right
        -halfSize,  halfSize, -halfSize,  // Top-left
        -halfSize, -halfSize, -halfSize,  // Bottom-left
        -halfSize, -halfSize, -halfSize,  // Bottom-left
        -halfSize, -halfSize,  halfSize,  // Bottom-right
        -halfSize,  halfSize,  halfSize,  // Top-right

        // Right face
        halfSize,  halfSize,  halfSize,  // Top-left
        halfSize, -halfSize, -halfSize,  // Bottom-right
        halfSize,  halfSize, -halfSize,  // Top-right
        halfSize, -halfSize, -halfSize,  // Bottom-right
        halfSize,  halfSize,  halfSize,  // Top-left
        halfSize, -halfSize,  halfSize,  // Bottom-left

        // Top face
        -halfSize,  halfSize, -halfSize,  // Top-left
         halfSize,  halfSize, -halfSize,  // Top-right
         halfSize,  halfSize,  halfSize,  // Bottom-right
         halfSize,  halfSize,  halfSize,  // Bottom-right
        -halfSize,  halfSize,  halfSize,  // Bottom-left
        -halfSize,  halfSize, -halfSize,  // Top-left

        // Bottom face
        -halfSize, -halfSize, -halfSize,  // Top-right
        -halfSize, -halfSize,  halfSize,  // Top-left
         halfSize, -halfSize,  halfSize,  // Bottom-right
         halfSize, -halfSize,  halfSize,  // Bottom-right
         halfSize, -halfSize, -halfSize,  // Bottom-left
        -halfSize, -halfSize, -halfSize   // Top-right
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
