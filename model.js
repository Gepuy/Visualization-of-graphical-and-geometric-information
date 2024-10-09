function Model(name) {
    this.name = name;
    this.iVertexBuffer = gl.createBuffer();
    this.count = 0;

    this.BufferData = function(vertices) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);
        this.count = vertices.length / 3;
    }

    this.Draw = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);
        gl.drawArrays(gl.LINE_STRIP, 0, this.count);
    }

    this.CreateVertex = function(a, n, R, r, b) {
        const x = r * Math.cos(b),
              y = r * Math.sin(b),
              z = a * Math.cos(n * Math.PI * r / R);
        return [x, y, z];
    }
    
    this.CreateSurfaceData = function() {
        const a = 0.1, n = 1, R = 0.1;
        let vertexList = [];
        let step = parseFloat(document.getElementById('step').value);
    
        for (let r = 0; r <= 1; r += step) {
            for (let beta = 0; beta < 2 * Math.PI; beta += step) {
                vertexList.push(...this.CreateVertex(a, n, R, r, beta));
            }
        }
    
        for (let beta = 0; beta < 2 * Math.PI; beta += step) {
            for (let r = 0; r <= 1; r += step) {
                vertexList.push(...this.CreateVertex(a, n, R, r, beta));
            }
        }
    
        return vertexList;
    }
}

