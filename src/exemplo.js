import sqlRun from './bridge/run-sql.js'

let query = `SELECT * FROM db_siaf.professor WHERE cpf_professor = 18374109840`

sqlRun(query, (data) => {
    console.log("data", data)
})
