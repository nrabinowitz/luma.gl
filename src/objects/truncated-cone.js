/* eslint-disable max-statements, complexity */
import Model from './model';

export default class TruncatedCone extends Model {

  constructor(config = {}) {
    const bottomRadius = config.bottomRadius || 0;
    const topRadius = config.topRadius || 0;
    const height = config.height || 1;
    const nradial = config.nradial || 10;
    const nvertical = config.nvertical || 10;
    const topCap = Boolean(config.topCap);
    const bottomCap = Boolean(config.bottomCap);
    const extra = (topCap ? 2 : 0) + (bottomCap ? 2 : 0);
    const numVertices = (nradial + 1) * (nvertical + 1 + extra);
    const vertices = new Float32Array(numVertices * 3);
    const normals = new Float32Array(numVertices * 3);
    const texCoords = new Float32Array(numVertices * 2);
    const indices = new Uint16Array(nradial * (nvertical + extra) * 6);
    const vertsAroundEdge = nradial + 1;
    const math = Math;
    const slant = math.atan2(bottomRadius - topRadius, height);
    const msin = math.sin;
    const mcos = math.cos;
    const mpi = math.PI;
    const cosSlant = mcos(slant);
    const sinSlant = msin(slant);
    const start = topCap ? -2 : 0;
    const end = nvertical + (bottomCap ? 2 : 0);
    let i3 = 0;
    let i2 = 0;

    for (let i = start; i <= end; i++) {
      let v = i / nvertical;
      let y = height * v;
      let ringRadius;

      if (i < 0) {
        y = 0;
        v = 1;
        ringRadius = bottomRadius;
      } else if (i > nvertical) {
        y = height;
        v = 1;
        ringRadius = topRadius;
      } else {
        ringRadius = bottomRadius +
          (topRadius - bottomRadius) * (i / nvertical);
      }
      if (i === -2 || i === nvertical + 2) {
        ringRadius = 0;
        v = 0;
      }
      y -= height / 2;
      for (let j = 0; j < vertsAroundEdge; j++) {
        const sin = msin(j * mpi * 2 / nradial);
        const cos = mcos(j * mpi * 2 / nradial);

        vertices[i3 + 0] = sin * ringRadius;
        vertices[i3 + 1] = y;
        vertices[i3 + 2] = cos * ringRadius;

        normals[i3 + 0] = (i < 0 || i > nvertical) ? 0 : (sin * cosSlant);
        normals[i3 + 1] = (i < 0) ? -1 : (i > nvertical ? 1 : sinSlant);
        normals[i3 + 2] = (i < 0 || i > nvertical) ? 0 : (cos * cosSlant);

        texCoords[i2 + 0] = j / nradial;
        texCoords[i2 + 1] = v;

        i2 += 2;
        i3 += 3;
      }
    }

    for (let i = 0; i < nvertical + extra; i++) {
      for (let j = 0; j < nradial; j++) {
        var index = (i * nradial + j) * 6;
        indices[index + 0] = vertsAroundEdge * (i + 0) + 0 + j;
        indices[index + 1] = vertsAroundEdge * (i + 0) + 1 + j;
        indices[index + 2] = vertsAroundEdge * (i + 1) + 1 + j;
        indices[index + 3] = vertsAroundEdge * (i + 0) + 0 + j;
        indices[index + 4] = vertsAroundEdge * (i + 1) + 1 + j;
        indices[index + 5] = vertsAroundEdge * (i + 1) + 0 + j;
      }
    }

    super({
      vertices: vertices,
      normals: normals,
      texCoords: texCoords,
      indices: indices,
      ...config
    });
  }

}
