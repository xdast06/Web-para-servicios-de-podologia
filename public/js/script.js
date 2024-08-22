document.addEventListener('DOMContentLoaded', () => {
    // Primera petición: Obtener estadísticas
    fetch('/podologia/statistics')
        .then(response => response.json())
        .then(data => {
            document.getElementById('total').textContent = 'Pacientes: ' + data.totalPacientes;
            document.getElementById('hoy').textContent = 'Hoy: ' + data.pacientesHoy;
        })
        .catch(error => console.error('Error al obtener las estadísticas:', error));

    // Segunda petición: Obtener y filtrar datos por fecha de hoy
    fetch('/podologia/getAll')
    .then(response => response.json())
    .then(data => {
        const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
        const filteredData = data.filter(item => {
            if (item.fechaVisita) {
                const itemDate = new Date(item.fechaVisita);
                if (!isNaN(itemDate)) {
                    const itemDateString = itemDate.toISOString().split('T')[0];
                    return itemDateString === today;
                }
            }
            return false; // Filtra las fechas inválidas o nulas
        });

        displayData(filteredData);
    })
    .catch(error => console.error('Error al obtener los datos:', error));

function displayData(data) {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = ''; // Limpiar el contenido anterior

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.fechaVisita.split('T')[0]}</td> <!-- Muestra solo la fecha sin la hora -->
            <td>${item.enfermedad}</td>
        `;
        tbody.appendChild(row);
    });
}
});
