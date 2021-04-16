"use strict";

const coffeeButtons = document.querySelectorAll(".coffee-item");
const balance = document.getElementById("balance");
const displayText = document.getElementById("display-text");

for (let button of coffeeButtons) {
  button.onclick = buyCoffee;
}

function buyCoffee() {
  let coffeeName = this.getAttribute("name");
  let coffeePrice = +this.getAttribute("cost");
  if (+balance.value < coffeePrice) {
    displayText.innerHTML = "Недостаточно средств";
    balance.style.backgroundColor = "#ff9999";
  } else {
    balance.style.backgroundColor = "";
    balance.value -= coffeePrice;
    displayText.innerHTML = `Ваш ${coffeeName} готовится`;
  }
}


