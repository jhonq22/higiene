const db = require('../database/db');

// Obtener todos los registros de antecendetes 
exports.getAllAntecedentesMaestra = (req, res) => {
  db.query(`SELECT antecedentes_maestra.id, antecedentes_maestra.codigo, asociado_revision, fecha_vigencia_ant, fecha_revision_ant, descripcion
   FROM public.antecedentes_maestra
        LEFT JOIN organigrama ON organigrama_id = organigrama.id
        `, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de antecendetes .' });
    }
    res.json(results.rows);
  });
};

// Crear un nuevo registro de antecendetes 
exports.createAntecedentesMaestra = (req, res) => {
  const { codigo, asociado_revision,fecha_vigencia_ant,fecha_revision_ant, organigrama_id } = req.body;
  const sql = 'INSERT INTO public.antecedentes_maestra  (codigo, asociado_revision, fecha_vigencia_ant, fecha_revision_ant, organigrama_id   ) VALUES ($1, $2, $3, $4, $5)';
  db.query(sql, [codigo, asociado_revision,fecha_vigencia_ant,fecha_revision_ant, organigrama_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al crear un nuevo registro de antecendetes .' });
    }
    res.json({ message: 'Registro de antecendetes  creado con éxito.'});
  });
};

// Actualizar un registro de antecendetes  existente
exports.updateAntecedentesMaestra = (req, res) => {
  const { id } = req.params;
  const { codigo, asociado_revision,fecha_vigencia_ant,fecha_revision_ant, organigrama_id } = req.body;
  const sql = 'UPDATE public.antecedentes_maestra  SET codigo =$1, asociado_revision=$2, fecha_vigencia_ant =$3, fecha_revision_ant =$4, organigrama_id =$5 WHERE id=$6';
  db.query(sql, [codigo, asociado_revision,fecha_vigencia_ant,fecha_revision_ant, organigrama_id, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al actualizar el registro de antecendetes .' });
    }
    res.json({ message: 'Registro de antecendetes  actualizado con éxito.' });
  });
};



exports.getAntecedentesMaestraById = async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM public.antecedentes_maestra  WHERE id = $1';

  try {
    const { rows } = await db.query(sql, [id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'antecendetes  no encontrado.' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el antecendetes  por ID.' });
  }
};

exports.getAntecedentesMaestraReportesById = async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM public.antecedentes_maestra WHERE organigrama_id = $1';

  try {
    const { rows } = await db.query(sql, [id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'antecendetes  no encontrado.' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el antecendetes  por ID.' });
  }
};


////AQUI TERMINA ANTECEDENTES DE LISTA MAESTRA //





////AQUI EMPIEZA ANTECEDENTES DE CONTROLADOS //


// Obtener todos los registros de antecendetes 
exports.getAllAntecedentesControlados= (req, res) => {
    db.query(`SELECT  antecedentes_controlados.id, antecedentes_controlados.nro_registro, asociado, fecha_vigencia_ant,fecha_revision_ant, codigo_documento
    FROM public.antecedentes_controlados
    LEFT JOIN documentos ON documento_id = documentos.id
    
    `, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al obtener los registros de antecendetes .' });
      }
      res.json(results.rows);
    });
  };
  
  // Crear un nuevo registro de antecendetes 
  exports.createAntecedentesControlados= (req, res) => {
    const { nro_registro , asociado ,fecha_vigencia_ant,fecha_revision_ant, documento_id } = req.body;
    const sql = 'INSERT INTO public.antecedentes_controlados   (nro_registro , asociado , fecha_vigencia_ant, fecha_revision_ant, documento_id   ) VALUES ($1, $2, $3, $4, $5)';
    db.query(sql, [nro_registro , asociado ,fecha_vigencia_ant,fecha_revision_ant, documento_id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al crear un nuevo registro de antecendetes .' });
      }
      res.json({ message: 'Registro de antecendetes  creado con éxito.'});
    });
  };
  
  // Actualizar un registro de antecendetes  existente
  exports.updateAntecedentesControlados= (req, res) => {
    const { id } = req.params;
    const { nro_registro , asociado ,fecha_vigencia_ant,fecha_revision_ant, documento_id } = req.body;
    const sql = 'UPDATE public.antecedentes_controlados   SET nro_registro  =$1, asociado =$2, fecha_vigencia_ant =$3, fecha_revision_ant =$4, documento_id =$5 WHERE id=$6';
    db.query(sql, [nro_registro , asociado ,fecha_vigencia_ant,fecha_revision_ant, documento_id, id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al actualizar el registro de antecendetes .' });
      }
      res.json({ message: 'Registro de antecendetes  actualizado con éxito.' });
    });
  };
  
  
  
  exports.getAntecedentesControladosById = async (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM public.antecedentes_controlados   WHERE id = $1';
  
    try {
      const { rows } = await db.query(sql, [id]);
      if (rows.length === 0) {
        res.status(404).json({ message: 'antecendetes  no encontrado.' });
      } else {
        res.json(rows[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el antecendetes  por ID.' });
    }
  };



  exports.getAntecedentesControladosReportesById = async (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM public.antecedentes_controlados WHERE documento_id = $1';
  
    try {
      const { rows } = await db.query(sql, [id]);
      if (rows.length === 0) {
        res.status(404).json({ message: 'antecendetes  no encontrado.' });
      } else {
        res.json(rows[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el antecendetes  por ID.' });
    }
  };