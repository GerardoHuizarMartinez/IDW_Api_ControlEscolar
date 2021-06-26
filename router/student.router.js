const router = require('express').Router();
const mongoose = require('mongoose');
var status = require('http-status');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/controlescolar', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Escolar = require('../models/student.model');

module.exports = () => {
    // Insertar alumno 
    router.post('/', (req, res) => {
        escolar = req.body;

        Escolar.create(escolar)
            .then(
                (data) => {
                        console.log(data);
                        res.json(
                            {
                                code: status.OK,
                                msg: 'Se insertó correctamente',
                                data: data
                            }
                        )                   
                }
            )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST)
                        .json(
                            {
                                code: status.BAD_REQUEST,
                                msg: 'Error No se pudo realizar la petición',
                                err: err.name,
                                default: err.message
                            }
                        )
                }
            );
    });

    // Consulta general control escolar
    router.get('/', (req, res) => {
        Escolar.find({})
            .then(
                (escolares) => {
                    res.json({
                        code: status.OK,
                        msg: 'Consulta correcta',
                        data: escolares
                    })
                }
            )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST)
                        .json({
                            code: status.BAD_REQUEST,
                            msg: 'Error No se pudo realizar la petición',
                            err: err.name,
                            detail: err.message
                        })
                }
            )
    });

    
    // Consulta alumno por _id 
    router.get('/:id', (req, res) => {

        const id = req.params.id;

        Escolar.findOne({ _id: id })
            .then(
                (escolar) => {
                    if (escolar)
                        res.json({
                            code: status.OK,
                            msg: 'Consulta correcta',
                            data: escolar
                        });
                    else
                        res.status(status.NOT_FOUND)
                            .json({
                                code: status.NOT_FOUND,
                                msg: 'No se encontró el elemento'
                            });

                }
            )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST)
                        .json({
                            code: status.BAD_REQUEST,
                            msg: 'Error No se pudo realizar la petición',
                            err: err.name,
                            detail: err.message
                        })
                }
            )
    });

    // Eliminar alumno
    router.delete('/:id', (req, res) => {
        id = req.params.id;
        Escolar.findByIdAndRemove(id)
            .then(
                (data) => {
                    if(data)
                        res.json({
                            code: status.OK,
                            msg: 'Se eliminó correctamente',
                            data: data
                        })
                    else 
                        res.status(status.NOT_FOUND)
                        .json({
                            code: status.NOT_FOUND,
                            msg: 'No se encontró el elemento'
                        })
                }
            )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST)
                        .json({
                            code: status.BAD_REQUEST,
                            msg: 'Error No se pudo realizar la petición',
                            err: err.name,
                            detail: err.message
                        })
                }
            )
    });


    // Actualización 
    router.put('/:id', (req, res) => {
        id = req.params.id;
        escolar = req.body;
        Escolar.findByIdAndUpdate(id, escolar, { new: true })
            .then(
                (data) => {
                    console.log(data);
                    res.json({
                        code: status.OK,
                        msg: 'Se actualizó correctamente',
                        data: data
                    });
                }
            )
            .catch(
                (err) => {
                    console.log(err);
                    res.status(status.BAD_REQUEST);
                    res.json({
                        code: status.BAD_REQUEST,
                        msg: 'Error No se pudo realizar la petición',
                        err: err.name,
                        detail: err.message
                    })
                }
            )
    });
    
    // Estadística de estudiantes hombres y mujeres por carrera 
    router.post("/gender/", (req, res) => {
        Escolar.find({})
          .then((data) => {
            iscM = 0;
            iscF = 0;
            imM = 0;
            imF = 0;
            igeM = 0;
            igeF = 0;
            icM = 0;
            icF = 0;
            
    
            data.forEach((escolar, i) => {
              if (data[i].career === "ISC") {
                data[i].curp.charAt(10) == "H" ? iscM++ : iscF++;
              }
              if (data[i].career === "IM") {
                data[i].curp.charAt(10) == "H" ? imM++ : imF++;
              }
              if (data[i].career === "IGE") {
                data[i].curp.charAt(10) == "H" ? igeM++ : igeF++;
              }
              if (data[i].career === "IC") {
                data[i].curp.charAt(10) == "H" ? icM++ : icF++;
              }
            });
    
            res.json({
              code: status.OK,
              msg: "Consulta correcta",
              data: [
                ["ISC", ["Hombres: " + iscM, "Mujeres: " + iscF]],
                ["IM", ["Hombres: " + imM, "Mujeres: " + imF]],
                ["IGE", ["Hombres: " + igeM, "Mujeres: " + igeF]],
                ["IC", ["Hombres: " + icM, "Mujeres: " + icF]],
              ],
            });
          })
          .catch((err) => {
            res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "Error No se pudo realizar la petición",
              err: err.name,
              detail: err.message,
            });
          });
      });
    
    // Estadística de estudiantes foráneos por carrera 

    router.post("/foraneos/", (req, res) => {
        Escolar.find({})
          .then((data) => {
            iscForaneos = 0;
            imForaneos = 0;
            igeForaneos = 0;
            icForaneos = 0;
            
    
            data.forEach((escolar, i) => {
              if (data[i].career === "ISC") {
                data[i].curp.substr(11,2) != "NT" ? iscForaneos++ : 0;
              }
              if (data[i].career === "IM") {
                data[i].curp.substr(11,2) != "NT" ? imForaneos++ : 0;
              }
              if (data[i].career === "IGE") {
                data[i].curp.substr(11,2) != "NT" ? igeForaneos++ : 0;
              }
              if (data[i].career === "IC") {
                data[i].curp.substr(11,2) != "NT" ? icForaneos++ : 0;
              }
            });
    
            res.json({
              code: status.OK,
              msg: "Consulta correcta",
              data: [
                ["ISC", ["Foraneos: " + iscForaneos]],
                ["IM", ["Foraneos: " + imForaneos]],
                ["IGE", ["Foraneos: " + igeForaneos]],
                ["IC", ["Foraneos: " + icForaneos]],
              ],
            });
          })
          .catch((err) => {
            res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "Error No se pudo realizar la petición",
              err: err.name,
              detail: err.message,
            });
          });
      });

    // Aprobados y no aprobados por carrera
    router.post("/Apro_Rep/", (req, res) => {
        Escolar.find({})
          .then((data) => {
           
            iscApro = 0;
            iscRep = 0;
            imApro = 0;
            imRep = 0;
            igeApro = 0;
            igeRep = 0;
            icApro = 0;
            icRep = 0;
            
    
            data.forEach((escuela, i) => {
              if (data[i].career === "ISC") {
                data[i].grade >= 70 ? iscApro++ : iscRep++;
              }
              if (data[i].career === "IM") {
                data[i].grade >= 70 ? imApro++ : imRep++;
              }
              if (data[i].career === "IGE") {
                data[i].grade >= 70 ? igeApro++ : igeRep++;
              }
              if (data[i].career === "IC") {
                data[i].grade >= 70 ? icApro++ : icRep++;
              }
            });
    
            res.json({
              code: status.OK,
              msg: "Consulta correcta",
              data: [
                ["ISC", ["Aprobados: " + iscApro, "Reprobados: " + iscRep]],
                ["IM", ["Aprobados: " + iscApro, "Reprobados: " + imRep]],
                ["IGE", ["Aprobados: " + iscApro, "Reprobados: " + igeRep]],
                ["IC", ["Aprobados: " + iscApro, "Reprobados: " + icRep]],
              ],
            });
          })
          .catch((err) => {
            res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "Error No se pudo realizar la petición",
              err: err.name,
              detail: err.message,
            });
          });
      }); 

    return router;
}