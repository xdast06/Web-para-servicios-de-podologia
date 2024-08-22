document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID de la URL
    const id = getIdFromUrl();
    
    // Seleccionar el formulario
    const form = document.querySelector('#updateForm'); // Cambia '#updateForm' al ID de tu formulario

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el envío del formulario

        const formData = new FormData(form);
        const data = {};

        // Convertir FormData a un objeto JavaScript
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Enviar la solicitud PUT con los datos del formulario
        fetch(`/podologia/putData/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                console.error(`Error: ${response.status} ${response.statusText}`);
                throw new Error(`HTTP status ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log('Success:', result);
            // Redirigir a la ruta '/'
            window.location.href = '/';
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
    });
});

function getIdFromUrl() {
    const url = window.location.pathname;
    const id = url.substring(url.lastIndexOf('/') + 1);
    return id;
}
