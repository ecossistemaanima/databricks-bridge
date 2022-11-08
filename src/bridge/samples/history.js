import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import chalk from 'chalk'

const data_logs_path = './data_logs'
if(!existsSync(data_logs_path)) {
    console.log(chalk.yellow.bold('[data_logs] folder not found...') + 'create!');
    mkdirSync(data_logs_path);
}

if (!existsSync(data_logs_path+'/history.json')) {
    console.log(chalk.yellow.bold('[history.json] file not found...') + 'create!');
    writeFileSync(data_logs_path+'/history.json','{}');
}

const data = readFileSync(data_logs_path+'/history.json')
const bd = JSON.parse(data)

const history = {
    bd,
    set(prop,value) {
        bd[prop] = value
        let data = JSON.stringify(bd,null,2)
        writeFileSync(data_logs_path+'/history.json',data)
    },
    get(prop) {
        return bd[prop]
    },

    getLastOfertasCore() {
        let filePath = data_logs_path+'/'+history.get('ofertas_core_last')+'.json';
        const data = readFileSync(filePath)
        return JSON.parse(data)
    },
    getLastOfertas() {
        let filePath = data_logs_path+'/'+history.get('ofertas_last')+'.json';
        const data = readFileSync(filePath)
        return JSON.parse(data)
    },

    getBeforeOfertasCore() {
        let filePath = data_logs_path+'/'+history.get('ofertas_core_before')+'.json';
        const data = readFileSync(filePath)
        return JSON.parse(data)
    },
    getBeforeOfertas() {
        let filePath = data_logs_path+'/'+history.get('ofertas_before')+'.json';
        const data = readFileSync(filePath)
        return JSON.parse(data)
    },

    getLastProfessores() {
        if(history.get('professores_last') == undefined) {
            return {}
        }
        let filePath = data_logs_path+'/'+history.get('professores_last')+'.json';
        const data = readFileSync(filePath)
        return JSON.parse(data)
    },

    getLastAlunos() {
        if(history.get('alunos_last') == undefined) {
            return {}
        }
        let filePath = data_logs_path+'/'+history.get('alunos_last')+'.json';
        let data = readFileSync(filePath)
        let alunos_last = JSON.parse(data)

        if(history.get('alunos_core_last') == undefined) {
            return {}
        }
        filePath = data_logs_path+'/'+history.get('alunos_core_last')+'.json';
        data = readFileSync(filePath)
        let alunos_core_last = JSON.parse(data)
        return { alunos_last, alunos_core_last }
    },

    getLastDiarios() {
        if(history.get('diarios_last') == undefined) {
            return {}
        }
        let filePath = data_logs_path+'/'+history.get('diarios_last')+'.json';
        let data = readFileSync(filePath)
        let diarios_last = JSON.parse(data)

        if(history.get('diarios_core_last') == undefined) {
            return {}
        }
        filePath = data_logs_path+'/'+history.get('diarios_core_last')+'.json';
        data = readFileSync(filePath)
        let diarios_core_last = JSON.parse(data)
        return { diarios_last, diarios_core_last }
    }

}

export default history