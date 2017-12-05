//VARIAVEIS GLOBAIS
var alfabeto = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"];
var posicoesTH = [0, 1, 3, 2, 6, 7, 5, 4, 12, 13, 15, 14, 10, 11, 9, 8, 24, 25, 27, 26, 30, 31, 29, 28, 20, 21, 23, 22, 18, 19, 17, 16, 48, 49, 51, 50, 54, 55, 53, 52, 60, 61, 63, 62, 58, 59, 57, 56, 40, 41, 43, 42, 46, 47, 45, 44, 36, 37, 39, 38, 34, 35, 33, 32];
var resultado = [];
var cobertura = [];
var cobertura2 = [];
var solucao = [];
var nVar = 3;
var zeros = "";
var mapa;
var implicantes = [];




//FUNCOES BASES
//remove objetos duplicados em um array de objetos
function duplicados(arr, prop) {
    var novoArray = [];
    var lookup = {};

    for (var i in arr) {
        lookup[arr[i][prop]] = arr[i];
    }
    for (i in lookup) {
        novoArray.push(lookup[i]);
    }
    return novoArray;
}

function aleatorio(length, atual) {
    atual = atual ? atual : '';
    return length ? aleatorio(--length, "01x".charAt(Math.floor(Math.random() * 3)) + atual) : atual;
}

function tempoDecorrido(funcao) {
    var args = Array.prototype.slice.call(arguments, 1);
    var inicio = performance.now();
    funcao.apply(null, args);
    return performance.now() - inicio;
}

function verTabelaVerdade() {
    var btnTv = document.querySelector("#verTabelaVerdade");
    btnTv.setAttribute("class", "bg-light sidebar col-sm-5");
}

function ocultarTabelaVerdade() {
    var btnTv = document.querySelector("#verTabelaVerdade");
    btnTv.removeAttribute("class");
    btnTv.setAttribute("class", "d-none bg-light sidebar");
}

function criarMapa() {
    //obtem novo valor de numero de variaveis
    nVar = parseInt(document.getElementById("nVariaveis").value);

    resultado = [];
    cobertura = [];
    cobertura2 = [];
    solucao = [];
    mapa;
    implicantes = [];

    //gera tabela verdade
    criarTabelaVerdade();

    //calcula o a largura e a altura do novo mapa
    if (nVar % 2 == 0) {
        if (nVar == 2) {
            x = 2;
            y = 2;
            z = 1;
        } else {
            z = nVar/2;
            x = y = Math.pow(2, z);
        }
    } else {
        z = (nVar+1)/2;
        x = Math.pow(2,z);
        y = x/2;
    }

    var div = document.querySelector("#mapaKarnaugh");
    div.removeChild(div.firstChild);
    var table = document.createElement("table");
    table.setAttribute("id", "mapa");
    table.setAttribute("class", "table-bordered table-hover");
    div.appendChild(table);

    var btn = document.querySelector("#solucao");
    btn.setAttribute("hidden", "hidden");

    var thx = setPosicoes(x,z);
    var sVar = "";
    if (nVar % 2 == 0) {
        var thy = setPosicoes(y,z);
        for (let a = 0; a < z; a++) {
            sVar = sVar + alfabeto[a];
        }
        sVar = sVar+"\\";
        for (let a = z; a < z*2; a++) {
            sVar = sVar + alfabeto[a];
        }
    }else{
        var thy = setPosicoes(y,z-1);
        for (let a = 0; a < z-1; a++) {
            sVar = sVar + alfabeto[a];
        }
        sVar = sVar+"\\";
        for (let a = z; a < z*2; a++) {
            sVar = sVar + alfabeto[a-1];
        }
    }

    var thead = document.createElement("thead");
    table.appendChild(thead);
    var tr = document.createElement("tr");
    tr.setAttribute("class", "bg-secondary");
    thead.appendChild(tr);

    var th = document.createElement("th");
    th.textContent = sVar;
    tr.appendChild(th);

    for (let a = 1; a < x+1; a++) {
        var th = document.createElement("th");
        th.textContent = thx[a-1];
        tr.appendChild(th);
    }

    //cabecalho da tabela
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    for (let a = 0; a < y; a++) {
        var tr = document.createElement("tr");
        tbody.appendChild(tr);
        var th = document.createElement("th");
        th.setAttribute("class", "bg-secondary");
        th.setAttribute("scope", "row");
        th.textContent = thy[a];
        tr.appendChild(th);

        for (let b = 1; b < x+1; b++) {
            var posbin = thy[a]+thx[b-1];
            var posdec = parseInt(posbin, 2);

            var td = document.createElement("td");
            td.appendChild(comboboxPosicao(posdec,""));
            tr.appendChild(td);

            var sup = document.createElement("sup");
            sup.textContent = posdec;
            td.appendChild(sup);

            var sub = document.createElement("h6");
            sub.textContent = posbin;
            td.appendChild(sub);
        }
    }
    var btn = document.querySelector("#resolver");
    btn.removeAttribute("hidden");
}

