
const allTable = document.getElementById('shipsTable');
const sortedButton = document.querySelector('.sort');

const xhr = new XMLHttpRequest();
let filmsData;
let arrExclude = ['MGLT', 'created', 'edited', 'url', 'pilots', 'max_atmosphering_speed'];

const xhr2 = new XMLHttpRequest();
    xhr2.open('GET', 'https://swapi.co/api/films/');
    xhr2.send();
    xhr2.onload = function() {
        getfilms(xhr2.responseText);
    };

function getfilms(dataFilms){
    if (xhr2.status === 200){
        filmsData = JSON.parse(dataFilms);
        xhr.open('GET', 'https://swapi.co/api/starships/');
        xhr.send();
        xhr.onload = function() {
            renderHead(xhr.responseText, arrExclude);
        };
    }
}

function renderHead(data, exclude){
    if (xhr.status === 200){
        table = JSON.parse(data);
        let badabum = function(){
            console.log(table.results);
            const tableRow = document.createElement('tr');
            Object.keys(table.results[0]).forEach(key =>{
                if (exclude.includes(key)){
                    delete table.results[0][key]
                }
            })

            for (let key in table.results[0]){
                const td = document.createElement('th');
                console.log(key)
                td.innerText = key;
                tableRow.append(td);
                }
            allTable.append(tableRow);
            }
        badabum();
        starShips(data, exclude);
    }
}

function starShips(data, exclude){
    let table;

    if (xhr.status === 200){
        table = JSON.parse(data);
        
        table.results.forEach(function(el){
            const tableRow = document.createElement('tr');
            Object.keys(el).forEach(key =>{
                if (arrExclude.includes(key)){
                    delete el[key]
                }
            })       

            for (let key in el){
                if (key === 'films'){
                    const td = document.createElement('td');
                    td.innerText = el[key].reduce(function(ac, elem){
                        filmsData.results.forEach(function(el){
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
        
        if (table.next){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', table.next);
        xhr.send();
        xhr.onload = function(){
            starShips(xhr.responseText, arrExclude);
            };
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
}


