function Model() {
    this.iVertexBuffer = gl.createBuffer();
    this.count = 0;
    this.type = gl.LINES;

    this.BufferData = function(vertices) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);
        this.count = vertices.length / 3;
    }

    this.Draw = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);
        
        gl.drawArrays(this.type, 0, this.count);
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
        let circleCount = parseInt(document.getElementById('circleCount').value);
        let segmentsCount = parseInt(document.getElementById('segmentsCount').value);

        let radius = 1;
    
        let radiusStep = radius / circleCount;
        let segmentStep = (2 * Math.PI) / segmentsCount;
        
        for (let r = 0; r <= radius; r += radiusStep) {
            this.tempVertex = this.CreateVertex(a, n, R, r, 0);
            for (let beta = segmentStep; beta <= 2 * Math.PI + 0.001; beta += segmentStep) {
                this.newTempVertex = this.CreateVertex(a, n, R, r, beta);
                vertexList.push(...[...this.tempVertex, ...this.newTempVertex]);
                this.tempVertex = this.newTempVertex;
            }
        }
        
        for (let beta = 0; beta <= 2 * Math.PI + 0.001; beta += segmentStep) {
            this.tempVertex = this.CreateVertex(a, n, R, 0, beta);
            for (let r = radiusStep; r <= radius; r += radiusStep) {
                this.newTempVertex = this.CreateVertex(a, n, R, r, beta);
                vertexList.push(...[...this.tempVertex, ...this.newTempVertex]);
                this.tempVertex = this.newTempVertex;
            }
        }
        
        this.BufferData(vertexList)
    }
}