function criarTabelaVerdade() {
    nVar = parseInt(document.getElementById("nVariaveis").value);

    //apaga tabela verdade anterior e cria a nova
    var div = document.querySelector("#tabelaVerdade");
    div.removeChild(div.firstChild);
    var table = document.createElement("table");
    table.setAttribute("class", "table table-sm table-hover table-striped table-bordered");
    div.appendChild(table);

    //cabecalho da tabela
    var thead = document.createElement("thead");
    table.appendChild(thead);
    var tr = document.createElement("tr");
    tr.setAttribute("class", "bg-secondary");
    thead.appendChild(tr);

    //primeira celula do cabecalho
    var th = document.createElement("th");
    th.textContent = "#";
    tr.appendChild(th);

    //celulas responsaveis pelas variaveis
    for (let a = 1; a < nVar+1; a++) {
        var th = document.createElement("th");
        th.textContent = alfabeto[a-1];
        tr.appendChild(th);
    }

    //celula da saída
    var th = document.createElement("th");
    th.textContent = "saída";
    tr.appendChild(th);

    //cabecalho da tabela
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    for (let a = 0; a < Math.pow(2,nVar); a++) {
        var tr = document.createElement("tr");
        tbody.appendChild(tr);
        var th = document.createElement("th");
        th.setAttribute("scope", "row");
        th.textContent = a;
        tr.appendChild(th);

        var bin0 = (a).toString(2);
        var bin = setZeros(nVar).slice(bin0.length) + bin0;

        for (let b = 1; b < nVar+1; b++) {
            var td = document.createElement("td");
            td.textContent = bin[b-1];
            tr.appendChild(td);
        }
        var td = document.createElement("td");
        td.appendChild(comboboxPosicao(a,"tv"));
        tr.appendChild(td);
    }
}

function comboboxPosicao(pos, tipo) {
    var select = document.createElement("select");
    select.setAttribute("id", tipo + pos);
    select.setAttribute("class", "btn btn-sm btn-outline-secondary");

    var option0 = document.createElement("option");
    option0.textContent = "0";
    option0.setAttribute("value", "0");
    select.appendChild(option0);

    var option1 = document.createElement("option");
    option1.textContent = "1";
    option1.setAttribute("value", "1");
    select.appendChild(option1);

    var optionx = document.createElement("option");
    optionx.textContent = "x";
    optionx.setAttribute("value", "x");
    select.appendChild(optionx);

    return select;
}

function setZeros(v) {
    var z = "";
    for (let a = 0; a < v; a++) {
        z = z + "0";
    }
    return z;
}

function nVariaveis(max) {
    var select = document.createElement("select");
    select.setAttribute("name", "nVariaveis");
    select.setAttribute("id", "nVariaveis");
    select.setAttribute("class", "btn btn-sm btn-secondary");

    for (let a = 2; a <= max; a++) {
        var option = document.createElement("option");
        option.setAttribute("value", a);
        option.textContent = a;
        select.appendChild(option);
    }
    return select;
}

//retorna as posicoes dos cabecalhos do mapa conforme a variavel utilizada
function setPosicoes(x,z) {
    var arr = [];
    var binx = setZeros(z);

    for (let a = 0; a < x; a++) {
        var bin = posicoesTH[a].toString(2);
        var bin2 = binx.slice(bin.length) + bin;
        arr.push(bin2);
    }
    return arr;
}

function getTabelaVerdade() {
    for (let i = 0; i < Math.pow(2, nVar); i++) {
        var tt = "tv" + (i);
        var m = document.getElementById(tt).value;
        document.getElementById(i).value = m;
    }
}

function setLimpar() {
    for (let i = 0; i < Math.pow(2, nVar); i++) {
        var tt = "tv" + (i);
        document.getElementById(tt).value = 0;
    }
    getTabelaVerdade();
}

function setAleatorio() {
    for (let i = 0; i < Math.pow(2, nVar); i++) {
        var tt = "tv" + (i);
        document.getElementById(tt).value = aleatorio(1);
    }
    getTabelaVerdade();
}

function setExemplo(arr, v) {
    for (let i = 0; i < Math.pow(2, v); i++) {
        var tt = "tv" + (i);
        document.getElementById(tt).value = arr[i];
    }
    getTabelaVerdade();
}

