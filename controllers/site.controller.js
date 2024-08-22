const db = require("../dataBase/bd");
const path = require("path");

const getPatients = async (req, res) => {
  try {
    const sql = "SELECT * FROM pacientes WHERE activo = true";
    // Usa await con la consulta para trabajar con promesas
    const [rows] = await db.query(sql);

    res.json(rows);
  } catch (err) {
    console.error("Error al obtener pacientes:", err);
    res.status(500).json({ err: "error del servidor" });
  }
};

const findPatient = async (req, res) => {
  const { nombre } = req.params;

  // Validar el parámetro de entrada
  if (!nombre) {
    return res
      .status(400)
      .json({ error: "El parámetro 'nombre' es requerido" });
  }

  try {
    const sql = "SELECT * FROM pacientes WHERE nombre like ? AND activo = true";
    const [rows] = await db.query(sql, [`${nombre}%`]);

    // Verificar si se encontraron resultados
    if (rows.length === 0) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }

    res.json(rows);
  } catch (err) {
    console.error("Error al buscar paciente:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const createPatient = async (req, res) => {
  let {
    nombre,
    apellido,
    edad,
    direccion,
    recomendado,
    nacimiento,
    fechaVisita,
    contacto,
    derivado,
    enfermedad,
    medicacionActual,
    tratamiento,
    antitetanica,
    presion,
    diabetico,
    discracias,
    piel,
    cianosis,
    turgencia,
    pie,
    notas,
  } = req.body;

  // Asegúrate de que `pie` sea un array y formatea
  if (!Array.isArray(pie)) {
    pie = [pie]; // Convierte en array si no lo es
}
  const pieFormatted = pie.join(", ");

  // Consulta SQL para insertar un nuevo paciente
  const sql = `
      INSERT INTO pacientes (
          nombre, apellido, edad, direccion, recomendado, 
          nacimiento, fechaVisita, contacto, derivado, enfermedad, 
          medicacionActual, tratamiento, antitetanica, presion, diabetico, 
          discracias, piel, cianosis, turgencia, pie, notas, activo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    // Ejecutar la consulta
    const [result] = await db.query(sql, [
      nombre,
      apellido,
      edad,
      direccion,
      recomendado,
      nacimiento,
      fechaVisita,
      contacto,
      derivado,
      enfermedad,
      medicacionActual,
      tratamiento,
      antitetanica,
      presion,
      diabetico,
      discracias,
      piel,
      cianosis,
      turgencia,
      pieFormatted,
      notas,
      true
    ]);

    // Responder con el nuevo registro y el ID generado
    const paciente = {
      id: result.insertId,
      ...req.body,
    };
    res.status(201).redirect("/");
  } catch (err) {
    console.error("Error en la inserción:", err);
    res.status(500).json({ error: "Intentelo más tarde." });
  }
};

const deletePatient = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el paciente existe
    let sql = "SELECT * FROM pacientes WHERE id = ?";
    const [rows] = await db.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No se encontró paciente." });
    }

    // Eliminar el paciente
    sql = "UPDATE pacientes SET activo = false WHERE id = ?";
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Paciente no encontrado para eliminar." });
    }

    res.status(200).json({ mensaje: "Paciente eliminado." });
  } catch (err) {
    console.error("Error al eliminar el paciente:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

const updatePatient = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    apellido,
    edad,
    direccion,
    recomendado,
    nacimiento,
    fechaVisita,
    contacto,
    derivado,
    enfermedad,
    medicacionActual,
    tratamiento,
    antitetanica,
    presion,
    diabetico,
    discracias,
    piel,
    cianosis,
    turgencia,
    pie,
    notas,
  } = req.body;

  // Verificar que los campos requeridos están presentes
  if (
    !nombre ||
    !apellido ||
    !edad ||
    !direccion ||
    !nacimiento ||
    !fechaVisita
  ) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  // Consulta SQL para actualizar el paciente
  const sql = `
    UPDATE pacientes SET
      nombre = ?, apellido = ?, edad = ?, direccion = ?, recomendado = ?,
      nacimiento = ?, fechaVisita = ?, contacto = ?, derivado = ?, enfermedad = ?,
      medicacionActual = ?, tratamiento = ?, antitetanica = ?, presion = ?, diabetico = ?,
      discracias = ?, piel = ?, cianosis = ?, turgencia = ?, pie = ?, notas = ?
    WHERE id = ?
  `;

  try {
    const [result] = await db.query(sql, [
      nombre,
      apellido,
      edad,
      direccion,
      recomendado,
      nacimiento,
      fechaVisita,
      contacto,
      derivado,
      enfermedad,
      medicacionActual,
      tratamiento,
      antitetanica,
      presion,
      diabetico,
      discracias,
      piel,
      cianosis,
      turgencia,
      pie,
      notas,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Paciente no encontrado." });
    }

    res.status(200).json({ mensaje: "Paciente actualizado." });
  } catch (err) {
    console.error("Error al actualizar paciente:", err);
    res.status(500).json({ error: "Error en la consulta." });
  }
};

// estadisticas

const stats = async (req, res) => {
  try {
    const [totalPacientes] = await db.query(
      "SELECT COUNT(*) AS total FROM pacientes WHERE activo = true"
    );
    const [pacientesHoy] = await db.query(
      "SELECT COUNT(*) AS total FROM pacientes WHERE DATE(fechaVisita) = CURDATE() AND activo = true"
    );

    res.json({
      totalPacientes: totalPacientes[0].total,
      pacientesHoy: pacientesHoy[0].total,
    });
  } catch (error) {
    console.error("Error al obtener las estadísticas:", error);
    res.status(500).json({ error: "Error al obtener las estadísticas" });
  }
};

const getPatientData = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = "SELECT * FROM pacientes WHERE id = ?";
    const [rows] = await db.query(sql, [id]);

    // Verificar si se encontraron resultados
    if (rows.length === 0) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }

    res.json(rows);
  } catch (err) {
    console.error("Error al buscar paciente:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  findPatient,
  getPatients,
  createPatient,
  deletePatient,
  updatePatient,
  stats,
  getPatientData,
};
