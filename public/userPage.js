let dataFornitori;

function reload() {
  window.location.replace(window.location.pathname + window.location.search + window.location.hash);
};

const date = new Date();
const engine = {
  princ: (data) => {
    engine.user.engine(data.userData);
    engine.docs.converter(data.docs);
    engine.salvaNewDoc(data.userData);
    $('.popUp').hide();
    $('.dateAnno').hide();
  },

  user: {
    header: (data) => {
      return `<br>
      <div class="contTotF">
      <div><br></div>
      <span class='buttF'>${data.user}</span>
      <span class='ButtA' onclick="$('#modificaUser').slideToggle('slow', () => {})">&#9997;</span>
      </div>
      <div id="modificaUser" class="contTotF" align="center">
      <div class="pezziModUser">
      <p>modfica nome:</p>
      <span contenteditable id="newUserName" class="buttFinput">
      ${data.user}
      </span><br><br>
      <div id="buttSalvaNuserName" class="ButtA">salva nuovo nome</div><br>
      </div>
      <div class="pezziModUser">
      <p>modifica password:</p>
      <p>vecchia password</p>
      <span contenteditable id="CheckOldPassword" class="buttFinput">
      scrivi vecchia password
      </span><br>
      <p>nuova password:</p>
      <p>(spazi non ammessi)</p>
      <span contenteditable id="newUserPassword" class="buttFinput">
      scrivi nuova password
      </span><br><br>
      <div id="buttSalvaNpssw" class="ButtA">salva nuova password</div>
      </div></div>

      `
    },
    engine: (userData) => {
      $('#aboutUsr').append(engine.user.header(userData));
      $('#modificaUser').hide();
      $('#buttSalvaNpssw').on('click', () => {
        $.post('/modPssw', { checkPssw: $('#CheckOldPassword').text(), nuovaPssw: $('#newUserPassword').text() }, (resp) => { alert(resp.resp); });
      });
      $('#buttSalvaNuserName').on('click', () => {
        $.post('/modUsername', { newusername: $('#newUserName').text(), userEmail: userData.email }, (resp) => { alert(resp.resp); });
      });

    }
  },
  salvaNewDoc: (userData) => {
    $('#SalvaDoc').on('click', () => {
      const newDoc = {
        usrEmail: userData.email,
        nDoc: $('#numeroNewDoc').text(),
        dataDoc: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
        dettDoc: $('#dettNewDoc').text(),
        fornitore: $('#theRealNewForn').text(),
        articoli: [],
      }
      console.log(newDoc.dataDoc);
      for (let index = 1; index <= engine.totNewArt; index += 1) {
        console.log(`looking for ${index} index`);
        const articolo = {
          nomeArt: $(`#nome_${index}`).text(),
          colli: $(`#colli_${index}`).val(),
          peso: $(`#peso_${index}`).val(),
          prezzo: $(`#prezzo_${index}`).val(),
          guadagno: $(`#guadagno_${index}`).val(),
          speseFacchini: $(`#speseF_${index}`).val(),
          speseTrasporto: $(`#speseT_${index}`).val(),
        };

        newDoc.articoli[index] = articolo;
      }
      newDoc.articoli.shift();
      const ready = JSON.stringify(newDoc);
      $.post('/salvaNewDoc', { newDoc: ready }, () => {
      }); reload();
    })
  },
  popUp: (docId, type, percorso, indexArt) => {
    $('.popUp').empty().append('<div class="targetPopUp" align="center"></div><span id="popUpSaveBtn" class="buttF">save</span> <span id="popUpCancelBtn" class="buttF">cancel</span>');
    if (type === 'addArt') {
      $('.popUp').prepend(`
        <div>
                Nuovo articolo<br><br><br>
        ${percorso}<br><br><br>

          <div><span>nome:</span> <span contenteditable id="newArtNome" class="buttFinput">+ nome articolo</span></div><br><br>
          </div><br><br>
          `);
      $('.targetPopUp').append(`
      <div><span>colli:</span> <input type="number" id="newArtColli" class="buttFinput"></div> <div><span>peso:</span> <input type="number" id="newArtPeso" class="buttFinput"></div>
      <div><span>prezzo:</span> <input type="number" id="newArtPrezzo" class="buttFinput"></div> <div><span>guadagno:</span> <input type="number" id="newArtGuadagno" class="buttFinput"></div></div>
      <div><span>spese facchini:</span> <input type="number" id="newArtSpeseF" class="buttFinput"></div> <div><span>spese trasporto:</span> <input type="number" id="newArtSpeseT" class="buttFinput"></div>
      <br><br><br><br>
          `);

      $('html,body').animate({ scrollTop: 0 }, 500, () => {});
      $('#popUpCancelBtn').on('click', () => { $('.popUp').fadeOut('slow', () => { }); });
      $('#popUpSaveBtn').on('click', () => {
        const nomeArt = $('#newArtNome').text();
        const colli = $('#newArtColli').val();
        const peso = $('#newArtPeso').val();
        const prezzo = $('#newArtPrezzo').val();
        const guadagno = $('#newArtGuadagno').val();
        const speseFacchini = $('#newArtSpeseF').val();
        const speseTrasporto = $('#newArtSpeseT').val();
        const articolo = {
          nomeArt,
          colli,
          peso,
          prezzo,
          guadagno,
          speseFacchini,
          speseTrasporto,
          docId,
        };
        const toSend = JSON.stringify(articolo);
        $.post('/nuovoArticolo', {
          toSend
        }, () => {});
        reload();
      });
    }
    if (type === 'modDoc') {
      let currentDoc;
      dataFornitori.forEach((fornitore) => {
        fornitore.documenti.forEach((documento) => {
          if (documento._id === docId) {
            currentDoc = documento;
          }
        })
      });
      $('.popUp').prepend(`
        <div>
                Nuovo articolo<br><br><br>
        ${percorso}<br><br><br>

          <div><span>nome:</span> <span contenteditable id="modDocNum" class="buttFinput">${currentDoc.nDoc}</span></div><br>
          <p>il formato della data deve rimanere gg/mm/aa,<br> senza zeri non necessari,<br> esempio: 12/3/2019</p>
          <div><span>data:</span> <span contenteditable id="modDocData" class="buttFinput">${currentDoc.dataDoc}</span></div><br><br>
          <div><span>fornitore:</span> <span contenteditable id="modDocforn" class="buttFinput">${currentDoc.fornitore}</span></div><br><br>
          <div><span>dettagli:</span> <span contenteditable id="modDocDett" class="buttFinput">${currentDoc.dettDoc}</span></div><br><br>

          </div><br><br>
          `);

      $('html,body').animate({ scrollTop: 0 }, 500, () => {});
      $('#popUpCancelBtn').on('click', () => { $('.popUp').fadeOut('slow', () => { }); });
      $('#popUpSaveBtn').on('click', () => {
        const nDoc = $('#modDocNum').text();
        const dataDoc = $('#modDocData').text();
        const fornitore = $('#modDocforn').text();
        const dettDoc = $('#modDocDett').text();
        const documento = {
          nDoc,
          dataDoc,
          fornitore,
          dettDoc,
          docId,
        };
        const toSend = JSON.stringify(documento);
        $.post('/modDocumento', {
          toSend
        }, () => {});
        reload();
      });
    }
    if (type === 'modForn') {
      const oldNameForn = percorso;
      $('.popUp').prepend(`
        <div>
                modifica nome fornitore<br><br><br>
        ${percorso}<br><br><br>

          <div><span> cambia nome:</span> <span contenteditable id="modForn" class="buttFinput">${oldNameForn}</span></div><br><br>
          </div><br><br>
          `);

      $('html,body').animate({ scrollTop: 0 }, 500, () => {});
      $('#popUpCancelBtn').on('click', () => { $('.popUp').fadeOut('slow', () => { }); });
      $('#popUpSaveBtn').on('click', () => {
        const newNameForn = $('#modForn').text();

        $.post('/modForn', {
          newNameForn,
          oldNameForn,
        }, () => {});
        reload();
      });
    }

    if (type === 'modArt') {
      let currentArt;
      dataFornitori.forEach((fornitore) => {
        fornitore.documenti.forEach((documento) => {
          if (documento._id === docId) {
            currentArt = documento.articoli[indexArt];
          }
        })
      });
      console.log(currentArt);
      $('.popUp').prepend(`
        <div>
                Nuovo articolo<br><br><br>
        ${percorso}<br><br><br>

          <div><span>nome:</span> <span contenteditable id="newArtNome" class="buttFinput">${currentArt.nomeArt}</span></div><br><br>
          </div><br><br>
          `);
      $('.targetPopUp').append(`
      <div><span>colli:</span> <input type="number" id="newArtColli" class="buttFinput" value="${currentArt.colli}"></div>
      <div><span>peso:</span> <input type="number" id="newArtPeso" class="buttFinput" value="${currentArt.peso}"></div>
      <div><span>prezzo:</span> <input type="number" id="newArtPrezzo" class="buttFinput" value="${currentArt.prezzo}"></div>
      <div><span>guadagno:</span> <input type="number" id="newArtGuadagno" class="buttFinput" value="${currentArt.guadagno}"></div></div>
      <div><span>spese facchini:</span> <input type="number" id="newArtSpeseF" class="buttFinput" value="${currentArt.speseFacchini}"></div>
      <div><span>spese trasporto:</span> <input type="number" id="newArtSpeseT" class="buttFinput" value="${currentArt.speseTrasporto}"></div>
      <br><br><br><br>
          `);

      $('html,body').animate({ scrollTop: 0 }, 500, () => {});
      $('#popUpCancelBtn').on('click', () => { $('.popUp').fadeOut('slow', () => { }); });
      $('#popUpSaveBtn').on('click', () => {
        const nomeArt = $('#newArtNome').text();
        const colli = $('#newArtColli').val();
        const peso = $('#newArtPeso').val();
        const prezzo = $('#newArtPrezzo').val();
        const guadagno = $('#newArtGuadagno').val();
        const speseFacchini = $('#newArtSpeseF').val();
        const speseTrasporto = $('#newArtSpeseT').val();
        const articolo = {
          nomeArt,
          colli,
          peso,
          prezzo,
          guadagno,
          speseFacchini,
          speseTrasporto,
          docId,
          indexArt,
        };
        const toSend = JSON.stringify(articolo);
        $.post('/modArticolo', {
          toSend
        }, () => {});
        reload();
      });
    }
    $('.popUp').fadeToggle('slow', () => { });
  },
  removeForn: (nomeForn) => {
    const confirm = window.confirm(`cancellare ${nomeForn}?`);
    if (confirm === true) {
      $.post('/deleteForn', { nomeForn }, () => {}); reload();
    } else { alert('fornitore non cancellato'); }
  },
  removeArt: (indexArt, docId) => {
    const confirm = window.confirm('cancellare articolo?');
    if (confirm === true) {
      $.post('/deleteArt', { indexArt, docId }, () => {}); reload();
    } else { alert('articolo non cancellato'); }
  },
  removeDoc: (docId) => {
    const confirm = window.confirm(`cancellare documento?`);
    if (confirm === true) {
      $.post('/deleteDoc', { docId }, () => {}); reload();
    } else { alert('documento non cancellato'); }
  },
  totNewArt: 0,
  renderNewArt: (index) => {

    $('#totNewArt').append(`
      <div id="art_N_${index}">
      <p>${index}</p>
      <div><span>nome:</span> <span contenteditable id="nome_${index}" class="buttF" >+nome articolo</span></div><br>
      <div class="contNewArt">
      <div><span>colli:</span> <input type="number"  id="colli_${index}" class="buttFinput" ></div><pre>  </pre>
      <div><span>peso:</span> <input type="number"  id="peso_${index}" class="buttFinput" ></div><pre>  </pre>
      <div><span>prezzo:</span> <input type="number"  id="prezzo_${index}" class="buttFinput" ></div><pre>  </pre>
      <div><span>guadagno:</span> <input type="number"  id="guadagno_${index}" class="buttFinput" ></div></div><div class="contNewArt"><pre>  </pre>
      <div><span>spese facchini:</span> <input type="number"  id="speseF_${index}" class="buttFinput" ></div><pre>  </pre>
      <div><span>spese trasporto:</span> <input type="number"  id="speseT_${index}" class="buttFinput" ></div><pre>    </pre>
      <div><span  id="buttCanc" class="ButtA" onclick="$('#art_N_${index}').slideUp('slow', () => {}); $('#art_N_${index}').remove(); engine.totNewArt -= 1; console.log(engine.totNewArt)">x</span></div>
      <div><br></div> </div>
      `);
    $(`#art_N_${index}`).hide().slideDown('slow', () => {});
  },
  renderNewDoc: (listaForn) => {
    $('#contNewDoc').hide();
    const target = '.contNewDoc';
    const subEngine = {};
    subEngine.bottForn = () => {
      $(target).append(`
        <p>Fornitore:</p>
        <div contenteditable id="theRealNewForn" class="buttF" onclick="$('#theRealNewForn').empty()">+nuovo foritore</div><br>
        `);
      listaForn.forEach((item) => {
        $(target).append(`
          <span class='ButtA' id="${item}_butt_NewForn_newDoc" onclick="$('#theRealNewForn').empty().append('${item}')">${item}</span>
          `);
      });
    };

    subEngine.docFields = () => {
      $(target).append(`
        <br><br>
        <p></p>
        <div id="specNewDoc"  width="60%">
        <p>numero nuovo documento:</p>
        <span contenteditable id="numeroNewDoc" class="buttF" >+numero nuovo documento</span><br><br><br>
        <p>dettagli nuovo documento:</p>
        <div contenteditable id="dettNewDoc" class="buttF" >+dettagli</div><br>
        <p>articoli:</p>
        <div id="addArticolo" class='ButtA' >aggiungi articolo</div><br>
        <div id="totNewArt" >
        </div>
        <br>
        <div id="SalvaDoc" class='buttF' >SALVA</div><br>
        </div>
        `);
      $('#addArticolo').on('click', () => {
        engine.totNewArt += 1;
        engine.renderNewArt(engine.totNewArt);
      });
    };
    subEngine.bottForn(); subEngine.docFields();
  },

  renderDoc: (data, id, fornitore) => {
    console.log(data);
    console.log(id);
    console.log(fornitore);
    const intIdF = id;
    const selectedDocs = [];
    dataFornitori.forEach((itemFornitore) => {
      if (itemFornitore.fornitore === fornitore) {
        itemFornitore.documenti.forEach((documento) => {

          if (documento.dataDoc === data) {
            selectedDocs.push(documento);
          }
        });
      }
    });
    $(`#${intIdF}`).empty();
    selectedDocs.forEach((doc, indexD, arrayD) => {
      const intIdD = `${intIdF}_${indexD + 1}`;
      $(`#${intIdF}`).append(`
        <div class="contDoc">
        <div class="tooltip" >
        &#127817;
        <div class="tooltiptext" align="center">
        <span class="ButtA" onclick="engine.removeDoc('${doc._id}')">&#10060;</span>
        <span class="ButtA" onclick="engine.popUp('${doc._id}', 'modForn',${doc.fornitore}')">&#9997;</span>
        </div>
        </div><br><br>
        <span>documento ${indexD + 1} di ${arrayD.length} </span><br>
        <div>n° documento: ${doc.nDoc}<br> creato il:${doc.dataDoc}</div><br>
        <span>dettagli: <br> ${doc.dettDoc}</span><br><br>
        <div class="buttF" onclick="$('#${intIdD}').slideToggle('slow', function() {})">Articoli</div><br>
        <div id="${intIdD}" data-dbDoc="${doc._id}" ></div></div><br>
        `);
      $(`#${intIdD}`).hide();
      // ARTICOLI
      doc.articoli.forEach((articolo, indexArt) => {
        const intIdA = `${intIdF}_${indexD}_${indexArt}_art`;
        $(`#${intIdD}`).append(`
          <div id="${intIdA}" class="contA"">
          <div class="tooltip" >
          &#127827;
          <div class="tooltiptext" align="center">
          <span class="ButtA" onclick="engine.removeArt('${indexArt}', '${doc._id}')">&#10060;</span>
          <span class="ButtA" onclick="engine.popUp('${doc._id}', 'modArt', 'fornitore: ${doc.fornitore}, documento: ${doc.nDoc}', '${indexArt}' )">&#9997;</span>
          <span class="ButtA" onclick="engine.popUp('${doc._id}', 'addArt', 'fornitore: ${doc.fornitore}, documento: ${doc.nDoc}')">&#10133;</span>
          </div>
          </div><br><br></div>
          <br>
          `);
        // PEZZI ARTICOLI
        const keyzArt = Object.keys(articolo);
        const valArt = Object.values(articolo);
        keyzArt.forEach((key, index) => {
          if (index === 0) {
            $(`#${intIdA}`).append(`
              <span id="${intIdA}_${key}_${index}">${valArt[index]}</span><br><br>
              `);
          } else{
            $(`#${intIdA}`).append(`
            <span id="${intIdA}_${key}_${index}">${key}: ${valArt[index]}</span><br>
            `); }
        });
      });
    });
    $(`#${id}`).slideUp('slow', () => {}).slideDown('slow', () => {});
    $(`#reduce_${id}`).fadeIn('slow', () => {});
  },
  // FORNITORI
  renderForn: (arrForn) => {
    arrForn.forEach((item, indexForn) => {
      const intIdF = item.documenti[0]._id;

      $('#fornitori').append(`
        <div id="fornitore_${intIdF}" class="contF" align="center">
        <div class="tooltip" >
        &#127826;
        <div class="tooltiptext" align="center">
        <span class="ButtA" onclick="engine.removeForn('${item.fornitore}')">&#10060;</span>
        <span class="ButtA" onclick="engine.popUp('00', 'modForn', '${item.fornitore}')">&#9997;</span>
        </div>
        </div><br><br>
        <div >${item.fornitore}<br> documenti:${item.documenti.length}</div"><br><br>
        <div class="tooltipS" align="center">
        documenti
        <div id="${indexForn}_date_fornitore_${intIdF}" class="tooltiptextS" align="center">
        scegli_data:
        </div>
        </div>
        </div><br>
        <br><div class="docSelect"></div>
        <div id="${intIdF}" class="contDocs"></div>
        <span id="reduce_${intIdF}"  class="buttF" onclick="$('#${intIdF}').slideToggle('slow', function() {}); $('#reduce_${intIdF}').fadeOut('slow', function() {})">&#9757;</span><br>
        </div>
        <br>
        `);
      $(`#fornitore_${intIdF}`).on('mouseleave', () => {
        $('.dateAnno').slideUp('slow', () => {});
      });
      $(`#${intIdF}`).hide();
      $(`#reduce_${intIdF}`).hide();

      const dataDocM = [];
      item.documenti.forEach((docFmA, index) => {
        dataDocM.push(docFmA.dataDoc);
      });
      const dateDocs = [...new Set(dataDocM)];
      const dateGrezze = []
      dateDocs.forEach((data) => {
        let indexDateDiv = 0;
        const dateDiv = [];
        [...data].forEach((piece) => {
          if (piece === '/') { indexDateDiv += 1; } else {
            if (dateDiv[indexDateDiv] === undefined) { dateDiv[indexDateDiv] = ''; }
            dateDiv[indexDateDiv] += piece;
          }
        });
        dateDiv.reverse();
        dateGrezze.push(dateDiv);
      });
      dateGrezze.forEach((itemData) => {
        const elementExists = document.getElementById(`${indexForn}_anno_${itemData[0]}`);
        if (elementExists === null) {
        $(`#${indexForn}_date_fornitore_${intIdF}`).append(`
          <div id="newDoc" class="buttAnno" onclick="$('#${indexForn}_anno_${itemData[0]}').slideToggle('slow', () => {})">
           ${itemData[0]}
           </div>
           <div id="${indexForn}_anno_${itemData[0]}" class="dateAnno">
           </div>`); }
      });
      dateGrezze.forEach((itemData) => {
        const elementExists = document.getElementById(`${indexForn}_anno_${itemData[0]}_mese_${itemData[1]}`);
        if (elementExists === null) {

        $(`#${indexForn}_anno_${itemData[0]}`).append(`
          <div class="bottMese" >
          ${itemData[1]}
          <div id="${indexForn}_anno_${itemData[0]}_mese_${itemData[1]}"class="giorniMese" align="center">
          </div>
          </div>
          `); }
      });
      dateGrezze.forEach((itemData) => {
        $(`#${indexForn}_anno_${itemData[0]}_mese_${itemData[1]}`).append(`
          <span class="buttGiorno" onclick="engine.renderDoc('${itemData[2]}/${itemData[1]}/${itemData[0]}', '${intIdF}', '${item.fornitore}')">${itemData[2]}</span>
          `);
      });
      const totDate = [];
      let selectOp = '';
      totDate.forEach((data) => {
        selectOp += data.struttura;
      });
    });
  },

  docs: {
    converter: (dBarray) => {
      const listaForn = [];
      const temPfornitori = [];
      dBarray.forEach((item) => {
        temPfornitori.push(item.fornitore);
      });
      const fornitori = [...new Set(temPfornitori)];
      const totF = fornitori.map((fornitore) => {
        listaForn.push(fornitore);
        const documenti = [];
        dBarray.forEach((doc) => {
          if (doc.fornitore === fornitore) {
            documenti.push(doc);
          }
        });
        return { fornitore, documenti };
      });
      dataFornitori = totF;
      engine.renderForn(totF);
      engine.renderNewDoc(listaForn);
    },
  },

};
$(document).ready(() => {
const usrTempkey = window.location.href.slice(27);
$.post('/giveMeMyDataBitch', { usrTempkey }, (resp) => {  engine.princ(resp.incoming); });
});
