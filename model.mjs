import LoadTexture from "./TextureHandler.mjs"


export default function Model(gl, shProgram) {
    this.gl = gl;
    this.iVertexBuffer = gl.createBuffer();
    this.count = 0;
    this.type = gl.TRIANGLES;
    this.idTextureDiffuse = 0;
    this.idTextureNormal = 0;
    this.idTextureSpecular = 0;

    this.BufferData = function(vertices) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);
        this.count = vertices.length / 11;
    }

    this.Draw = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 44, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);

        gl.vertexAttribPointer(shProgram.iAttribUV, 2, gl.FLOAT, false, 44, 12);
        gl.enableVertexAttribArray(shProgram.iAttribUV);

        gl.vertexAttribPointer(shProgram.iAttribTangent, 3, gl.FLOAT, false, 44, 20);
        gl.enableVertexAttribArray(shProgram.iAttribTangent);

        gl.vertexAttribPointer(shProgram.iAttribBitangent, 3, gl.FLOAT, false, 44, 32);
        gl.enableVertexAttribArray(shProgram.iAttribBitangent);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.idTextureDiffuse);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.idTextureNormal);

        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.idTextureSpecular);

        gl.drawArrays(this.type, 0, this.count);
    }

    this.CreateVertex = function(a, n, R, r, b) {
        const x = r * Math.cos(b),
              y = r * Math.sin(b),
              z = a * Math.cos(n * Math.PI * r / R);
        return [x, y, z, r, b / (2 * Math.PI)];
    }

    this.GenerateLinePoints = function(radiusStep, radius, pointConstructor) {
        let vertexList = [];
        
        for (let r = 0; r <= radius; r += radiusStep) {
            vertexList.push(pointConstructor(r));
        }

        return vertexList;
    }

    this.CalculateTangentAndBitangent = function(v0, v1, v2) {
        let edge1 = m4.subtractVectors(v1, v0, []);
        let edge2 = m4.subtractVectors(v2, v0, []);
        let normal = m4.normalize(m4.cross(edge1, edge2, []), [0.0, 1.0, 0.0]);
        let tangent = m4.normalize(m4.subtractVectors(edge1, m4.scaleVector(normal, m4.dot(normal, edge1), []), []))
        let bitangent = m4.normalize(m4.cross(normal, tangent, []), []);
        return [...tangent, ...bitangent]
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
                let firstNormal = this.CalculateTangentAndBitangent(firstLine[index - 1], secondLine[index], firstLine[index]);
                let secondNormal = this.CalculateTangentAndBitangent(firstLine[index - 1], secondLine[index], secondLine[index - 1]);

                vertexList.push(...firstLine[index - 1], ...firstNormal);
                vertexList.push(...secondLine[index], ...firstNormal);
                vertexList.push(...firstLine[index], ...firstNormal);

                vertexList.push(...firstLine[index - 1], ...secondNormal)
                vertexList.push(...secondLine[index], ...secondNormal);
                vertexList.push(...secondLine[index - 1], ...secondNormal);
            }
        }
        
        this.BufferData(vertexList);

        this.idTextureDiffuse = LoadTexture(gl, "./textures/diffuse.jpg");
        this.idTextureNormal = LoadTexture(gl, "./textures/normal.jpg");
        this.idTextureSpecular = LoadTexture(gl, "./textures/specular.jpg");
    }
}
