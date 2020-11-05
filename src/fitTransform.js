
function det3(mat) {
    if (mat.length === 9) {
        let [q, w, e, a, s, d, z, x, c] = mat
        return q * s * c + w * d * z + a * x * e - e * s * z - w * a * c - q * d * x
    }
    if (mat.length === 3) {
        let [[q, w, e], [a, s, d], [z, x, c]] = mat
        return q * s * c + w * d * z + a * x * e - e * s * z - w * a * c - q * d * x
    }
    throw 'error matrix'
}

function avg1(p) {
    if (typeof p === 'number') {
        return p
    }
    const sum = p.reduce((a, b) => a + b, 0);
    const avg = (sum / p.length) || 0;
}

function avg2(p, q) {
    if (typeof p === 'number') {
        return avg1(q)
    }
    if (typeof q === 'number') {
        return avg1(p)
    }
    return p.reduce(function (r, a, i) { return r + a * q[i] }, 0) / p.length
}

if (typeof exports === 'undefined') this.exports = {}
exports.solve = function (x, y, u, v) {
    let _11 = avg2(1, 1)
    let _x1 = avg2(x, 1)
    let _y1 = avg2(y, 1)
    let _1x = avg2(1, x)
    let _1y = avg2(1, y)
    let _1u = avg2(1, u)
    let _1v = avg2(1, v)
    let _xx = avg2(x, x)
    let _yy = avg2(y, y)
    let _xy = avg2(x, y)
    let _yx = avg2(y, x)
    let _xu = avg2(x, u)
    let _yu = avg2(y, u)
    let _xv = avg2(x, v)
    let _yv = avg2(y, v)
    let G = det3([_xx, _xy, _x1, _yx, _yy, _y1, _1x, _1y, _11,])
    let A = det3([_xu, _xy, _x1, _yu, _yy, _y1, _1u, _1y, _11,]) / G
    let B = det3([_xx, _xu, _x1, _yx, _yu, _y1, _1x, _1u, _11,]) / G
    let C = det3([_xx, _xy, _xu, _yx, _yy, _yu, _1x, _1y, _1u,]) / G
    let D = det3([_xv, _xy, _x1, _yv, _yy, _y1, _1v, _1y, _11,]) / G
    let E = det3([_xx, _xv, _x1, _yx, _yv, _y1, _1x, _1v, _11,]) / G
    let F = det3([_xx, _xy, _xv, _yx, _yy, _yv, _1x, _1y, _1v,]) / G
    return { A, B, C, D, E, F, G }
}

exports.getPixelPositionFromMNPQ = function (m, n, p, q, width, height) {
    return [(m - 1) * width + p, (n - 1) * height + q]
}

function getMUFromX(x, y, A, B, C, width) {
    let u = A * x + B * y + C
    let m = Math.floor(u / width)
    let p = u - m * width
    return [m + 1, p]
}

exports.getPixelPositionFromXY = function (x, y, A, B, C, D, E, F, width, height) {
    let [m, p] = getMUFromX(x, y, A, B, C, width)
    let [n, q] = getMUFromX(x, y, D, E, F, height)
    return [m, n, p, q]
}