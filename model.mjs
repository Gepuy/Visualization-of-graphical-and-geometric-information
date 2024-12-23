import LoadTexture from "./TextureHandler.mjs"

function normalizeUV(value, min, max) {
    return (value - min) / (max - min);
}

export default function Model(gl, shProgram) {
    this.gl = gl;
    this.iVertexBuffer = gl.createBuffer();
    this.iNormalBuffer = gl.createBuffer();
    this.iTangentBuffer = gl.createBuffer();
    this.iUVBuffer = gl.createBuffer();
    this.iIndexBuffer = gl.createBuffer();

    this.uvBuffer = [];
    this.indexBuffer = [];
    this.point = [0.5, 0.5];

    this.count = 0;

    this.idTextureDiffuse = LoadTexture(gl, "./textures/diffuse.jpg");
    this.idTextureNormal = LoadTexture(gl, "./textures/normal.jpg");
    this.idTextureSpecular = LoadTexture(gl, "./textures/specular.jpg");

    this.BufferData = function(vertices, normals, tangents, uvs, indices) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iTangentBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangents), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iUVBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);

        this.uvBuffer = uvs;
        this.indexBuffer = indices;

        this.count = indices.length;
    };

    this.Draw = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iNormalBuffer);
        gl.vertexAttribPointer(shProgram.iAttribNormal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribNormal);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iTangentBuffer);
        gl.vertexAttribPointer(shProgram.iAttribTangent, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribTangent);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iUVBuffer);
        gl.vertexAttribPointer(shProgram.iAttribUV, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribUV);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBuffer);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.idTextureDiffuse);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.idTextureNormal);

        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.idTextureSpecular);

        gl.uniform2fv(shProgram.iPoint, this.point);
        gl.uniform1f(shProgram.iAngle, parseFloat(document.getElementById('Angle').value) * (Math.PI / 180.0));

        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_INT, 0);
    }

    this.CreateVertex = function(a, n, R, r, b) {
        const x = r * Math.cos(b),
              y = r * Math.sin(b),
              z = a * Math.cos(n * Math.PI * r / R);
        return [x, y, z];
    }

    this.partialDerivativeR = function(a, n, R, r, b) {
        const dx_dr = Math.cos(b);
        const dy_dr = Math.sin(b);
        const dz_dr = -(a * n * Math.PI / R) * Math.sin((n * Math.PI * r) / R);
        return m4.normalize([dx_dr, dy_dr, dz_dr], []);
    }
    
    this.partialDerivativeB = function (a, n, R, r, b) {
        const dx_db = -r * Math.sin(b);
        const dy_db = r * Math.cos(b);
        const dz_db = 0;
        return m4.normalize([dx_db, dy_db, dz_db], []);
    }

    this.CreateSurfaceData = function() {
        const a = 0.1, n = 1, R = 0.1, radius = 1;
        
        let vertices = [];
        let normals = [];
        let tangents = [];
        let uvs = [];
        let indices = [];
        
        const uSteps = parseInt(document.getElementById('circleCount').value);
        const vSteps = parseInt(document.getElementById('segmentsCount').value)
        
        const du = radius / uSteps;
        const dv = (2.0 * Math.PI) / vSteps;

        for (let i = 0; i <= uSteps; i++) {
            const u = i * du;
            
            for (let j = 0; j <= vSteps; j++) {
                const v = j * dv;
    
                vertices.push(...this.CreateVertex(a, n, R, u, v));
                
                const tangent_u = this.partialDerivativeR(a, n, R, u, v);
                const tangent_v = this.partialDerivativeB(a, n, R, u, v);
                const normal = m4.normalize(m4.cross(tangent_u, tangent_v, []), [0, 0, 1]);

                normals.push(...normal);
                tangents.push(...tangent_u);
                uvs.push(normalizeUV(u, 0.0, radius), normalizeUV(v, 0.0, 2.0 * Math.PI));
            }
        }
        
        for (let i = 0; i < uSteps; i++) {
            for (let j = 0; j < vSteps; j++) {
                const topLeft = i * (vSteps + 1) + j;
                const topRight = i * (vSteps + 1) + (j + 1);
                const bottomLeft = (i + 1) * (vSteps + 1) + j;
                const bottomRight = (i + 1) * (vSteps + 1) + (j + 1);
    
                indices.push(topLeft, bottomLeft, bottomRight);
                indices.push(topLeft, bottomRight, topRight);
            }
        }

        this.BufferData(vertices, normals, tangents, uvs, indices);
    }
}
