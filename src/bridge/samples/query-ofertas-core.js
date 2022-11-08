import sqlRun from './run-sql.js'
import { writeFileSync } from "fs"
import moment from 'moment'
import history from "./history.js"

export default function (callback) {
  const data_logs_path = './data_logs/'
  let filePath = 'ofertas-core'
  let query = `
 SELECT DISTINCT
    grade_horario.cod_grd_horario as id,
    disciplina.cod_disciplina as cod_uc, 
    CAST(disciplina.sgl_disciplina AS INT) as sgl_uc, disciplina.nom_disciplina as nome_uc,
    grade_horario.idt_turma, diario_classe.cod_diario_classe as diario,
    professor.nom_professor as nome_prof, professor.cpf_professor as cpf_prof,
    item_grade_horario.cod_dia_semana as dia,
    turno.dsc_turno as turno, campus.nom_campus as campus, 
    marca_instituicao.sgl_marca as marca
    
  FROM
    db_siaf.periodo_letivo as periodo_letivo,
    db_siaf.grade_horario as grade_horario,
    db_siaf.item_grade_horario as item_grade_horario,
    db_siaf.diario_classe as diario_classe,
    db_siaf.professor as professor,
    db_siaf.disciplina as disciplina,
    db_siaf.turno as turno,
    db_siaf.campus as campus,
    db_siaf.instituicao_ensino as instituicao_ensino,
    db_siaf.marca_instituicao as marca_instituicao
  
  
  WHERE
    periodo_letivo.sgl_periodo_letivo = '2022/2' AND
    grade_horario.cod_periodo_letivo = periodo_letivo.cod_periodo_letivo AND
    grade_horario.cod_grd_horario = item_grade_horario.cod_grd_horario AND
    grade_horario.cod_grd_horario = diario_classe.cod_grd_horario AND
    grade_horario.cod_disciplina = disciplina.cod_disciplina  AND
    grade_horario.cod_professor = professor.cod_professor AND
    grade_horario.cod_turno = turno.cod_turno AND
    grade_horario.cod_campus = campus.cod_campus AND 
    campus.cod_instituicao = instituicao_ensino.cod_instituicao AND 
    instituicao_ensino.cod_marca = marca_instituicao.cod_marca AND
    
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
      let lastFileName = history.get('ofertas_core_last')
      if(lastFileName == undefined) {
        history.set('ofertas_core_before',fileName)
      } else {
        history.set('ofertas_core_before',lastFileName)
      }
      history.set('ofertas_core_last',fileName)
      writeFileSync(data_logs_path + fileName + '.json', json_output)
      writeFileSync(data_logs_path + fileName + '.js', 'export default ' + json_output)
      resolve()
    })
  });

}