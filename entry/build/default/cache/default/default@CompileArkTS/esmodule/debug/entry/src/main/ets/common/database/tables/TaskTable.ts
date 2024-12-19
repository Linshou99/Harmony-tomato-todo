import relationalStore from "@ohos:data.relationalStore";
import type TaskData from '../../../viewmodel/TaskData';
import CommonConstants from "@normalized:N&&&entry/src/main/ets/common/constants/CommonConstants&";
import Rdb from "@normalized:N&&&entry/src/main/ets/common/database/Rdb&";
export default class TaskTable {
    private taskTable = new Rdb(CommonConstants.TASK_TABLE.tableName, CommonConstants.TASK_TABLE.sqlCreate, CommonConstants.TASK_TABLE.columns);
    constructor(callback: Function = () => {
    }) {
        this.taskTable.getRdbStore(callback);
    }
    getRdbStore(callback: Function = () => {
    }) {
        this.taskTable.getRdbStore(callback);
    }
    insertData(account: TaskData, callback: Function) {
        const valueBucket: relationalStore.ValuesBucket = generateBucket(account);
        this.taskTable.insertData(valueBucket, callback);
    }
    deleteData(account: TaskData, callback: Function) {
        let predicates = new relationalStore.RdbPredicates(CommonConstants.TASK_TABLE.tableName);
        predicates.equalTo('id', account.id);
        this.taskTable.deleteData(predicates, callback);
    }
    updateData(account: TaskData, callback: Function) {
        const valueBucket: relationalStore.ValuesBucket = generateBucket(account);
        let predicates = new relationalStore.RdbPredicates(CommonConstants.TASK_TABLE.tableName);
        predicates.equalTo('id', account.id);
        this.taskTable.updateData(predicates, valueBucket, callback);
    }
    query(account: string, callback: Function, isAll: boolean = true) {
        let predicates = new relationalStore.RdbPredicates(CommonConstants.TASK_TABLE.tableName);
        if (!isAll) {
            predicates.equalTo('account', account);
        }
        this.taskTable.query(predicates, (resultSet: relationalStore.ResultSet) => {
            let count: number = resultSet.rowCount;
            if (count === 0 || typeof count === 'string') {
                console.log(`${CommonConstants.TASKTABLE_TAG}` + 'Query no results!');
                callback([]);
            }
            else {
                resultSet.goToFirstRow();
                const result: TaskData[] = [];
                for (let i = 0; i < count; i++) {
                    let tmp: TaskData = {
                        id: 0, account: '', task_name: '', task_interval: 0, task_running_seconds: 0, task_start_times: 0
                    };
                    tmp.id = resultSet.getDouble(resultSet.getColumnIndex('id'));
                    tmp.account = resultSet.getString(resultSet.getColumnIndex('account'));
                    tmp.task_name = resultSet.getString(resultSet.getColumnIndex('task_name'));
                    tmp.task_interval = resultSet.getDouble(resultSet.getColumnIndex('task_interval'));
                    tmp.task_running_seconds = resultSet.getDouble(resultSet.getColumnIndex('task_running_seconds'));
                    tmp.task_start_times = resultSet.getDouble(resultSet.getColumnIndex('task_start_times'));
                    result[i] = tmp;
                    resultSet.goToNextRow();
                }
                callback(result);
            }
        });
    }
}
function generateBucket(task: TaskData): relationalStore.ValuesBucket {
    let obj: relationalStore.ValuesBucket = {};
    obj.account = task.account;
    obj.task_name = task.task_name;
    obj.task_interval = task.task_interval;
    obj.task_running_seconds = task.task_running_seconds;
    obj.task_start_times = task.task_start_times;
    return obj;
}
