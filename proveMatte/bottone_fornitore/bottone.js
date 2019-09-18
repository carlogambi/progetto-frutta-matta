
const prova = [
  { _id: '5d4ed5183d875f0ce0857de9', fornitore: 'cammisa' },
  { _id: '5d4ed51b3d875f0ce0857dea', fornitore: 'uella bello' },
  { _id: '5d4ed318b908023ce8e7d1f2', fornitore: 'fornitore prova' },
  { _id: '5d4ed7fd59e8772a9c84ec91', fornitore: 'mi prova' },
  { _id: '5d4ed80359e8772a9c84ec92', fornitore: 'crissttto' },
  { _id: '5d4ed80859e8772a9c84ec94', fornitore: 'prova2' },
  { _id: '5d4ed870723ca326c4da221a', fornitore: 'minininedsifnksdufn' },
  { _id: '5d4f0a6bf11c0c1dece1f48e', fornitore: 'èèèèèèèèèè' }];

// Bottone fornitore
const heo = {};
heo.bottoni = {};
heo.bottoni.elimina = (item) => {};
heo.bottoni.modifica = (item) => {};
heo.bottoni.getId = () => Math.floor(Math.random() * (999999999 - 100000000)) + 100000000;
heo.bottoni.creaB = (text) => {
  const id = heo.bottoni.getId();
  $('.contFlexBott').append(`
      <div id="buntonA${id}" class="buntonA buntonAP" data-id="${text._id}">
      <span id="buttE${id}" class="bCanc" onClick="heo.bottoni.elimina()" ><sub>delete</sub></span>
      <span id="subCont${id}" class="cont"><span class="span" id="contTxt${id}" onClick="fornSel(${text.fornitore},${id})">${text.fornitore.toUpperCase()}</span></span>
      <span id="buttM${id}" class="bMod" onClick="heo.bottoni.modF.s1('${text.fornitore}', '${id}')"><sup>edit</sup></span>
      </div>`);
};

heo.bottoni.modF = {};

heo.bottoni.modF.s1 = (item, id) => {
  $(`#buntonA${id}`).removeClass('buntonAP');
  $(`#contTxt${id}`).remove(); $(`#buttM${id}`).remove();
  $(`#subCont${id}`).append(`>|<span id="input${id}"class='inputBa' contenteditable>${item.toUpperCase()}</span>`);
  $(`#subCont${id}`).after(`<span id="buttMV${id}" class="bVer" onClick="heo.bottoni.modF.s2('${item}', '${id}')"> v</span>`);
};
heo.bottoni.modF.s2 = (item, id) => {
  $(`#buntonA${id}`).addClass('buntonAP');
  console.log('step 2 riuscito');
  console.log(item);
  console.log(id);
  const nN = $(`#input${id}`).text();
  console.log(nN);
  $(`#buntonA${id}`).empty().append(`
  <span id="buttE${id}" class="bCanc" onClick="heo.bottoni.elimina(${item},${id} )" ><sub>delete</sub></span>
  <span id="subCont${id}" class="cont" data-text="${item}"><span id="contTxt${id}" class="span" onClick="fornSel(${item},${id})">${nN.toUpperCase()}</span></span>
  <span id="buttM${id}" class="bMod" onClick="heo.bottoni.modF.s1('${item}', '${id}')"><sup>edit</sup></span>
  `);
};

$(document).ready(() => {
  prova.forEach((item) => { heo.bottoni.creaB(item); });
  console.log(heo.bottoni.getId());
});
// Bottone fornitore
// Dettagli fornitore
function fornSel(item,id){

};
