// ==UserScript==
// @name         Descifrar mensajes cifrados en divs
// @namespace    tampermonkey-example
// @version      1.0
// @description  Descifra mensajes cifrados en divs con 3DES ECB
// @match        https://cripto.tiiny.site/
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js#sha512-a+SUDuwNzXDvz4XrIcXHuCf089/iJAoN4lmrXJg18XnduKK6YlDHNRalv4yd1N40OKI80tFidF+rqTFKGPoWFQ==
// ==/UserScript==
(function() {
    'use strict';
    var CryptoJS = window.CryptoJS;

    // Generación de la Llave
    var parrafoDiv = document.querySelector('p');
    if (!parrafoDiv) return;

    var textoCompleto = parrafoDiv.innerText;
    var oraciones = textoCompleto.split('. ');
    var contraseña = "";
    for (var i = 0; i < oraciones.length; i++) {
        var primeraLetra = oraciones[i].charAt(0);
        contraseña += primeraLetra;
    }

    if (contraseña.length > 24) {
        contraseña = contraseña.substring(0, 24);
    }

    console.log("La llave es:", contraseña);

    // Conteo de Repeticiones de Clases
    var elementos = document.querySelectorAll('div[class^="M"]');
    var repeticiones = {};
    var patron = /\d+/;

    elementos.forEach(function(elemento) {
        var clases = elemento.classList;
        clases.forEach(function(clase) {
            if (patron.test(clase)) {
                if (repeticiones[clase]) {
                    repeticiones[clase]++;
                } else {
                    repeticiones[clase] = 1;
                }
            }
        });
    });

    var mensajeCifrado = "Los mensajes cifrados son: " + Object.keys(repeticiones).length;
    console.log(mensajeCifrado);

    // Desencriptación
    var divs = document.getElementsByTagName('div');
    var contenidoDesencriptado = '';

    for (var i = 0; i < divs.length; i++) {
        var div = divs[i];
        var id = div.id;
        try {
            var ciphertextBytes = CryptoJS.enc.Base64.parse(id);
            var decryptedBytes = CryptoJS.TripleDES.decrypt({ ciphertext: ciphertextBytes }, CryptoJS.enc.Utf8.parse(contraseña), {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            var decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
            console.log(id + ": " + decryptedText);
            contenidoDesencriptado += decryptedText + ' ';
        } catch (e) {
            console.log("Error desencriptando el ID: " + id);
        }
    }

    var palabrasDesencriptadas = contenidoDesencriptado.split(' ');
    var mensajeDesencriptado = document.createElement('p');
    palabrasDesencriptadas.forEach(function(palabra) {
        mensajeDesencriptado.innerHTML += palabra + '<br>';
    });

    document.body.appendChild(mensajeDesencriptado);
})();

