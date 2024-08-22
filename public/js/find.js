document.addEventListener("DOMContentLoaded", () => {
    getAll().then(data => showData(data)).catch(error => showError(error));
});

const container = document.querySelector("#results-container");
const find = document.querySelector("#searchQuery");

// Manejo del campo de búsqueda
find.addEventListener("input", () => {
    if (find.value.length === 0) {
        getAll().then(data => showData(data)).catch(error => showError(error));
    } else {
        getData(find.value).then(data => showData(data)).catch(error => showError(error));
    }
});

// Formatear la fecha
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    } catch (error) {
        return 'Fecha inválida';
    }
}

// Mostrar datos en la tabla
function showData(data) {
    const resultsContainer = document.querySelector("#results-container");
    resultsContainer.innerHTML = ''; // Limpiar los resultados previos

    if (!data || data.length === 0) {
        resultsContainer.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    // Crear la estructura de la tabla
    const table = document.createElement('table');
    table.className = 'table table-striped';

    // Crear el encabezado de la tabla
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Edad</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Fecha de Nacimiento</th>
            <th>Acciones</th>
        </tr>
    `;
    table.appendChild(thead);

    // Crear el cuerpo de la tabla
    const tbody = document.createElement('tbody');
    const fragment = document.createDocumentFragment();

    // Iterar sobre los datos para generar las filas
    data.forEach(paciente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${paciente.id}</td>
            <td>${paciente.nombre}</td>
            <td>${paciente.apellido}</td>
            <td>${paciente.edad}</td>
            <td>${paciente.contacto}</td>
            <td>${paciente.direccion}</td>
            <td>${formatDate(paciente.nacimiento)}</td>
            <td>
                <a href="/podologia/view?id=${paciente.id}" class="btn btn-info btn-sm">Ver</a>
                <a href="/podologia/update/${paciente.id}" class="btn btn-warning btn-sm">Editar</a>
                <a href="#" data-id="${paciente.id}" class="btn btn-danger btn-sm delete-btn">Borrar</a>
            </td>
        `;
        fragment.appendChild(tr);
    });

    tbody.appendChild(fragment);
    table.appendChild(tbody);
    resultsContainer.appendChild(table);

    // Añadir evento de eliminación
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault(); // Prevenir la navegación del enlace
            const id = button.getAttribute("data-id");
            deleteData(id);
        });
    });
}

// Función para eliminar un paciente
function deleteData(id) {
    fetch(`/podologia/delData/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error en la solicitud: " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Volver a cargar los datos después de la eliminación
        getAll().then(data => showData(data)).catch(error => showError(error));
    })
    .catch(error => {
        console.error("Hubo un problema con la solicitud:", error);
        showError(error);
    });
}

// Mostrar errores
function showError(error) {
    const resultsContainer = document.querySelector("#results-container");
    resultsContainer.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
}

// Obtener todos los datos
function getAll() {
    return fetch("/podologia/getAll")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la solicitud: " + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error("Hubo un problema con la solicitud:", error);
            throw error;
        });
}

// Obtener datos de búsqueda
function getData(name) {
    return fetch(`/podologia/getData/${name}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la solicitud: " + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error("Hubo un problema con la solicitud:", error);
            throw error;
        });
}
