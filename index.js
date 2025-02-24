import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-bc8fb-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")


const addBtn = document.getElementById('add_btn')
const inputField = document.getElementById('input_field')
const shoppingListEl = document.getElementById('shopping_list')


addBtn.addEventListener('click', function() {

    let inputValue = inputField.value
    push(shoppingListInDB, inputValue)
    
    //appendItemToShoppingList(inputValue) //appends it the second time - redundant
    clearInputField()
})

//  whenever database is changed this code runs - every time I add or delete items
onValue(shoppingListInDB, function(snapshot) {
    
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        clearShoppingListEl()

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingList(currentItem) //appending to output
        } 

    } else {
        //shoppingListEl.textContent = "No items here...yet."
    }

})


function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputField() {
    inputField.value = ""
}

function appendItemToShoppingList(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")

    newEl.textContent = itemValue

    newEl.addEventListener('click', function() {

        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)

    })

    shoppingListEl.append(newEl)
}