function setMapa() {
    for (let a = 0; a < mapa.length; a++) {
        var m = document.getElementById(a).value;
        mapa[a] = m;
    }
}

function resolucao() {
    mapa = new Array(Math.pow(2, nVar));
    setMapa();
    resultado = [];
    cobertura = [];
    cobertura2 = [];
    solucao = [];
    implicantes = [];
    
    // Testando
    var tempo = tempoDecorrido(QMpadrao);
    
    //apaga tabela verdade anterior e cria a nova
    var div = document.querySelector("#resolucao");
    div.removeChild(div.firstChild);
    var table = document.createElement("table");
    table.setAttribute("class", "table table-sm table-hover table-bordered");
    div.appendChild(table);
    var btn = document.querySelector("#solucao");
    btn.removeAttribute("hidden");

    //cabecalho da tabela
    var thead = document.createElement("thead");
    table.appendChild(thead);
    var tr = document.createElement("tr");
    tr.setAttribute("class", "bg-secondary");
    thead.appendChild(tr);

    //primeira celula do cabecalho
    var th = document.createElement("th");
    th.textContent = "#";
    tr.appendChild(th);

    //celulas responsaveis pelas variaveis
    for (let a = 1; a < nVar+1; a++) {
        var th = document.createElement("th");
        th.textContent = "coluna "+(a-1);
        tr.appendChild(th);
    }

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    for (let a = 0; a < nVar+1; a++) {
        var tr = document.createElement("tr");
        tbody.appendChild(tr);
        var th = document.createElement("th");
        th.setAttribute("class", "bg-secondary");
        th.setAttribute("scope", "row");
        th.textContent = "grupo "+a;
        tr.appendChild(th);

        for (let b = 1; b < nVar+1; b++) {
            var td = document.createElement("td");
            var cel = "";
            for (let d = 0; d < resultado[b-1].grupo[a].length; d++) {
                var p = document.createElement("h6");
                p.textContent = resultado[b-1].grupo[a][d].binario+"("+resultado[b-1].grupo[a][d].posicao+")";
                if (resultado[b-1].grupo[a][d].implicante == 0) {
                    implicantes.push(resultado[b-1].grupo[a][d]);
                    p.style = "color: red;";
                }
               td.appendChild(p);   
            }
            tr.appendChild(td);
        }
    }
    var caption = document.createElement("caption");
    var p = document.createElement("h6");
    p.textContent = "Tempo: "+tempo+" ms / "+(tempo/1000)+" s";
    caption.appendChild(p);
    table.appendChild(caption);


    getCobertura();
    exibirCobertura();
}

function exibirCobertura() {
    //apaga tabela verdade anterior e cria a nova
    var div = document.querySelector("#tabelaCobertura");
    div.removeChild(div.firstChild);
    var table = document.createElement("table");
    table.setAttribute("class", "table table-sm table-hover table-bordered");
    div.appendChild(table);

    //cabecalho da tabela
    var thead = document.createElement("thead");
    table.appendChild(thead);
    var tr = document.createElement("tr");
    tr.setAttribute("class", "bg-secondary");
    thead.appendChild(tr);

    //primeira celula do cabecalho
    var th = document.createElement("th");
    th.textContent = "#";
    tr.appendChild(th);

    //celulas responsaveis pelas variaveis
    for (let a = 1; a < validos.length+1; a++) {
        var th = document.createElement("th");
        th.textContent = validos[a-1];
        tr.appendChild(th);
    }

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    for (let a = 0; a < implicantes.length; a++) {
        var tr = document.createElement("tr");
        tbody.appendChild(tr);
        var th = document.createElement("th");
        th.setAttribute("class", "bg-secondary");
        th.setAttribute("scope", "row");
        th.textContent = implicantes[a].binario+"("+implicantes[a].posicao+")";
        tr.appendChild(th);

        var impVal = implicantes[a].posicao.split(" ");

        for (let l = 0; l < mapa.length; l++) {
            if (mapa[l] == "1") {
                td = document.createElement("td");
                for (let m = 0; m < impVal.length; m++) {
                    if (l == impVal[m]) {
                        td.textContent = "*";
                    }
                }
                tr.appendChild(td);
            }
        }
    }

    var caption = document.createElement("caption");
    var p = document.createElement("h4");
    
    var texto = solucao[0];
    for (let a = 1; a < solucao.length; a++) {
        texto = texto+"+"+solucao[a];
    }
    p.textContent = "Solução: "+texto;
    caption.appendChild(p);
    table.appendChild(caption);
}
