const db = require('../database/db');

// Controlador para obtener todos los documentos controlados
const getAllDocumentosControlados = async (req, res) => {
    try {
      const query = `SELECT  documentos_controlados.id, documentos.id as id_documento , descripcion_documento, codigo_documento,  organigrama.codigo, organigrama.descripcion
      FROM  documentos_controlados 
      LEFT JOIN documentos ON documento_id = documentos.id
      LEFT JOIN organigrama ON documentos_controlados.organigrama_id = organigrama.id
      `
      ;
      const result = await db.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los documentos controlados' });
    }
  };


  const getControladosPorDocumentoId = async (req, res) => {
    const { id } = req.params;
      try {
      const { rows } = await db.query(`SELECT  documentos_controlados.id, documentos.id as id_documento,  descripcion_documento, codigo_documento,  organigrama.codigo, organigrama.descripcion
        FROM  documentos_controlados 
        LEFT JOIN documentos ON documento_id = documentos.id
        LEFT JOIN organigrama ON documentos_controlados.organigrama_id = organigrama.id
        WHERE documento_id = $1`, [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No se encontraron documentos controlados para el documento_id proporcionado.' });
      }
  
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los documentos controlados.' });
    }
  };
 

  const getControladosReportesPorDocumentoId = async (req, res) => {
    const { id } = req.params;
      try {
      const { rows } = await db.query(`SELECT  documentos_controlados.id, documentos.codigo_documento, descripcion_documento, numero_revision, 
      codigo_documento,  organigrama.codigo, organigrama.descripcion
        FROM  documentos_controlados 
        LEFT JOIN documentos ON documento_id = documentos.id
        LEFT JOIN organigrama ON documentos_controlados.organigrama_id = organigrama.id
        WHERE documento_id = $1`, [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No se encontraron documentos controlados para el documento_id proporcionado.' });
      }
  
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los documentos controlados.' });
    }
  };












// Controlador para crear un nuevo documento controlado
const createDocumentoControlado = async (req, res) => {
    try {
      const { organigrama_id, documento_id  } = req.body;
  
      const query = 'INSERT INTO documentos_controlados ( documento_id, organigrama_id  ) VALUES ($1, $2) RETURNING *';
  
      const result = await db.query(query, [documento_id,  organigrama_id ]);
  
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear el documento controlado' });
    }
  };

// Controlador para actualizar un documento controlado por su ID
const updateDocumentoControlado = async (req, res) => {
    try {
      const { id } = req.params;
      const { organigrama_id,  documento_id,  } = req.body;
  
      const query = 'UPDATE documentos_controlados SET organigrama_id = $1, documento_id = $2 WHERE id = $3 RETURNING *';
  
      const result = await db.query(query, [organigrama_id, documento_id, id]);
  
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'Documento controlado no encontrado' });
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el documento controlado' });
    }
  };
  
  // Controlador para obtener un documento controlado por su ID
  const getDocumentoControladoById = async (req, res) => {
    try {
      const { id } = req.params;
      const query = 'SELECT * FROM documentos_controlados WHERE id = $1';
      const result = await db.query(query, [id]);
  
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'Documento controlado no encontrado' });
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener el documento controlado' });
    }
  };



  module.exports = {
    createDocumentoControlado,
    getAllDocumentosControlados,
    updateDocumentoControlado, // Agrega el controlador de actualización
    getDocumentoControladoById, // Agrega el controlador para obtener por ID
    getControladosPorDocumentoId,
    getControladosReportesPorDocumentoId 

  };