/*
 * Copyright (c) 2023 Huawei Device Co., Ltd.
 * Licensed under the Apache License,Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { relationalStore } from '@kit.ArkData';
// import UserData from '../../../viewmodel/UserData';
import UserData from '../../../viewmodel/UserData';
// import TaskData from '../../../viewmodel/TaskData';
import CommonConstants from '../../constants/CommonConstants';
import Rdb from '../Rdb';

export default class UserTable {
  private userTable = new Rdb(CommonConstants.USER_TABLE.tableName, CommonConstants.USER_TABLE.sqlCreate,
    CommonConstants.USER_TABLE.columns);

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
      } else {
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
