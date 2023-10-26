const db = require('../database/db');

// Controlador para obtener todos los documentos controlados
const getAllDocumentosControlados = async (req, res) => {
    try {
      const query = `SELECT  dc.id, dc.codigo, dc.titulo, dc.n_revision, dc.siglas, dc.receptor, dc.fecha_recepcion,
      dc.codigo_documento_relacionado, dc.observacion,
      documentos.descripcion_documento, documentos.codigo_documento, descripcion  
      FROM public.documentos_controlados AS dc
      LEFT JOIN documentos on documento_id = documentos.id 
      LEFT JOIN organigrama ON organigrama_id = organigrama.id
      `
      ;
      const result = await db.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los documentos controlados' });
    }
  };



// Controlador para crear un nuevo documento controlado
const createDocumentoControlado = async (req, res) => {
    try {
      const { codigo, titulo, n_revision, siglas, documento_id, receptor, fecha_recepcion, codigo_documento_relacionado, observacion } = req.body;
  
      const query = 'INSERT INTO documentos_controlados (codigo, titulo, n_revision, siglas, documento_id, receptor, fecha_recepcion, codigo_documento_relacionado, observacion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
  
      const result = await db.query(query, [codigo, titulo, n_revision, siglas, documento_id, receptor, fecha_recepcion, codigo_documento_relacionado, observacion]);
  
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
      const { codigo, titulo, n_revision, siglas, documento_id, receptor, fecha_recepcion, codigo_documento_relacionado, observacion } = req.body;
  
      const query = 'UPDATE documentos_controlados SET codigo = $1, titulo = $2, n_revision = $3, siglas = $4, documento_id = $5, receptor = $6, "fecha_recepcion" = $7, codigo_documento_relacionado = $8, observacion = $9 WHERE id = $10 RETURNING *';
  
      const result = await db.query(query, [codigo, titulo, n_revision, siglas, documento_id, receptor, fecha_recepcion, codigo_documento_relacionado, observacion, id]);
  
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
    // Agrega otros controladores aquí
  };