const db = firebase.firestore()
let tasks = []
let currentuser = {}

function getUser() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            currentuser.uid = user.uid
            readTasks()
            let userLabel = document.getElementById('email')
            userLabel.innerHTML = user.email
        } else {
            swal.fire({
                icon: 'warning',
                title: 'Você Será Redirecionado Para a Tela de Login',
            }) .then(() => {
                setTimeout(() => {
                    window.location.replace('login.html')
                }, 1000)
            })
        }
    })
}

function createDelButton(task) {
    const newbutton = document.createElement('button')
    newbutton.setAttribute('class', 'btn btn-primary')
    newbutton.appendChild(document.createTextNode('Excluir'))
    newbutton.setAttribute('onclick', `deletetask("${task.id}")`)
    return newbutton
}

function renderTasks() {
    let itemlist = document.getElementById('itemlist')
    itemlist.innerHTML = ''
    for (let task of tasks) {
        const newitem = document.createElement('li')
        newitem.setAttribute('class', 'list-group-item d-flex justify-content-between me-4')
        newitem.appendChild(document.createTextNode(task.title))
        newitem.appendChild(createDelButton(task))
        itemlist.appendChild(newitem)
    }
}

async function readTasks() {
    tasks = []
    const logTasks = await db.collection('tasks').where('owner', '==', currentuser.uid).get()
    for (doc of logTasks.docs) {
        tasks.push({
            id: doc.id,
            title: doc.data().title,
        })
    }
    renderTasks()
}

async function deletetask(id) {
    await db.collection('tasks').doc(id).delete()
    readTasks()
}

async function addTask() {
    const itemlist = document.getElementById('itemlist')
    const newitem = document.createElement('li')
    newitem.setAttribute('class', 'list-group-item')
    newitem.appendChild(document.createTextNode('Gravando na nuvem...'))
    itemlist.appendChild(newitem)

    const title = document.getElementById('adcta').value
    await db.collection('tasks').add({
        title: title,
        owner: currentuser.uid,
    })
    readTasks()
}

window.onload = function () {
    getUser()
}