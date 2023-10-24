﻿const uri = 'api/todo';
let todos = [];

function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
    
    const addNameTextbox = document.getElementById('add-name');
    const errorMessage = document.getElementById('error-message');

    const item = {
        isComplete: false,
        name: addNameTextbox.value.trim()
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => {
            console.error('An error occurred:', error);
            errorMessage.innerText = 'An error occurred. Please try again.';
            errorMessage.style.display = 'block';
        });
;
}

function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
    const item = todos.find(item => item.id === id);

    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isComplete').checked = item.isComplete;
    document.getElementById('editForm').style.display = 'block';
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId, 10),
        isComplete: document.getElementById('edit-isComplete').checked,
        name: document.getElementById('edit-name').value.trim()
    };

    fetch(`${uri}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

function markAsCompleted(id) {
    fetch(`${uri}/${id}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isComplete: true })
    })
        .then(function (response) {
            if (response.ok) {
                console.log('Todo item marked as completed succesfull');

            }
            else {
                console.error('Error marking todo item as completed');
            }
        })
        .then(() => getItems())
        //.then(function (data) {
        //    console.log(data); // Log the response
        //    _displayItems(data); // Update the UI after marking as completed
        //})
        .catch(function (error) {
            console.error('Error: ', error);
        });
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function _displayCount(totalItems, completedItems) {
    const totalName = (totalItems === 1) ? 'to-do' : 'to-do\'s';
    const completedName = (completedItems === 1) ? 'to-do is' : 'to-do\'s are';

    document.getElementById('counter').innerText = `${totalItems} ${totalName} of which ${completedItems} ${completedName} completed`;
}

function _displayItems(data) {
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';

    const totalTodos = data.length;
    const completedTodos = data.filter(item => item.isComplete).length;

    _displayCount(totalTodos,completedTodos);

    const button = document.createElement('button');

    console.log(data);

    data.forEach(item => {
        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.disabled = true;
        isCompleteCheckbox.checked = item.isComplete;
        isCompleteCheckbox.style.display = 'block';
        isCompleteCheckbox.style.margin = 'auto';

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

        let completeButton = button.cloneNode(false);
        completeButton.innerHTML = '&#10003;';
        completeButton.style.color = 'green';
        completeButton.setAttribute('onclick', `markAsCompleted(${item.id})`);

        let tr = tBody.insertRow();
        tr.classList.add(item.isComplete ? 'completed' : 'not-completed');


        let td2 = tr.insertCell(0); 
        let textNode = document.createTextNode(item.name);
        td2.appendChild(textNode);

        let td1 = tr.insertCell(1); 
        td1.appendChild(isCompleteCheckbox);

        let td5 = tr.insertCell(2); 
        td5.appendChild(completeButton);

        let td3 = tr.insertCell(3); 
        td3.appendChild(editButton);

        let td4 = tr.insertCell(4);
        td4.appendChild(deleteButton);
 
    });

    todos = data;
}