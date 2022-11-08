import sqlRun from './run-sql.js'
import { writeFileSync } from "fs"
import moment from 'moment'
import history from "./history.js"

export default function (callback) {
  const data_logs_path = './data_logs/'
  let filePath = 'diarios_core'
  let query = `
  select
  diario_classe.cod_diario_classe as diario, diario_classe.idt_turma, 
  REPLACE(aluno.num_matricula,'-','') as ra 
  
FROM
  db_siaf.periodo_letivo as periodo_letivo,
  db_siaf.diario_classe as diario_classe,
  db_siaf.item_diario_classe as item_diario_classe,
  db_siaf.grade_horario as grade_horario,
  db_siaf.disciplina as disciplina,    
  db_siaf.aluno as aluno
  
WHERE
  periodo_letivo.sgl_periodo_letivo = '2022/2' AND
  
  diario_classe.cod_periodo_letivo = periodo_letivo.cod_periodo_letivo AND
  grade_horario.cod_grd_horario = diario_classe.cod_grd_horario AND
  grade_horario.cod_disciplina = disciplina.cod_disciplina  AND
  
  item_diario_classe.cod_diario_classe = diario_classe.cod_diario_classe AND
  item_diario_classe.cod_aluno = aluno.cod_aluno AND
  
  (
    disciplina.cod_disciplina = 178391 OR /* Inglês instrumental e pensamento digital */
    disciplina.cod_disciplina = 178392 OR /* Cultura e artes */
    disciplina.cod_disciplina = 178390 OR /* Ética e lógica */
    disciplina.cod_disciplina = 178393 OR /* Meio ambiente, sustentabilidade e análise social */
    disciplina.cod_disciplina = 183659 OR /* Português e libras */
    disciplina.cod_disciplina = 199276 OR /* Saúde Integral e Ampliação da Consciência */
    disciplina.cod_disciplina = 308170    /* Nova Economia e Espaço Urbano */
  )
`

  return new Promise(function (resolve, reject) {
    sqlRun(query, (data) => {
      //console.log("data", data)
      let json_output = JSON.stringify(data, null, 2)

      let fileName = filePath + '-' + moment().format()
      let lastFileName = history.get('diarios_core_last')
      if(lastFileName == undefined) {
        history.set('diarios_core_before',fileName)
      } else {
        history.set('diarios_core_before',lastFileName)
      }
      history.set('diarios_core_last',fileName)
      writeFileSync(data_logs_path + fileName + '.json', json_output)
      writeFileSync(data_logs_path + fileName + '.js', 'export default ' + json_output)
      resolve()
    })
  });

}