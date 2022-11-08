import sqlRun from './run-sql.js'
import { writeFileSync } from "fs"
import moment from 'moment'
import history from "./history.js"

export default function (callback) {
  const data_logs_path = './data_logs/'
  let filePath = 'ofertas'
  let query = `
    SELECT DISTINCT
    grade_horario.cod_grd_horario as id,
    oferta_modulo.idt_turma, 
    grade_curricular.num_versao_grade as grade, 
    turno.dsc_turno as turno, campus.nom_campus as campus, 
    marca_instituicao.sgl_marca as marca,
    professor.nom_professor as nome_prof, professor.cpf_professor as cpf_prof,
    disciplina.cod_disciplina as cod_uc, CAST(disciplina.sgl_disciplina AS INT) as sgl_uc, 
    disciplina.nom_disciplina as nome_uc,
    diario_classe.cod_diario_classe as diario, item_grade_horario.cod_dia_semana as dia
    
  FROM
    db_siaf.periodo_letivo as periodo_letivo,
    db_siaf.oferta_modulo as oferta_modulo,
    db_siaf.oferta_grade_horario as oferta_grade_horario,
    db_siaf.grade_ciclo_modulo as grade_ciclo_modulo,
    db_siaf.grade_ciclo as grade_ciclo,
    db_siaf.grade_qualificacao as grade_qualificacao,
    db_siaf.grade_curricular as grade_curricular,
    db_siaf.grupo_grd_curricular as grupo_grd_curricular,
    db_siaf.grade_horario as grade_horario,
    db_siaf.item_grade_horario as item_grade_horario,
    db_siaf.diario_classe as diario_classe,
    db_siaf.turno as turno,
    db_siaf.campus as campus,
    db_siaf.instituicao_ensino as instituicao_ensino,
    db_siaf.marca_instituicao as marca_instituicao,
    db_siaf.professor as professor,
    db_siaf.disciplina as disciplina
    
  WHERE
    periodo_letivo.sgl_periodo_letivo = '2022/2' AND
    oferta_modulo.cod_periodo_letivo = periodo_letivo.cod_periodo_letivo AND
    oferta_grade_horario.cod_oferta_modulo = oferta_modulo.cod_oferta_modulo AND
    grade_ciclo_modulo.cod_grd_ciclo_modulo = oferta_modulo.cod_grd_ciclo_modulo AND
    grade_ciclo_modulo.cod_grd_ciclo = grade_ciclo.cod_grd_ciclo AND
    grade_ciclo.cod_grd_qualificacao = grade_qualificacao.cod_grd_qualificacao AND
    grade_qualificacao.cod_grd_curricular = grade_curricular.cod_grd_curricular AND
    grade_curricular.cod_grupo_grd_curricular = grupo_grd_curricular.cod_grupo_grd_curricular AND
    grupo_grd_curricular.cod_categoria_grade = 5 /* 5 = E2A 2.0 - Currículo Integrado */ AND  
    
    grade_horario.cod_grd_horario = oferta_grade_horario.cod_grd_horario AND
    grade_horario.cod_grd_horario = diario_classe.cod_grd_horario AND
    grade_horario.cod_grd_horario = item_grade_horario.cod_grd_horario AND
    
    grade_horario.cod_turno = turno.cod_turno AND
    grade_horario.cod_campus = campus.cod_campus AND 
    campus.cod_instituicao = instituicao_ensino.cod_instituicao AND 
    instituicao_ensino.cod_marca = marca_instituicao.cod_marca AND
    grade_horario.cod_professor = professor.cod_professor AND
    grade_horario.cod_disciplina = disciplina.cod_disciplina
`

  return new Promise(function (resolve, reject) {
    sqlRun(query, (data) => {
      //console.log("data", data)
      let json_output = JSON.stringify(data, null, 2)

      let fileName = filePath + '-' + moment().format()
      let lastFileName = history.get('ofertas_last')
      if(lastFileName == undefined) {
        history.set('ofertas_before',fileName)
      } else {
        history.set('ofertas_before',lastFileName)
      }
      history.set('ofertas_last',fileName)
      writeFileSync(data_logs_path + fileName + '.json', json_output)
      writeFileSync(data_logs_path + fileName + '.js', 'export default ' + json_output)
      resolve()
    })
  });

}