
const allTable = document.getElementById('shipsTable');
const sortedButton = document.querySelector('.sort');
const moreButton = document.querySelector('.more');

const films = fetch('https://swapi.co/api/films/');
const ships = fetch('https://swapi.co/api/starships/');

let filmsData;
let shipsData;
let arrExclude = ['MGLT', 'created', 'edited', 'url', 'pilots', 'max_atmosphering_speed'];

function starShips(data, filmsList, exclude) {
                
    data.results.forEach(function(el){
        const tableRow = document.createElement('tr');
        Object.keys(el).forEach(key =>{
            if (exclude.includes(key)){
                delete el[key]
            }
        })       

        for (let key in el){
            if (key === 'films'){
                const td = document.createElement('td');
                td.innerText = el[key].reduce(function(ac, elem){
                    filmsList.results.forEach(function(el){
                        if (el.url === elem){
                            ac.push(el.title);
                        }
                    })
                    return ac;
                },[]);
                tableRow.append(td);
            } else {
                const td = document.createElement('td');
                td.innerText = el[key];
                tableRow.append(td);
            } 
        }
        allTable.append(tableRow);
    })
}

Promise.all([films, ships]).then(values => {
    let [filmsData, shipsData] = values;
    filmsData.json().then(respF => {
        filmsData = respF;
        shipsData.json().then(respS => {
            shipsData = respS;

            let renderTableHead = function(){
                const tableRow = document.createElement('tr');
                Object.keys(shipsData.results[0]).forEach(key =>{
                    if (arrExclude.includes(key)){
                        delete shipsData.results[0][key]
                    }
                })

                for (let key in shipsData.results[0]){
                    const td = document.createElement('th');
                    console.log(key)
                    td.innerText = key;
                    tableRow.append(td);
                    }
                allTable.append(tableRow);
            }

            renderTableHead();
            starShips(shipsData, filmsData, arrExclude);

            moreButton.onclick = function(){
                if (shipsData.next){

                    fetch(shipsData.next).then(response => {
                        response.json().then(resp => {
                            shipsData = resp;
                            starShips(shipsData, filmsData, arrExclude);
                        })
                    })
                }
            }
            
            sortedButton.style.backgroundColor = 'darkblue';
            let toggleSort = 0;
            sortedButton.onclick = function(){
                if (toggleSort === 0){
                    toggleSort = 1;
                    let sortedRows = Array.from(allTable.rows).slice(1)
                    .sort((rowA, rowB) => rowA.cells[0].innerHTML > rowB.cells[0].innerHTML ? 1 : -1);
                    allTable.append(...sortedRows);
                } else {
                    toggleSort = 0;
                    let sortedRows = Array.from(allTable.rows).slice(1)
                    .sort((rowA, rowB) => rowA.cells[0].innerHTML < rowB.cells[0].innerHTML ? 1 : -1);
                    allTable.append(...sortedRows);
                }   
            }
        })  
    });
  });


