function login() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut()
    }

    var email = document.getElementById('txtemail').value
    var senha = document.getElementById('txtsenha').value

    firebase
        .auth()
        .signInWithEmailAndPassword(email, senha)
        .then( () => {
            swal.fire({
                icon: 'success',
                title: 'Login Realizado.',
            }) .then( () => {
                setTimeout( () => {
                    window.location.replace('index.html')
                }, 1000)
            })
        })
        .catch((error) => {
            var errortype = error.code
            switch (errortype) {
                case 'auth/invalid-email':
                    swal.fire({
                        icon: 'error',
                        title: '[ERRO] E-mail Inválido'  
                    })   
                    break
                case 'auth/wrong-password':
                    swal.fire({
                        icon: 'error',
                        title: '[ERRO] Senha Incorreta'  
                    })   
                    break             
                case 'auth/user-not-found':
                    swal.fire({
                        icon: 'warning',
                        title: '[ERRO] Usuário Não Encontrado',
                        text: 'Deseja Crirar Esse Usuário',
                        showCancelButton: true,
                        cancelButtonText: 'Não',
                        cancelButtonColor: 'red',
                        confirmButtonText: 'Sim',
                        confirmButtonColor: 'blue'
                    }).then((result) => {
                        if (result.value) {
                            signUp(email, senha)
                        }
                    })
                    break       
                default:
                    swal.fire({
                        icon: 'error',
                        title: '[ERRO] Por Favor Insira Os Dados Novamente'  
                    })       
            }
        })
}

function signUp(email, senha) {      
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, senha)
        .then(() => {
            swal.fire({
                icon: 'success',
                title: 'Usuário Criado'
            }).then(() => {
                setTimeout(() => {
                    window.location.replace('index.html')
                }), 1000
            })
        })
        .catch((error) => {
            var errortype = error.code
            switch(errortype) {
                case 'auth/weak-password':
                    swal.fire({
                        icon: 'error',
                        title: '[ERRO] Senha Muito Fraca'
                    })
                break
                default:
                    swal.fire({
                        icon: 'error',
                        title: '[ERRO] Não Foi Possível Criar O Usuário'
                    })
            }
        })
}

function logout() {
    firebase.auth() .signOut()
}