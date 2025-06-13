const button = document.getElementById("how-to-play-button");
const popup = document.getElementById("play-popup");
let pageOneButton = document.getElementById("page-one-button");
let pageTwoButton = document.getElementById("page-two-button");
const pageOne = document.getElementById("page-one");
const pageTwo = document.getElementById("page-two");
const closeX = document.getElementById("close-play-popup");

// Open game instructions
button.addEventListener("click", () => {
    popup.style.display = "block";
    pageOne.style.display = "block";
    pageTwo.style.display = "none";
    pageOneButton.style.backgroundColor = "#5dbb63";
    pageTwoButton.style.backgroundColor = "#52a157";  
    pageOneButton.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
    pageTwoButton.style.boxShadow = "none"; 
});

// Change to home page instructions
pageOneButton.addEventListener("click", () => {
    pageOneButton.style.backgroundColor = "#5dbb63";
    pageTwoButton.style.backgroundColor = "#52a157";
    pageOneButton.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
    pageTwoButton.style.boxShadow = "none";
    pageOne.style.display = "block";
    pageTwo.style.display = "none";
    pageOne.style.zIndex = "5";
    pageTwo.style.zIndex = "0";

});

// Change to town square page instructions
pageTwoButton.addEventListener("click", () => {
    pageOneButton.style.backgroundColor = "#52a157";
    pageTwoButton.style.backgroundColor = "#5dbb63";
    pageOneButton.style.boxShadow = "none";
    pageTwoButton.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
    pageOne.style.display = "none";
    pageTwo.style.display = "block";
    pageOne.style.zIndex = "0";
    pageTwo.style.zIndex = "5";
});

// Close popup
closeX.addEventListener("click", () => {
    popup.style.display = "none";
});