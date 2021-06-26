const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            maxLength: 50
        },
        lastname: {
            type: String,
            required: true,
            maxLength: 50
        },
        curp: {
            type: String,
            required: true,
            validate: {
                validator: function(v) { 
                  return /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/.test(v);
                },
                message: `Error la curp no es valida, vuelva a intentarlo`
            }
        },
        create_date: {
            required: true,
            type: Date,
            default: Date.now
        },
        controlnumber: {
            type: String,
            required: true,
            unique: true
        },
        grade: {
            type: Number,
            required: true,
            validate(calificacion) { 
                if (calificacion >= 0 && calificacion <= 100) {     
                } else {
                    throw new Error("Calificacion debe estar en el rango [0-100]");
                }
            }
        },
        career: {
            required: true,
            type: String,
            validate: {
                validator: function(v) { 
                  return /(ISC|IM|IGE|IC){1}/.test(v);
                },
                message: `Carreras disponibles [ISC, IM, IGE, IC]`
            }
        }
    }
);

const modelE = mongoose.model('Escuela', schema, 'escuela');

module.exports = modelE;