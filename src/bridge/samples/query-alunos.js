import sqlRun from './run-sql.js'
import { writeFileSync } from "fs"
import moment from 'moment'
import history from "./history.js"

export default function (callback) {
  const data_logs_path = './data_logs/'
  let filePath = 'alunos'
  let query = `
select DISTINCT
  aluno.nom_aluno as nome, REPLACE(aluno.num_matricula,'-','') as ra, aluno.eml_aluno as email
  
FROM
  db_siaf.periodo_letivo as periodo_letivo,
  db_siaf.diario_classe as diario_classe,
  db_siaf.item_diario_classe as item_diario_classe,
  db_siaf.grade_horario as grade_horario,
  
  db_siaf.oferta_modulo as oferta_modulo,
  db_siaf.oferta_grade_horario as oferta_grade_horario,
  db_siaf.grade_ciclo_modulo as grade_ciclo_modulo,
  db_siaf.grade_ciclo as grade_ciclo,
  db_siaf.grade_qualificacao as grade_qualificacao,
  db_siaf.grade_curricular as grade_curricular,
  db_siaf.grupo_grd_curricular as grupo_grd_curricular,
  
  db_siaf.aluno as aluno
  
WHERE
  periodo_letivo.sgl_periodo_letivo = '2022/2' AND
  
  diario_classe.cod_periodo_letivo = periodo_letivo.cod_periodo_letivo AND
  grade_horario.cod_grd_horario = diario_classe.cod_grd_horario AND
  
  grade_horario.cod_grd_horario = oferta_grade_horario.cod_grd_horario AND
  oferta_grade_horario.cod_oferta_modulo = oferta_modulo.cod_oferta_modulo AND
  grade_ciclo_modulo.cod_grd_ciclo_modulo = oferta_modulo.cod_grd_ciclo_modulo AND
  grade_ciclo_modulo.cod_grd_ciclo = grade_ciclo.cod_grd_ciclo AND
  grade_ciclo.cod_grd_qualificacao = grade_qualificacao.cod_grd_qualificacao AND
  grade_qualificacao.cod_grd_curricular = grade_curricular.cod_grd_curricular AND
  grade_curricular.cod_grupo_grd_curricular = grupo_grd_curricular.cod_grupo_grd_curricular AND
  grupo_grd_curricular.cod_categoria_grade = 5 /* 5 = E2A 2.0 - Currículo Integrado */ AND 
  
  item_diario_classe.cod_diario_classe = diario_classe.cod_diario_classe AND
  item_diario_classe.cod_aluno = aluno.cod_aluno
`

  return new Promise(function (resolve, reject) {
    sqlRun(query, (data) => {
      //console.log("data", data)
      let json_output = JSON.stringify(data, null, 2)

      let fileName = filePath + '-' + moment().format()
      let lastFileName = history.get('alunos_last')
      if(lastFileName == undefined) {
        history.set('alunos_before',fileName)
      } else {
        history.set('alunos_before',lastFileName)
      }
      history.set('alunos_last',fileName)
      writeFileSync(data_logs_path + fileName + '.json', json_output)
      writeFileSync(data_logs_path + fileName + '.js', 'export default ' + json_output)
      resolve()
    })
  });

}