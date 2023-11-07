$(document).ready(async() => {
    setDefaultDate();
    await loadAllCategories();
    await loadAllItems();
});

async function addItemCount(item){
    // increase the item quantity 
    // update the item quantity in the database
    let count = parseInt(item.querySelector('.item-quantity').innerHTML) 
    $.ajax({
        url: '/items/changeItem',
        method: 'POST',
        data: {
            name: item.id,
            count: count + 1
        },
        datatype: 'json',
        success: function(){
            item.querySelector('.item-quantity').innerHTML = count + 1;
        },
        error: function(err){
            alert('Error adding item');
        }
    });
}

async function removeItemCount(item){
    // decrease the item quantity
    // update the item quantity in the database
    let count = parseInt(item.querySelector('.item-quantity').innerHTML)
    if (count - 1 == 0){
        // remove the item from the list
        item.remove();
    }
    $.ajax({
        url: '/items/changeItem',
        method: 'POST',
        data: {
            name: item.id,
            count: count - 1
        },
        datatype: 'json',
        success: function(){
            item.querySelector('.item-quantity').innerHTML = count - 1;
        },
        error: function(err){
            alert('Error removing item');
        }
    });
}

async function addItem(){
    let name = document.getElementById('item-name').value;
    let quantity = document.getElementById('item-quantity').value;
    let type = document.getElementById('item-category').value;
    let date = document.getElementById('item-date').value;
    $.ajax({
        url: '/items/addItem',
        method: 'POST',
        data: {
            name: name,
            count: quantity,
            type: type,
            date: date,
        },
        datatype: 'json',
        success: function(response){
            if(response){
                // item aready exists, update the item quantity
                let item = document.getElementById(name);
                let count = parseInt(item.querySelector('.item-quantity').innerHTML);
                item.querySelector('.item-quantity').innerHTML = count + parseInt(quantity);
                // close the modal
                $('#itemModal').modal('hide');
                return;
            }
            // item does not exist, create a new item
            let item = createItem(name, quantity, date);
            document.getElementById(type).appendChild(item);
            // close the modal
            $('#itemModal').modal('hide');
        },
        error: function(err){
            alert('Error adding item');
        }
    });
}

async function addCategory(){
    let name = document.getElementById('category-name').value;
    $.ajax({
        url: '/items/addCategory',
        method: 'POST',
        data: {
            name: name
        },
        datatype: 'json',
        success: function(response){
            if(response){
                // category already exists
                alert('Category already exists');
                return;
            }
            // reload the page to display the new category
            location.reload();
        }
    });
}

function setDefaultDate(){
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var today = date.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0'+ day : day);
    document.getElementById('item-date').value = today;
}

async function loadAllCategories(){
    $.ajax({
        url: '/items/getAllCategories',
        method: 'GET',
        datatype: 'json',
        success: function(data){
            data.forEach(category => {
                // Load the category section
                let option = document.createElement('button');
                option.classList.add('item-header')
                option.type = 'button';
                // add data-bs-toggle and data-bs-target to make the button a dropdown
                option.setAttribute('data-bs-toggle', 'collapse');
                option.setAttribute('data-bs-target', '#' + category.name);
                option.setAttribute('aria-expanded', 'false');
                option.setAttribute('aria-controls', category.name);

                let optionName = document.createElement('p');
                optionName.innerHTML = category.name;
                option.appendChild(optionName);

                let items = document.createElement('div');
                items.classList.add('items');
                items.classList.add('collapse');
                items.classList.add('show');
                items.id = category.name;

                document.getElementById('item-container').appendChild(option);
                document.getElementById('item-container').appendChild(items);

                // Load the category selection
                let categoryOption = document.createElement('option');
                categoryOption.value = category.name;
                categoryOption.innerHTML = category.name;
                document.getElementById('item-category').appendChild(categoryOption);
            })
        },
        error: function(err){
            console.log(err);
        }
    })
}

async function loadAllItems(){
    $.ajax({
        url: '/items/getAllItems',
        method: 'GET',
        datatype: 'json',
        success: function(data){
            data.forEach(element => {
                // create div for item
                if (element.count == 0){
                    return;
                }
                let date = element.date.split('T')[0];
                let item = createItem(element.name, element.count, date);
                document.getElementById(element.type).appendChild(item);

            });
        },
        error: function(err){
            console.log(err);
        }
    });
}

function createItem(name, count, date){
    let item = document.createElement('div');
    item.classList.add('item');
    item.id = name;
    let itemName = document.createElement('p');
    itemName.classList.add('item-name');
    itemName.innerHTML = name;

    let itemDate = document.createElement('p');
    itemDate.classList.add('item-date');
    // Only need to display the date, not the time
    itemDate.innerHTML = date;

    let itemQuantityContainer = document.createElement('div');
    itemQuantityContainer.classList.add('item-quantity-container');

    let itemQuantityBtnMinus = document.createElement('button');
    itemQuantityBtnMinus.classList.add('item-quantity-btn');

    let biDashCircle = document.createElement('i');
    biDashCircle.classList.add('bi');
    biDashCircle.classList.add('bi-dash-circle');

    let itemQuantity = document.createElement('p');
    itemQuantity.classList.add('item-quantity');
    itemQuantity.innerHTML = count;

    let itemQuantityBtnPlus = document.createElement('button');
    itemQuantityBtnPlus.classList.add('item-quantity-btn');

    itemQuantityBtnMinus.addEventListener('click', () => {
        removeItemCount(item);
    });
    itemQuantityBtnPlus.addEventListener('click', () => {
        addItemCount(item);
    });

    let biPlusCircle = document.createElement('i');
    biPlusCircle.classList.add('bi');
    biPlusCircle.classList.add('bi-plus-circle');

    itemQuantityBtnMinus.appendChild(biDashCircle);
    itemQuantityBtnPlus.appendChild(biPlusCircle);

    itemQuantityContainer.appendChild(itemQuantityBtnMinus);
    itemQuantityContainer.appendChild(itemQuantity);
    itemQuantityContainer.appendChild(itemQuantityBtnPlus);

    item.appendChild(itemName);
    item.appendChild(itemDate);
    item.appendChild(itemQuantityContainer);
    return item;
}