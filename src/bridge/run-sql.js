import { DBSQLClient } from '@databricks/sql'
import ora from 'ora';

const spinner = ora({
    spinner: {
        interval: 200,
        frames: ['.', '..', '...', '..']
    }
})

const client = new DBSQLClient();

export default function (query, callback) {
    spinner.start()
    client.connect({
        host: 'dbc-6bbd0475-9582.cloud.databricks.com',
        path: '/sql/1.0/endpoints/21e836c46259bbf2',
        token: 'dapi6fb933fe3ea4c5dfa3f0282e28d67913',
    }).then(async (client) => {

        client.on('error', (error) => {
            console.log("error", error);
            callback(null)
        });

        const session = await client.openSession();

        const queryOperation = await session.executeStatement(query, { runAsync: true });
        //console.log("queryOperation", queryOperation);
        //const result = await queryOperation.fetchAll();

        const result = await queryOperation.fetchAll({
            progress: true,
            callback: (stateResponse) => {
                console.log('waiting... ', stateResponse.status.statusCode);
            },
        });

        await queryOperation.close();

        //console.table(result);
        await session.close();
        await client.close();
        spinner.stop()
        callback(result)
    }).catch((error) => {
        console.log(error);
        spinner.stop()
        callback(null)
    });

}
