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
    if (isReady())
      return setEnterpriseName();
    return false;
  }

  function isReady() {
    if (ajax.readyState === 4 && ajax.status === 200)
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

    function initApp() {
      return $form.get().addEventListener('submit', registerCar, false);
    }

    function registerCar(event) {
      event.preventDefault();
      return $carTable.get().appendChild(createNewElement());
    }

    function createNewElement() {
      var newCar = doc.createDocumentFragment();
      var newRow = doc.createElement('tr');
      var newImg = doc.createElement('td');
      newImg.innerText = $image.get().value;
      var newModel = doc.createElement('td');
      newModel.innerText = $model.get().value;
      var newYear = doc.createElement('td');
      newYear.innerText = $year.get().value;
      var newPlate = doc.createElement('td');
      newPlate.innerText = $plate.get().value;
      var newColor = doc.createElement('td');
      newColor.innerText = $color.get().value;
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
      var $car = this.parentNode.parentNode;
      $carTable.get().removeChild($car);
    }

    initApp();

    return {
      registerCar: registerCar
    }
  }

  win.app = app();
}(window.DOM, window, document));