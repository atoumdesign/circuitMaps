//FUNCOES COBERTURA
function getCobertura() {
    validos = [];
    nVal = 0;
    for (let a = 0; a < mapa.length; a++) {
        if (mapa[a] == 1) {
            validos.push(a);
        }
    }
    nVal = validos.length;

    for (let i = 1; i < resultado.length; i++) {
        for (let j = 0; j < resultado[i].grupo.length; j++) {
            for (let k = 0; k < resultado[i].grupo[j].length; k++) {
                if (resultado[i].grupo[j][k].implicante == 0) {

                    obj = new Object();
                    obj.binario = resultado[i].grupo[j][k].binario;
                    obj.posicao = resultado[i].grupo[j][k].posicao;
                    obj.validos = [];

                    pv = resultado[i].grupo[j][k].posicao.split(" ");
                    for (let l = 0; l < validos.length; l++) {
                        p = "";
                        for (let m = 0; m < pv.length; m++) {
                            if (validos[l] == pv[m]) {
                                p = pv[m];
                            }
                        }
                        obj.validos.push(p);
                    }
                    cobertura.push(obj);
                    cobertura2.push(obj);
                }
            }
        }
    }

    while (cobertura.length > 0) {
        renovaCobv();
        if (menor() == 1) {
            getSolucaov();
        } else {
            renovaCobh();
            if (maior() == 0) {
                return;
            }
            getSolucaoh();
        }
    }
}

function renovaCobh() {
    cobh = new Array(cobertura.length);
    for (let a = 0; a < cobh.length; a++) {
        cobh[a] = {};
        cobh[a].cont = 0;
        cobh[a].pos;
        for (let b = 0; b < nVal; b++) {
            if (cobertura[a].validos[b] != "") {
                cobh[a].cont++;
                cobh[a].pos = a;
            }
        }
    }
}

function getSolucaoh() {
    t = maior();
    del = [];
    pvs = [];
    for (let a = 0; a < cobh.length; a++) {
        if (cobh[a].cont == t) {
            z = cobh[a].pos;
            solucao.push(cobertura[z].binario);
            for (let b = 0; b < cobertura[z].validos.length; b++) {
                if (cobertura[z].validos[b] != "") {
                    del.push(cobertura[z].validos[b]);
                }
            }
            for (let b = cobertura.length - 1; b >= 0; b--) {
                for (let d = 0; d < cobertura[b].validos.length; d++) {
                    for (let e = 0; e < del.length; e++) {
                        if (del[e] == cobertura[b].validos[d]) {
                            obj = {};
                            obj.pos = b;
                            pvs.push(obj);
                        }
                    }
                }
            }
            pvs = duplicados(pvs, 'pos');
            for (let b = pvs.length - 1; b >= 0; b--) {
                cobertura.splice(pvs[b].pos, 1);
            }
            break;
        }
    }
}

function renovaCobv() {
    cobv = new Array(nVal);
    for (let a = 0; a < cobv.length; a++) {
        cobv[a] = {};
        cobv[a].cont = 0;
        cobv[a].pos;
        for (let b = 0; b < cobertura.length; b++) {
            if (cobertura[b].validos[a] != "") {
                cobv[a].cont++;
                cobv[a].pos = b;
            }
        }
    }
}

function getSolucaov() {
    pvs = [];
    del = [];
    for (let a = 0; a < cobv.length; a++) {
        if (cobv[a].cont == 1) {

            z = cobv[a].pos;
            solucao.push(cobertura[z].binario);
            for (let b = 0; b < validos.length; b++) {
                if (cobertura[z].validos[b] != "") {
                    del.push(cobertura[z].validos[b]);
                }
            }
            for (let b = cobertura.length - 1; b >= 0; b--) {
                for (let d = 0; d < validos.length; d++) {
                    for (let e = 0; e < del.length; e++) {
                        if (del[e] == cobertura[b].validos[d]) {
                            cobertura[b].validos[d] = "";
                        }
                    }
                }
            }
            cobertura.splice(z, 1);
            break;
        }
    }
}

function menor() {
    t = cobv.length - 1;
    for (let a = 0; a < cobv.length; a++) {
        if (cobv[a].cont < t) {
            t = cobv[a].cont;
        }
    }
    return t;
}

function maior() {
    t = 0;
    for (let a = 0; a < cobh.length; a++) {
        if (cobh[a].cont > t) {
            t = cobh[a].cont;
        }
    }
    return t;
}