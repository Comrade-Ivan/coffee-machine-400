"use strict";

let state = "idle" //"cooking", "ready";

const coffeeButtons = document.querySelectorAll(".coffee-item");
const balance = document.getElementById("balance");
const displayText = document.getElementById("display-text");
const progressBar = document.getElementById("progress");
const coffeeCup = document.getElementById("coffee-cup");

for (let button of coffeeButtons) {
  button.onclick = buyCoffee;
}

function buyCoffee() {
  if (state != "idle") return;

  let coffeeName = this.getAttribute("name");
  let coffeePrice = +this.getAttribute("cost");
  const coffeeImage = this.querySelector("img");
  let coffeeImageSrc = coffeeImage.src;

  if (+balance.value < coffeePrice) {
    displayText.innerHTML = "Недостаточно средств";
    balance.style.backgroundColor = "#ff9999";
  } else {
    balance.style.backgroundColor = "";
    balance.value -= coffeePrice;
    displayText.innerHTML = `Ваш ${coffeeName} готовится`;
    cookCoffee(coffeeName, coffeeImageSrc);
  }
}

function cookCoffee(coffeeName, coffeeImageSrc) {
  state = "cooking";

  progressBar.classList.remove("d-none");
  coffeeCup.classList.remove("d-none");
  coffeeCup.src = coffeeImageSrc;

  let progress = 0;
  let progressInterval = setInterval(function() {
    if(progress == 100) {
      clearInterval(progressInterval);
      displayText.innerHTML = `Ваш ${coffeeName} готов`;
      coffeeCup.onclick = takeCoffee;
      state = "ready";
    } else {
      progress++;
      progressBar.firstElementChild.style.width = progress + "%";
      coffeeCup.style.opacity = progress + "%";
    }
  }, 100)
}

function takeCoffee() {
  if (state != "ready") return;
  progressBar.classList.add("d-none");
  progressBar.firstElementChild.style.width = "";

  coffeeCup.classList.add("d-none");
  coffeeCup.style.opacity = "";
  coffeeCup.onclick = null; //сбрасываем событие

  displayText.innerHTML = "Выберите кофе";

  state = "idle";
}

const changeBtn = document.getElementById("change-btn");
changeBtn.onclick = takeChange;

function takeChange() {
  if (balance.value >= 10) {
    balance.value -= 10;
    createCoin("10");
    setTimeout(() => { //Откладываем выдачу следующей монетки
      takeChange();
    }, 300);
  } else if (balance.value >= 5) {
    balance.value -= 5;
    createCoin("5");
    setTimeout(() => {
      takeChange();
    }, 300);
  } else if (balance.value >= 2) {
    balance.value -= 2;
    createCoin("2");
    setTimeout(() => {
      takeChange();
    }, 300);
  } else if (balance.value >= 1) {
    balance.value -= 1;
    createCoin("1");
    setTimeout(() => {
      takeChange();
    }, 300);
  }
}

function createCoin(nominal) {

  let coinSrc = "";
  let value = 0;
  switch (nominal) {
    case "10":
      coinSrc = "./img/10rub.png";
      value = 10;
      break;
    case "5":
      coinSrc = "./img/5rub.png";
      value = 5;
      break;
    case "2":
      coinSrc = "./img/2rub.png";
      value = 2;
      break;
    case "1":
      coinSrc = "./img/1rub.png";
      value = 1;
      break;
    default:
      console.error("Такой монеты не существует");
  }

  const changeContainer = document.getElementById("change-container");
  const changeContainerCoords = changeContainer.getBoundingClientRect();

  const coin = document.createElement("img");
  coin.setAttribute("src", coinSrc);
  coin.setAttribute("value", value);
  coin.className = "coin";

  coin.style.top = Math.floor(Math.random() * (changeContainerCoords.height - 52)) + "px";
  coin.style.left = Math.floor(Math.random() * (changeContainerCoords.width - 52)) + "px";

  changeContainer.append(coin);

  coin.onclick = function() {
    this.remove(); //Удаляет элемент
  }
  coin.onmousedown = dragBill;

  //Анимируем падение монеты
  // setTimeout(() => {
  //   coin.style.opacity = "100%";
  //   coin.style.transform = "translateY(0)";
  // }, 30);
  requestAnimationFrame(() => { //срабатывает перед рэндером
    coin.style.opacity = "100%";
    coin.style.transform = "translateY(0)";
  })
}

//Drag'n'Drop
const bills = document.querySelectorAll(".wallet img");
for (const bill of bills) {
  bill.onmousedown = dragBill;
}

function dragBill(event) {
  event.preventDefault();

  const bill = this;
  document.body.append(bill);
  
  const billCoords = bill.getBoundingClientRect();
  bill.style.position = "absolute";
  bill.style.transform = "rotate(90deg)";
  
  bill.style.top = event.clientY - billCoords.height/2 + "px";
  bill.style.left = event.clientX - billCoords.width/2 + "px";

  function onMouseMove(event) {
    bill.style.top = event.clientY - billCoords.height/2 + "px";
    bill.style.left = event.clientX - billCoords.width/2 + "px";
  }

  document.addEventListener("mousemove", onMouseMove);

  bill.onmouseup = function(event) {
    document.removeEventListener("mousemove", onMouseMove);
    bill.onmouseup = null;

    bill.hidden = true;
    const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    bill.hidden = false;
    bill.style.transform = "rotate(0deg)";
    if ( elemBelow.classList.contains("bill-acc") ) {
      let value = +bill.getAttribute("value");
      balance.value = +balance.value + value;
      bill.remove();
    }
  }
}