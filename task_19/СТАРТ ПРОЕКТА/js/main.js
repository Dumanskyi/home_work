

let currencyListIN = document.querySelector('.currencyIN');
let currencyListOUT = document.querySelector('.currencyOUT');
let convertButton = document.querySelector('.convert');
let text = document.querySelector('.text');
let inputUAH = document.querySelector('.inputUAH');
let currencyOUT = document.querySelector('.currencyOUT')

function foo(){
    if (xhr.status === 200){
        const data = JSON.parse(xhr.responseText);
        data.unshift({
            "r030":000,"txt":"Українська гривня","rate":1,"cc":"UAH","exchangedate":"11.11.2019"
        })
        data.forEach(function(el){
            const currensyItemIN = document.createElement('option');
            const currensyItemOUT = document.createElement('option');
            currensyItemIN.innerText = el.txt;
            currensyItemOUT.innerText = el.txt;
            currencyListIN.append(currensyItemIN);
            currencyListOUT.append(currensyItemOUT);
            
        });


        convertButton.onclick = function(){
           let indexIN = data.findIndex((el) => el.txt === currencyListIN.value);
           let indexOUT = data.findIndex((el) => el.txt === currencyListOUT.value);
           let result = `${inputUAH.value * (data[indexIN].rate) / (data[indexOUT].rate)}`;
           text.innerText = `${result}`;
        }
    }
};



const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://old.bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
xhr.send();
xhr.onload = foo;