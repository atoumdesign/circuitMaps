//Quine-McCluskey padrao (comparacao)

function QMpadrao() {
    var zeros = setZeros(nVar);
    for (let a = 0; a < nVar; a++) {
        obj = new Object();
        obj.coluna = a;
        obj.grupo = [nVar + 1];
        for (let b = 0; b < nVar + 1; b++) {
            obj.grupo[b] = [];
        }
        resultado.push(obj);
    }

    for (let a = 0; a < mapa.length; a++) {
        if (mapa[a] == 1 || mapa[a] == "x") {
            grp = analisePosicao(a);
            s = zeros.slice(a.toString(2).length) + a.toString(2);
            obj = new Object();
            obj.binario = s;
            obj.implicante = 0;
            obj.posicao = a;
            resultado[0].grupo[grp].push(obj);
        }
    }

    for (let a = 1; a < nVar; a++) {
        colunas(a);
    }
}

//FUNCOES DE COMPARACAO
function colunas(c) {
    for (let i = 0; i < nVar; i++) {
        if (resultado[c - 1].grupo[i].length != 0) {
            compararGrupos(c, i);
        }
    }
}

//comparar grupos anteriores para gerar o atual
function compararGrupos(c, g) {
    for (let j = 0; j < resultado[c - 1].grupo[g].length; j++) {
        for (let i = 0; i < resultado[c - 1].grupo[g + 1].length; i++) {
            var r = comparador(resultado[c - 1].grupo[g][j].binario, resultado[c - 1].grupo[g + 1][i].binario);
            if (r != "") {
                var ps = resultado[c - 1].grupo[g][j].posicao.toString(10) + " " + resultado[c - 1].grupo[g + 1][i].posicao.toString(10);
                resultado[c - 1].grupo[g][j].implicante++;
                resultado[c - 1].grupo[g + 1][i].implicante++;
                obj = new Object();
                obj.binario = r;
                obj.implicante = 0;
                obj.posicao = ps;
                resultado[c].grupo[g].push(obj);
            }
        }
    }
    resultado[c].grupo[g] = duplicados(resultado[c].grupo[g], 'binario');
}

//analisa o numero de 1 no binario e retorna sua soma
function analisePosicao(p) {
    p = p.toString(2);
    var cont = 0;
    for (let i = 0; i < p.length; i++) {
        if (p[i] == 1) {
            cont++;
        }
    }
    return cont;
}

//compara dois binario retornando vazio se tiver mais de duas diferencas e um novo binario se tiver uma diferenca
function comparador(p1, p2) {
    var p3 = "";
    var cont = 0;
    for (let i = 0; i < p1.length; i++) {
        if (p1[i] != p2[i]) {
            cont++;
            p3 = p3 + "_";
        } else {
            p3 = p3 + p1[i];
        }
    }
    if (cont == 1) {
        return p3;
    }
    return "";
}