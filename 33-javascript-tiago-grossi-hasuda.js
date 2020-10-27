(function(DOM, win, doc) {
  'use strict';

  /*
  Vamos estruturar um pequeno app utilizando módulos.
  Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
  A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
  seguinte forma:
  - No início do arquivo, deverá ter as informações da sua empresa - nome e
  telefone (já vamos ver como isso vai ser feito)
  - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
  um formulário para cadastro do carro, com os seguintes campos:
    - Imagem do carro (deverá aceitar uma URL)
    - Marca / Modelo
    - Ano
    - Placa
    - Cor
    - e um botão "Cadastrar"
  Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
  carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
  aparecer no final da tabela.
  Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
  empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
  Dê um nome para a empresa e um telefone fictício, preechendo essas informações
  no arquivo company.json que já está criado.
  Essas informações devem ser adicionadas no HTML via Ajax.
  Parte técnica:
  Separe o nosso módulo de DOM criado nas últimas aulas em
  um arquivo DOM.js.
  E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
  que será nomeado de "app".
  */
  var ajax = new XMLHttpRequest();
  var $enterprise = DOM('[data-js=enterprise]');

  var $image = DOM('[data-js=carUrl]');
  var $model = DOM('[data-js=model]');
  var $year = DOM('[data-js=year]');
  var $plate = DOM('[data-js=plate]');
  var $color = DOM('[data-js=color]');
  var $carTable = DOM('[data-js=carTable]');
  
  function initialize() {
    ajax.addEventListener('readystatechange', ajaxStateChange, false)
    return getEnterpriseName();
  }

  function getEnterpriseName() {
    ajax.open('GET', 'company.json');
    return ajax.send();
  }

  function ajaxStateChange() {
    if (isReady(ajax))
      return setEnterpriseName();
    return false;
  }

  function isReady(req) {
    if (req.readyState === 4 && req.status === 200)
      return true;
    return false;
  }

  function setEnterpriseName() {
    try{
      var enterprise = JSON.parse(ajax.responseText);
      return $enterprise.get().innerText = `${enterprise.name} - ${enterprise.phone}`;
    }
    catch (e) {
      return console.log('Unable to get enterprise info!', e);
    }
  }

  initialize();

  function app() {
    var $form = DOM('[data-js=inputForm]');
    var postCar = new XMLHttpRequest();
    var getCars = new XMLHttpRequest();
    var deleteCar = new XMLHttpRequest();
    var defaultTable = `<tr>
    <th>Imagem</th>
    <th>Modelo</th>
    <th>Ano</th>
    <th>Placa</th>
    <th>Cor</th>
    <th>Opções</th>
  </tr>`;

    function initApp() {
      postCar.addEventListener('readystatechange', postStateChange, false);
      getCars.addEventListener('readystatechange', getStateChange, false);
      deleteCar.addEventListener('readystatechange', deleteStateChange, false);
      listCars();
      return $form.get().addEventListener('submit', registerCar, false);
    }

    function postStateChange() {
      if(isReady(postCar))
        return listCars();
      return false;
    }

    function getStateChange() {
      if(isReady(getCars))
        return addToTable();
      return false;
    }

    function deleteStateChange() {
      if(isReady(deleteCar))
        return listCars();
      return false;
    }

    function registerCar(event) {
      event.preventDefault();
      return postNewCar();
    }

    function postNewCar() {
      postCar.open('POST', 'http://localhost:3000/car');
      postCar.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded'
      );
      return postCar.send(`image=${$image.get().value}&brandModel=${$model.get().value}&year=${$year.get().value}&plate=${$plate.get().value}&color=${$color.get().value}`);
    }

    function listCars() {
      getCars.open('GET', 'http://localhost:3000/car');
      getCars.send();
    }
    
    function addToTable() {
      try{
        clearCarTable();
        var cars = JSON.parse(getCars.responseText);
        cars.forEach((item) => {
          $carTable.get().appendChild(createNewElement(item));
        });
      }
      catch(e) {
        return console.log(e);
      }
    }

    function clearCarTable() {
      return $carTable.get().innerHTML = defaultTable;
    }

    function createNewElement(car) {
      var newCar = doc.createDocumentFragment();
      var newRow = doc.createElement('tr');
      var newImg = doc.createElement('td');
      newImg.innerText = car.image;
      var newModel = doc.createElement('td');
      newModel.innerText = car.brandModel;
      var newYear = doc.createElement('td');
      newYear.innerText = car.year;
      var newPlate = doc.createElement('td');
      newPlate.innerText = car.plate;
      var newColor = doc.createElement('td');
      newColor.innerText = car.color;
      var newRemove = doc.createElement('td');
      var newBtn = doc.createElement('button');
      newBtn.textContent = 'Remover';
      newBtn.addEventListener('click', removeCar, false);
      newRemove.appendChild(newBtn);

      newRow.appendChild(newImg);
      newRow.appendChild(newModel);
      newRow.appendChild(newYear);
      newRow.appendChild(newPlate);
      newRow.appendChild(newColor);
      newRow.appendChild(newRemove);
      newCar.appendChild(newRow);
      return newCar;
    }

    function removeCar() {
      var $rmCar = this.parentNode.parentNode;
      var $rmPlate = $rmCar.children[3].textContent;
      funcDeleteCar($rmPlate);
    }

    function funcDeleteCar(_plate) {
      deleteCar.open('DELETE', 'http://localhost:3000/car');
      deleteCar.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded'
      );
      deleteCar.send(`plate=${_plate}`);
    }

    initApp();
  }

  app();

}(window.DOM, window, document));
