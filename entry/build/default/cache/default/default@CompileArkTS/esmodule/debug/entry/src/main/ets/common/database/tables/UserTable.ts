import relationalStore from "@ohos:data.relationalStore";
import type UserData from '../../../viewmodel/UserData';
import CommonConstants from "@normalized:N&&&entry/src/main/ets/common/constants/CommonConstants&";
import Rdb from "@normalized:N&&&entry/src/main/ets/common/database/Rdb&";
export default class UserTable {
    private userTable = new Rdb(CommonConstants.USER_TABLE.tableName, CommonConstants.USER_TABLE.sqlCreate, CommonConstants.USER_TABLE.columns);
    constructor(callback: Function = () => {
    }) {
        this.userTable.getRdbStore(callback);
    }
    getRdbStore(callback: Function = () => {
    }) {
        this.userTable.getRdbStore(callback);
    }
    insertData(account: UserData, callback: Function) {
        const valueBucket: relationalStore.ValuesBucket = generateBucket(account);
        this.userTable.insertData(valueBucket, callback);
    }
    deleteData(account: UserData, callback: Function) {
        let predicates = new relationalStore.RdbPredicates(CommonConstants.USER_TABLE.tableName);
        predicates.equalTo('id', account.id);
        this.userTable.deleteData(predicates, callback);
    }
    updateData(account: UserData, callback: Function) {
        const valueBucket: relationalStore.ValuesBucket = generateBucket(account);
        let predicates = new relationalStore.RdbPredicates(CommonConstants.USER_TABLE.tableName);
        predicates.equalTo('id', account.id);
        this.userTable.updateData(predicates, valueBucket, callback);
    }
    query(account: string, callback: Function, isAll: boolean = true) {
        let predicates = new relationalStore.RdbPredicates(CommonConstants.USER_TABLE.tableName);
        if (!isAll) {
            predicates.equalTo('account', account);
        }
        this.userTable.query(predicates, (resultSet: relationalStore.ResultSet) => {
            let count: number = resultSet.rowCount;
            if (count === 0 || typeof count === 'string') {
                console.log(`${CommonConstants.USERTABLE_TAG}` + 'Query no results!');
                callback([]);
            }
            else {
                resultSet.goToFirstRow();
                const result: UserData[] = [];
                for (let i = 0; i < count; i++) {
                    let tmp: UserData = {
                        id: 0, account: '', password: ''
                    };
                    tmp.id = resultSet.getDouble(resultSet.getColumnIndex('id'));
                    tmp.account = resultSet.getString(resultSet.getColumnIndex('account'));
                    tmp.password = resultSet.getString(resultSet.getColumnIndex('password'));
                    result[i] = tmp;
                    resultSet.goToNextRow();
                }
                callback(result);
            }
        });
    }
}
function generateBucket(user: UserData): relationalStore.ValuesBucket {
    let obj: relationalStore.ValuesBucket = {};
    obj.account = user.account;
    obj.password = user.password;
    return obj;
}
