const pool = require('../database/db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('../database/db');

// Configurar Multer para guardar los archivos en una carpeta específica
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadDir = 'uploads'; // Nombre de la carpeta donde se guardarán los archivos
    const fullPath = path.join(__dirname, '..', uploadDir);

    // Crear la carpeta si no existe
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    callback(null, fullPath);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname.replace(/ /g, '_'));
  },
});

// Configurar Multer para permitir cualquier tipo de archivo
const upload = multer({ 
  storage,
  fileFilter: (req, file, callback) => {
    callback(null, true);
  },
}).single('archivo'); // Usar 'archivo' como el nombre del campo del formulario

const subirArchivo = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Error al subir el archivo:', err);
        return res.status(400).json({ error: 'Error al subir el archivo' });
      }

      const archivo = req.file;
      if (!archivo) {
        console.error('No se ha proporcionado un archivo válido');
        return res.status(400).json({ error: 'No se ha proporcionado un archivo válido' });
      }

      const nombreDocumento = archivo.originalname.replace(/ /g, '_');
      const { organigrama_id, tipo_documento_id, estatus_id, nombre_documento,
         descripcion_documento, codigo_documento, 
         elaborado_por, revisado_por, aprobado_por, 
         fecha_vigencia, fecha_elaboracion, fecha_revision, fecha_aprobacion, fecha_proxima_revision,
         modelo_documento,numero_revision,
         usuario_id, datos_normas  } = req.body;

      const rutaDocumento = path.join('uploads', nombreDocumento);
      const fecha_registro = new Date();

      const insertQuery = `
        INSERT INTO documentos 
        (organigrama_id, tipo_documento_id, estatus_id, nombre_documento,descripcion_documento, codigo_documento, 
          elaborado_por, revisado_por, aprobado_por, fecha_vigencia, fecha_elaboracion, fecha_revision, fecha_aprobacion, fecha_proxima_revision, modelo_documento,numero_revision,    
        ruta_documento, usuario_id, datos_normas , fecha_registro) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20 )
        RETURNING id
      `;

      try {
        const result = await pool.query(insertQuery, [
          organigrama_id || null,
          tipo_documento_id || null,
          estatus_id || null,
          nombreDocumento || null,
          descripcion_documento || null,
          codigo_documento || null,
          elaborado_por || null,
          revisado_por || null,
          aprobado_por || null,
          fecha_vigencia || null,
          fecha_elaboracion || null,
          fecha_revision || null,
          fecha_aprobacion || null,
          fecha_proxima_revision || null,
          modelo_documento || null,
          numero_revision || null,
          rutaDocumento || null,
          usuario_id || null,
          datos_normas  || null,
          fecha_registro,
        ]);

        res.status(200).json({ mensaje: 'Archivo subido y registrado correctamente', documento: result.rows[0] });
      } catch (error) {
        console.error('Error al guardar en la base de datos:', error);
        return res.status(500).json({ error: 'Error al guardar en la base de datos' });
      }
    });
  } catch (error) {
    console.error('Error en la subida del archivo:', error);
    return res.status(500).json({ error: 'Error en la subida del archivo' });
  }
};



const actualizarArchivo = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Error al subir el archivo:', err);
        return res.status(400).json({ error: 'Error al subir el archivo' });
      }

      const archivo = req.file;
      if (!archivo) {
        console.error('No se ha proporcionado un archivo válido');
        return res.status(400).json({ error: 'No se ha proporcionado un archivo válido' });
      }

      const nombreDocumento = archivo.originalname.replace(/ /g, '_');
      const { organigrama_id, tipo_documento_id, estatus_id, descripcion_documento, elaborado_por, revisado_por, aprobado_por, fecha_vigencia, fecha_elaboracion, fecha_revision, fecha_aprobacion, fecha_proxima_revision, modelo_documento, numero_revision, usuario_id, datos_normas  } = req.body;
      
      const rutaDocumento = path.join('uploads', nombreDocumento);
      const fecha_registro = new Date();
      const documento_id = req.params.id; // Suponiendo que tienes el ID del documento a actualizar en los parámetros de la ruta.

      const updateQuery = `
        UPDATE documentos 
        SET
       
          estatus_id = $1,
          nombre_documento = $2,
          descripcion_documento = $3,
          elaborado_por = $4,
          revisado_por = $5,
          aprobado_por = $6,
          fecha_vigencia = $7,
          fecha_elaboracion = $8,
          fecha_revision = $9,
          fecha_aprobacion = $10,
          fecha_proxima_revision = $11,
          modelo_documento = $12,
          numero_revision = $13,
          ruta_documento = $14,
          usuario_id = $15,
          datos_normas  = $16,
          fecha_registro = $17
        WHERE id = $18
        RETURNING id
      `;
