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