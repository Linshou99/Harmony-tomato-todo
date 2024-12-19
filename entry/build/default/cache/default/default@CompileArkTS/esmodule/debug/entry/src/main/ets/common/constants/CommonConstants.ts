import relationalStore from "@ohos:data.relationalStore";
import type { UserTable, TaskTable } from '../../viewmodel/ConstantsInterface';
export default class CommonConstants {
    /**
     * Rdb database config.
     */
    static readonly STORE_CONFIG: relationalStore.StoreConfig = {
        name: 'rdb_todo2.db',
        securityLevel: relationalStore.SecurityLevel.S1
    };
    /**
     * Account table config.
     */
    static readonly USER_TABLE: UserTable = {
        tableName: 'userTable',
        sqlCreate: 'CREATE TABLE IF NOT EXISTS UserTable(id INTEGER PRIMARY KEY AUTOINCREMENT, account TEXT, password TEXT)',
        columns: ['id', 'account', 'password']
    };
    static readonly TASK_TABLE: TaskTable = {
        tableName: 'taskTable',
        sqlCreate: 'CREATE TABLE IF NOT EXISTS taskTable(id INTEGER PRIMARY KEY AUTOINCREMENT, account TEXT, ' +
            'task_name TEXT, task_interval INTEGER, task_running_seconds INTEGER, task_start_times INTEGER)',
        columns: ['id', 'account', 'task_name', 'task_interval', 'task_running_seconds', 'task_start_times']
    };
    // /**
    //  * Search text of Search component.
    //  */
    // static readonly SEARCH_TEXT = '搜索';
    // /**
    //  * toast text of prompt component.
    //  */
    // static readonly TOAST_TEXT_1 = '账目类型不能为空';
    // static readonly TOAST_TEXT_2 = '账目金额不为正整数';
    // /**
    //  * Component size.
    //  */
    // static readonly FULL_WIDTH = '100%';
    // static readonly FULL_HEIGHT = '100%';
    // static readonly DIALOG_HEIGHT = '55%';
    // static readonly TABS_HEIGHT = '45%';
    // static readonly MINIMUM_SIZE = 0;
    // static readonly FULL_SIZE = 1;
    // static readonly PROMPT_BOTTOM = '70vp';
    // /**
    //  * Component location.
    //  */
    // static readonly EDIT_POSITION_X = '80%';
    // static readonly EDIT_POSITION_Y = '90%';
    // static readonly DELETE_POSITION_X = '50%';
    // static readonly DELETE_POSITION_Y = '90%';
    /**
     * Log tag.
     */
    static readonly RDB_TAG = '[Debug.Rdb]';
    static readonly USERTABLE_TAG = '[Debug.UserTable]';
    static readonly TASKTABLE_TAG = '[Debug.TaskTable]';
    static readonly INDEX_TAG = '[Debug.Index]';
}