//ACTUALIZAR
      try {
        const result = await pool.query(updateQuery, [
        
          estatus_id,
          nombreDocumento,
          descripcion_documento,
          elaborado_por,
          revisado_por,
          aprobado_por,
          fecha_vigencia,
          fecha_elaboracion,
          fecha_revision,
          fecha_aprobacion,
          fecha_proxima_revision,
          modelo_documento,
          numero_revision,
          rutaDocumento,
          usuario_id,
          datos_normas ,
          fecha_registro,
          documento_id
        ]);

        res.status(200).json({ mensaje: 'Archivo actualizado y registro actualizado correctamente', documento: result.rows[0] });
      } catch (error) {
        console.error('Error al actualizar en la base de datos:', error);
        return res.status(500).json({ error: 'Error al actualizar en la base de datos' });
      }
    });
  } catch (error) {
    console.error('Error en la actualización del archivo:', error);
    return res.status(500).json({ error: 'Error en la actualización del archivo' });
  }
};




// Actualizar un  documento existente
const updateDocumento = async (req, res) => {
  const { id } = req.params;
  const { organigrama_id, tipo_documento_id, estatus_id, descripcion_documento, elaborado_por, revisado_por, aprobado_por, fecha_vigencia, fecha_elaboracion, fecha_revision, fecha_aprobacion, fecha_proxima_revision, modelo_documento, numero_revision, usuario_id, datos_normas  } = req.body;
  const sql = `
  UPDATE documentos 
  SET
     estatus_id = $1,
     descripcion_documento = $2,
    elaborado_por = $3,
    revisado_por = $4,
    aprobado_por = $5,
    fecha_vigencia = $6,
    fecha_elaboracion = $7,
    fecha_revision = $8,
    fecha_aprobacion = $9,
    fecha_proxima_revision = $10,
    modelo_documento = $11,
    numero_revision = $12,
    usuario_id = $13,
    datos_normas  = $14
    WHERE id = $15
  RETURNING id
`;

  try {
    const { rowCount } = await db.query(sql, [
      estatus_id,
      descripcion_documento,
      elaborado_por,
      revisado_por,
      aprobado_por,
      fecha_vigencia,
      fecha_elaboracion,
      fecha_revision,
      fecha_aprobacion,
      fecha_proxima_revision,
      modelo_documento,
      numero_revision,
      usuario_id,
      datos_normas ,
      id
    
    ]);
    if (rowCount === 1) {
      res.json({ message: 'Estatus Actualizado con éxito.' });
    } else {
      res.status(500).json({ message: 'Error al actualizar el documento.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el documento.' });
  }
};












const listarDocumentos = async (req, res) => {
  const rutaProyecto = __dirname;
  try {
    const consulta = `
      SELECT documentos.id, organigrama.descripcion, nombre_estatus, tipo_documento, nombre_documento, codigo_documento,  descripcion_documento, 
      elaborado_por, revisado_por, aprobado_por, fecha_vigencia, fecha_elaboracion, fecha_revision, fecha_aprobacion, fecha_proxima_revision, 
      modelo_documento,numero_revision,
      documentos.fecha_registro, organigrama.descripcion, organigrama.codigo
      FROM documentos
      LEFT JOIN organigrama ON organigrama_id = organigrama.id
      LEFT JOIN estatus ON estatus_id = estatus.id
      LEFT JOIN tipo_documentos ON tipo_documento_id = tipo_documentos.id
    `;

    const resultados = await pool.query(consulta);

    const documentosConRuta = resultados.rows.map((documento) => ({
      ...documento,
      ruta_documento: `${rutaProyecto}/${documento.ruta_documento}`,
    }));

    res.status(200).json(documentosConRuta);
  } catch (error) {
    console.error('Error al obtener la lista de documentos:', error);
    return res.status(500).json({ error: 'Error al obtener la lista de documentos' });
  }
};



const getDocumentoById = async (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * 
  FROM public.documentos 
  WHERE id = $1`;

  try {
    const { rows } = await db.query(sql, [id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Documento no encontrado.' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el Documento por ID.' });
  }
};




const getDocumentoReporteGeneral = async (req, res) => {
  db.query(`SELECT documentos.id, organigrama.descripcion, nombre_estatus, tipo_documento, nombre_documento, codigo_documento,  descripcion_documento, 
  elaborado_por, revisado_por, aprobado_por, fecha_vigencia, fecha_elaboracion, fecha_revision, fecha_aprobacion, fecha_proxima_revision, 
  modelo_documento,numero_revision, 
  documentos.fecha_registro, organigrama.descripcion, organigrama.codigo, datos_normas 
  FROM documentos
  LEFT JOIN organigrama ON organigrama_id = organigrama.id
  LEFT JOIN estatus ON estatus_id = estatus.id
  LEFT JOIN tipo_documentos ON tipo_documento_id = tipo_documentos.id`, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de Documentos.' });
    }
    res.json(results.rows);
  });
};


const getDocumentoByIdReporte = async (req, res) => {
  const { id } = req.params;
  const sql = `SELECT documentos.id, organigrama.descripcion, nombre_estatus, tipo_documento, nombre_documento, codigo_documento,  descripcion_documento, 
  elaborado_por, revisado_por, aprobado_por, fecha_vigencia, fecha_elaboracion, fecha_revision, fecha_aprobacion, fecha_proxima_revision, 
  modelo_documento,numero_revision, 
  documentos.fecha_registro, organigrama.descripcion, organigrama.codigo, datos_normas 
  FROM documentos
  LEFT JOIN organigrama ON organigrama_id = organigrama.id
  LEFT JOIN estatus ON estatus_id = estatus.id
  LEFT JOIN tipo_documentos ON tipo_documento_id = tipo_documentos.id
  WHERE documentos.id = $1`;

  try {
    const { rows } = await db.query(sql, [id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Documento no encontrado.' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el Documento por ID1.' });
  }
};


//REPORTE POR ORGANIGRAMA
const getDocumentoByIdReporteOrganigrama = async (req, res) => {
  const { id } = req.params; // Obtén el valor de id desde req.params
  db.query(`
    SELECT documentos.id, organigrama.descripcion, nombre_estatus, tipo_documento, nombre_documento, codigo_documento, descripcion_documento, 
    elaborado_por, revisado_por, aprobado_por, fecha_vigencia, fecha_elaboracion, fecha_revision, fecha_aprobacion, fecha_proxima_revision, 
    modelo_documento, numero_revision, 
    documentos.fecha_registro, organigrama.descripcion, organigrama.codigo, datos_normas 
    FROM documentos
    LEFT JOIN organigrama ON organigrama_id = organigrama.id
    LEFT JOIN estatus ON estatus_id = estatus.id
    LEFT JOIN tipo_documentos ON tipo_documento_id = tipo_documentos.id
    WHERE organigrama_id = $1`, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de Documentos.' });
    }
    res.json(results.rows);
  });
};



module.exports = { subirArchivo, listarDocumentos, updateDocumento, getDocumentoReporteGeneral, getDocumentoById, actualizarArchivo, getDocumentoByIdReporte, 
  getDocumentoByIdReporteOrganigrama  };