const urlBase = 'https://jsonplaceholder.typicode.com/posts' //URL de donde obtenemos los posteos
let posts = [] //Se inician los posteos con un array vacio

//Se crea función para obtener los posteos
function getData() {
    fetch(urlBase)
        .then(res => res.json())
        .then(data => {
            posts = data
            renderPostList()
        })
        .catch(error => console.error('Error al llamar a la API: ', error))
}

getData()
//Función que es llamada desde la función getData
function renderPostList() {
    const postList = document.getElementById('postList');
    postList.innerHTML = '';

    posts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.classList.add('postItem');
        listItem.innerHTML = `
        <strong>${post.title}</strong>
        <p>${post.body}</p>
        <button onclick="editPost(${post.id})">Editar</button>
        <button onclick="deletePost(${post.id})">Borrar</button>

        <div id="editForm-${post.id}" class="editForm" style="display:none">
            <label for="editTitle">Título: </label>
            <input type="text" id="editTitle-${post.id}" value="${post.title}" required>
            <label for="editBody">Comentario: </label>
            <textarea type="text" id="editBody-${post.id}" required>${post.body}</textarea>
            <button onclick="updatePost(${post.id})">Actualizar</button>
        </div>
        `
        postList.appendChild(listItem);
    })
}

//Se crea función para crear posteo nuevo
function postData() {
    const postTitleInput = document.getElementById('postTitle');
    const postBodyInput = document.getElementById('postBody');
    const postTitle = postTitleInput.value;
    const postBody = postBodyInput.value;

    if (postTitle.trim() == '' || postBody.trim() == '') {
        alert('Los campos son obligatorios')
        return
    }
    fetch(urlBase, {
        method: 'POST',
        body: JSON.stringify({
            title: postTitle,
            body: postBody,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(res => res.json())
        .then(data => {
            posts.unshift(data)
            renderPostList()
            postTitleInput.value = ''
            postBodyInput.value = ''
        })
        .catch(error => console.error('Error al querer crear el nuevo post: ', error))
}

//Se crea función para hacer visible el div del post a editar
function editPost(id) {
    const editForm = document.getElementById(`editForm-${id}`);
    editForm.style.display = (editForm.style.display == 'none') ? 'block' : 'none'
}

//se crea función update 
function updatePost(id) {
    const editTitle = document.getElementById(`editTitle-${id}`).value;
    const editBody = document.getElementById(`editBody-${id}`).value;

    fetch(`${urlBase}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: id,
            title: editTitle,
            body: editBody,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(res => res.json())
        .then(data => {
            const index = posts.findIndex(post => post.id === data.id)
            if (index != -1) {
                posts[index] = data
            } else {
                alert('Se presento un error al actualizar el posteo')
            }
            renderPostList()
        })
        .catch(error => console.error('Error al querer actualizar el post: ', error))
}

//Se crea función para eliminar post
function deletePost(id) {
    fetch(`${urlBase}/${id}`, {
        method: 'DELETE',
    })
        .then(res => {
            if (res.ok) {
                posts = posts.filter(post => post.id != id)
                renderPostList();
            } else {
                alert('Se presento un error, no fue posible borrar el posteo')
            }
        })
        .catch(error => console.error('Se presento un error: ', error))
}