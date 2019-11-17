
    let someTask = document.querySelector('.inputTask');
    let buttonAdd = document.getElementById('addTask');
    let addSound = document.getElementById("addsound");

    let toDo = {

        notes : [],

        // ADD NOTE

        addTask : function(){
            
            let someTaskValue = someTask.value.trim(); 
            
            let index = this.notes.findIndex((el) => el.taskDiscription === someTaskValue);
            if (index === -1) {
                if (someTaskValue !== ''){
                    addSound.play();

                    this.notes.push({
                        taskId: Math.random().toString(36).substring(2, 8),
                        taskDiscription: someTaskValue,
                        taskStatus: 'pending',
                        timeOfCreation: new Date().getMilliseconds(500)
                        });
        
                        // DOM part
        
                        let $task = document.createElement('li');
                        $task.classList.add('item');
                        const $ul = document.querySelector('.notesList');
                        $ul.append($task);
                        
                        let $textBlock = document.createElement('div');
                        $textBlock.classList.add('textBlock');
                        $task.append($textBlock);
                        $textBlock.innerText = someTaskValue;
        
                        let $buttonsBlock = document.createElement('div');
                        $buttonsBlock.classList.add('buttonsBlock');
                        let $statusButton = document.createElement('button');
                        $statusButton.classList.add('pendingButton');
                        let $editButton = document.createElement('button');
                        $editButton.classList.add('editButton');
                        let $deleteButton = document.createElement('button');
                        $deleteButton.classList.add('delete');
                        
                        $task.append($buttonsBlock);
                        $buttonsBlock.append($statusButton);
                        $buttonsBlock.append($editButton);
                        $buttonsBlock.append($deleteButton);
                        $editButton.innerText = 'E';              
                        $statusButton.innerText = 'S';
                        $deleteButton.innerText = 'D';
        
                        someTask.value = '';
                           
                } else {
                    
                    alert('Нельзя вводить пустую заметку');
                }                

            } else {
                
                alert('Такая заметка уже есть!');
                someTask.value = ''; 
            }
    
        },

        makeItDone: function(task){
            index = this.notes.findIndex((el) => el.taskDiscription === task);
            toDo.notes[index].taskStatus = 'done';
        },

        makeItPending: function(task){
            index = this.notes.findIndex((el) => el.taskDiscription === task);
            toDo.notes[index].taskStatus = 'pending';
        },

        deleteTask: function(task){
            index = this.notes.findIndex((el) => el.taskDiscription === task);
            toDo.notes.splice(index, 1);
        },

        editTask: function(task, newTask){
            index = this.notes.findIndex((el) => el.taskDiscription === task);
            toDo.notes[index].taskDiscription = newTask;
        }
    };

    Object.freeze(toDo);

    const form = document.querySelector('.noteForm');
    form.addEventListener('submit', e => {
        e.preventDefault();
        toDo.addTask();
    });

    const $ul = document.querySelector('.notesList');

    $ul.addEventListener('click', event => {
        $task = event.target.closest('.item');
        let taskBlock = event.target.closest('.buttonsBlock').previousSibling;
        let taskText = taskBlock.innerText;

        if (event.target.className === 'pendingButton'){
            addSound.play()
            toDo.makeItDone(taskText);
            $task.classList.toggle('done');
            event.target.classList.toggle('doneButton');

        } else if (event.target.className === 'pendingButton doneButton'){
            addSound.play()
            toDo.makeItPending(taskText);
            $task.classList.toggle('done');
            event.target.classList.toggle('doneButton');

        } else if (event.target.className === 'delete'){
            let result = confirm('Вы точно хотите удалить заметку?');
            if (result){
                addSound.play();
                toDo.deleteTask(taskText);
                $task.remove();
            }

        } else if (event.target.className === 'editButton') {
            let newText = prompt('Введите новый текст заметки', 'новый текст');
            if (newText !== '') {
                let indexEdition = toDo.notes.findIndex((el) => el.taskDiscription === newText);
                if (indexEdition === -1) {
                    let confirmEdition = confirm('Сохранить изменения?');
                    if (confirmEdition){
                        addSound.play();
                        toDo.editTask(taskText, newText);
                        taskBlock.innerText = newText;
                    }
                } else {
                    alert('Такая заметка уже есть!');
                }   
            } else {
                alert('Нельзя вводить пустую заметку!');
            } 
            
        }
    })

    $hideButton = document.querySelector('#hide');
    $hideButton.addEventListener('click', () => {
        addSound.play();
        if ($ul.className === 'notesList'){
            $hideButton.innerText = 'Show all';
        } else if ($ul.className == 'notesList hidden') {
            $hideButton.innerText = 'Hide all';
        }
        $ul.classList.toggle('hidden');
    })

    

    

    