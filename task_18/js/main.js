
    const someTask = document.querySelector('.inputTask');
    const buttonAdd = document.getElementById('addTask');
    const addSound = document.getElementById("addsound");
    const $ul = document.querySelector('.notesList');
    const isData = localStorage.getItem('notes');

    const todo = {
        tasks : (isData ? (JSON.parse(isData)).tasks : []),
        isShowDone : (isData ? (JSON.parse(isData)).isShowDone : true)
    };
    if (!todo.isShowDone) {
        $ul.classList.add('hidden')
    }

    // NOTES CREATION
    // ---------------------
    // ---------------------

    const creation = function({taskDiscription, taskIsDone}) {
        
        $task = document.createElement('li');
        $task.classList.add('item');
        if (taskIsDone){
            $task.classList.add('done'); 
        }
        $ul.append($task);
        let $textBlock = document.createElement('div');
        $textBlock.classList.add(`textBlock`);
        $task.append($textBlock);
        $textBlock.innerText = `${taskDiscription}`;

        let $buttonsBlock = document.createElement('div');
        $buttonsBlock.classList.add('buttonsBlock');
        let $statusButton = document.createElement('button');
        $statusButton.classList.add(`pendingButton`);
        $statusButton.innerHTML = '&#10008;';
        if (taskIsDone){
            $statusButton.classList.add('doneButton');
            $statusButton.innerHTML = '&#10004;'; 
        }
        let $editButton = document.createElement('button');
        $editButton.classList.add('editButton');
        $editButton.innerHTML = '&#9998;';
        let $deleteButton = document.createElement('button');
        $deleteButton.classList.add('delete');
        $deleteButton.innerHTML = '&#128465;';

        $task.append($buttonsBlock);
        $buttonsBlock.append($statusButton);
        $buttonsBlock.append($editButton);
        $buttonsBlock.append($deleteButton);          
    };
    todo.tasks.forEach(note => (creation(note)));
    let saveToLS = function(key, obj){
        localStorage.setItem(key, JSON.stringify(obj));
    }

    // EVENTS
    // ---------------------
    // ---------------------
    const form = document.querySelector('.noteForm');
    form.addEventListener('submit', e => {
        e.preventDefault();
        let someTaskValue = someTask.value.trim();
        let index = todo.tasks.findIndex((el) => el.taskDiscription === someTaskValue);
        if (index === -1){
            if (someTaskValue !== ''){
                addSound.play();
                creation({
                    taskDiscription: someTaskValue,
                    taskIsDone: false
                });
                someTask.value = '';
                const currentDate = new Date;
                todo.tasks.push({
                    taskId: moment(currentDate).format("x"),
                    taskDiscription: someTaskValue,
                    taskIsDone: false,
                    dateOfCreation: moment(currentDate).format("DD MMM YYYY"),
                    timeOfCreation: moment(currentDate).format("hh:mm")
                });
                saveToLS('notes', todo);
            } else {
                alert('Нельзя вводить пустую заметку');
            }    
        } else {
            alert('Такая заметка уже есть!');
            someTask.value = '';
        }   
    });
    $ul.addEventListener('click', event => {
        $task = event.target.closest('.item');
        let taskBlock = event.target.closest('.buttonsBlock').previousSibling;
        let taskText = taskBlock.innerText;
        if (event.target.className === 'pendingButton'){
            addSound.play()
            index = todo.tasks.findIndex((el) => el.taskDiscription === taskText);
            todo.tasks[index].taskIsDone = true;
            $task.classList.toggle('done');
            event.target.classList.toggle('doneButton');
            event.target.innerHTML = '&#10004;';
            saveToLS('notes', todo);
        } else if (event.target.className === 'pendingButton doneButton'){
            addSound.play()
            index = todo.tasks.findIndex((el) => el.taskDiscription === taskText);
            todo.tasks[index].taskIsDone = false;
            $task.classList.toggle('done');
            event.target.classList.toggle('doneButton');
            event.target.innerHTML = '&#10008;';
            saveToLS('notes', todo);
        } else if (event.target.className === 'delete'){
            let result = confirm('Вы точно хотите удалить заметку?');
            if (result){
                addSound.play();
                index = todo.tasks.findIndex((el) => el.taskDiscription === taskText);
                todo.tasks.splice(index, 1);
                $task.remove();
                saveToLS('notes', todo);
            }
        } else if (event.target.className === 'editButton') {
            let newText = prompt('Введите новый текст заметки', 'новый текст');
            if (newText !== '') {
                let indexEdition = todo.tasks.findIndex((el) => el.taskDiscription === newText);
                if (indexEdition === -1) {
                    let confirmEdition = confirm('Сохранить изменения?');
                    if (confirmEdition){
                        addSound.play();
                        index = todo.tasks.findIndex((el) => el.taskDiscription === taskText);
                        todo.tasks[index].taskDiscription = newText;
                        taskBlock.innerText = newText;
                        saveToLS('notes', todo);
                    }
                } else {
                    alert('Такая заметка уже есть!');
                }   
            } else {
                alert('Нельзя вводить пустую заметку!');
            }       
        }
    });

    // HIDE/SHOW BUTTON
    // ---------------------
    // ---------------------
    $hideButton = document.querySelector('#hide');
    $hideButton.addEventListener('click', () => {
        addSound.play();
        if ($ul.className === 'notesList'){
            $hideButton.innerText = 'Show done';
            todo.isShowDone = false;
            saveToLS('notes', todo);
        } else if ($ul.className == 'notesList hidden') {
            $hideButton.innerText = 'Hide done';
            todo.isShowDone = true;
            saveToLS('notes', todo);
        }
        $ul.classList.toggle('hidden');
    });