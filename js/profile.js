const db = firebase.firestore()
let currentuser = {}
let prof = false

function getUser() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            currentuser.uid = user.uid
            getUserInfo(user.uid)
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

async function getUserInfo(uid) {
    const logUsers = await db.collection('prof').where('uid', '==', uid).get()
    let userInfo = document.getElementById('userInfo') 
    if (logUsers.docs.length == 0) {
        userInfo.innerHTML = "Perfil não registrado"
    } else {
        userInfo.innerHTML = "Perfil registrado"
        prof = true
        const userData = logUsers.docs[0]
        currentuser.id = userData.id
        currentuser.fn = userData.data().fn
        currentuser.ln = userData.data().ln
        document.getElementById('inputfn').value = currentuser.fn
        document.getElementById('inputln').value = currentuser.ln
    }
}

async function saveprof() {
    const fn = document.getElementById('inputfn').value
    const ln = document.getElementById('inputln').value
    if (!prof) {
        await db.collection('prof').add({
            uid: currentuser.uid,
            fn: fn,
            ln:ln,
        })
        getUserInfo(currentuser.uid)
    } else {
        await db.collection('prof').doc(currentuser.id). update({
            fn: fn,
            ln: ln,
        })
    }
}

window.onload = function () {
    getUser()
}