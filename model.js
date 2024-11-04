function Model() {
    this.iVertexBuffer = gl.createBuffer();
    this.count = 0;
    this.type = gl.TRIANGLES;

    this.BufferData = function(vertices) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);
        this.count = vertices.length / 6;
    }

    this.Draw = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 24, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);

        gl.vertexAttribPointer(shProgram.iAttribNormal, 3, gl.FLOAT, false, 24, 12);
        gl.enableVertexAttribArray(shProgram.iAttribNormal);
        
        gl.drawArrays(this.type, 0, this.count);
    }

    this.CreateVertex = function(a, n, R, r, b) {
        const x = r * Math.cos(b),
              y = r * Math.sin(b),
              z = a * Math.cos(n * Math.PI * r / R);
        return [x, y, z];
    }

    this.GenerateLinePoints = function(radiusStep, radius, pointConstructor) {
        let vertexList = [];
        
        for (let r = 0; r <= radius; r += radiusStep) {
            vertexList.push(pointConstructor(r));
        }

        return vertexList;
    }

    this.CalculateNormal = function(a, b, c) {
        let vectorA = m4.normalize(m4.subtractVectors(b, a, []), []);
        let vectorB = m4.normalize(m4.subtractVectors(c, a, []), []);
        let normal = m4.cross(vectorA, vectorB, []);
        console.log(normal)
        return normal;
    }

    this.CreateSurfaceData = function() {
        const a = 0.1, n = 1, R = 0.1;
        let vertexList = [];
        let radius = 1;
        
        let radiusStep = radius / parseInt(document.getElementById('circleCount').value);
        let segmentStep = (2 * Math.PI) / parseInt(document.getElementById('segmentsCount').value);
                
        for (let beta = segmentStep; beta <= 2 * Math.PI + 0.001; beta += segmentStep) {
            let firstLine = this.GenerateLinePoints(radiusStep, radius, (r) => { return this.CreateVertex(a, n, R, r, beta); });
            let secondLine = this.GenerateLinePoints(radiusStep, radius, (r) => { return this.CreateVertex(a, n, R, r, beta - segmentStep); });

            for(let index = 1; index < firstLine.length; ++index) {
                let firstNormal = this.CalculateNormal(firstLine[index - 1], secondLine[index], firstLine[index]);
                let secondNormal = this.CalculateNormal(firstLine[index - 1], secondLine[index], secondLine[index - 1]);

                vertexList.push(...firstLine[index - 1], ...firstNormal);
                vertexList.push(...secondLine[index], ...firstNormal);
                vertexList.push(...firstLine[index], ...firstNormal);

                vertexList.push(...firstLine[index - 1], ...secondNormal)
                vertexList.push(...secondLine[index], ...secondNormal);
                vertexList.push(...secondLine[index - 1], ...secondNormal);
            }
        }
        
        this.BufferData(vertexList)
    }
}
