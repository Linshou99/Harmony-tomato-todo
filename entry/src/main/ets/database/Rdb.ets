// 导入模块
import relationalStore from '@ohos.data.relationalStore';

// 获取context
let context = getContext(this);
export default class RDBStoreManager {

  private rdbStore: relationalStore.RdbStore | null = null;
  private tableName: string;
  private sqlCreateTable: string;
  private databaseName: string = 'Rdb_todo.db';

  constructor(tableName: string, sqlCreateTable: string) {
    this.tableName = tableName;
    this.sqlCreateTable = sqlCreateTable;
  }

  // 创建rdbStore
  async getRdbStore() {
    if (!this.rdbStore) {
      console.log('RDBStoreManager', 'The rdbStore exists.');
      return
    }
    try {
      let rdb = await relationalStore.getRdbStore(context, {
        name: this.databaseName, // 数据库文件名
        securityLevel: relationalStore.SecurityLevel.S1, // 数据库安全级别
        encrypt: false // 可选参数，是否加密，默认不加密
      });
      this.rdbStore = rdb;
      this.rdbStore.executeSql(this.sqlCreateTable);
    } catch (error) {
      console.log('RDBStoreManager', `gerRdbStore() failed, err: ${error}`);
    }
  }

  // 插入数据
  async insertData(data: relationalStore.ValuesBucket): Promise<number | null> {
    const valueBucket: relationalStore.ValuesBucket = data;
    if (this.rdbStore) {
      try {
        let result = await this.rdbStore.insert(this.tableName, valueBucket);
        return result;
      } catch (error) {
        console.log('RDBStoreManager', `insertData() failed, err: ${JSON.stringify(error)}`);
      }
    }
    return null;
  }

  // 删除数据
  async deleteData(predicates: relationalStore.RdbPredicates): Promise<number | null> {
    if (this.rdbStore) {
      try {
        let result = await this.rdbStore.delete(predicates);
        return result;
      } catch (error) {
        console.log('RDBStoreManager', `deleteData() failed, err: ${error}`);
      }
    }
    return null;
  }

  // 更新数据
  async updateData(predicates: relationalStore.RdbPredicates, data: relationalStore.ValuesBucket): Promise<number | null> {
    if (this.rdbStore) {
      try {
        let result = await this.rdbStore.update(data, predicates);
        return result;
      } catch (error) {
        console.log('RDBStoreManager', `updateData() failed, err: ${error}`);
      }
    }
    return null;
  }

  // 查询数据
  async query(predicates: relationalStore.RdbPredicates): Promise<relationalStore.ResultSet | null> {
    if (this.rdbStore) {
      try {
        let result = await this.rdbStore.query(predicates)
        return result;
      } catch (error) {
        console.log('RDBStoreManager', `query() failed, err: ${error}`);
      }
    }
    return null;
  }
}




// import{relationalStore}from'@kit.ArkData';//导入模块
// import{UIAbility}from'@kit.AbilityKit';
// import{BusinessError}from'@kit.BasicServicesKit';
// import{window}from'@kit.ArkUI';
//
// //此处示例在Ability中实现，使用者也可以在其他合理场景中使用
// class EntryAbility extends UIAbility{
//   onWindowStageCreate(windowStage:window.WindowStage){
//     const STORE_CONFIG:relationalStore.StoreConfig={
//       name:'RdbTest.db',//数据库文件名
//       securityLevel:relationalStore.SecurityLevel.S1,//数据库安全级别
//       encrypt:false,//可选参数，指定数据库是否加密，默认不加密
//       customDir:'userDir',//可选参数，数据库自定义路径。数据库将在如下的目录结构中被创建：context.databaseDir+'/rdb/'+customDir，其中context.databaseDir是应用沙箱对应的路径，'/rdb/'表示创建的是关系型数据库，customDir表示自定义的路径。当此参数不填时，默认在本应用沙箱目录下创建RdbStore实例。
//       isReadOnly:false//可选参数，指定数据库是否以只读方式打开。该参数默认为false，表示数据库可读可写。该参数为true时，只允许从数据库读取数据，不允许对数据库进行写操作，否则会返回错误码801。
//     };
//     //判断数据库版本，如果不匹配则需进行升降级操作
//     //假设当前数据库版本为3，表结构：EMPLOYEE(NAME,AGE,SALARY,CODES,IDENTITY)
//     const SQL_CREATE_TABLE='CREATE TABLE IF NOT EXISTS EMPLOYEE(ID INTEGER PRIMARY KEY AUTOINCREMENT,NAME TEXT NOT NULL,' +
//       'AGE INTEGER,SALARY REAL,CODES BLOB,IDENTITY UNLIMITED INT)';//建表Sql语句,IDENTITY为bigint类型，sql中指定类型为UNLIMITEDINT
//
//     relationalStore.getRdbStore(this.context,STORE_CONFIG,(err,store)=>{
//       if(err){
//         console.error(`Failed to get RdbStore. Code:${err.code},message:${err.message}`);
//         return;
//       }
//       console.info('Succeeded in getting RdbStore.');
//
//       //当数据库创建时，数据库默认版本为0
//       if(store.version===0){
//         store.executeSql(SQL_CREATE_TABLE);//创建数据表
//         //设置数据库的版本，入参为大于0的整数
//         store.version=3;
//       }
//
//       //如果数据库版本不为0且和当前数据库版本不匹配，需要进行升降级操作
//       //当数据库存在并假定版本为1时，例应用从某一版本升级到当前版本，数据库需要从1版本升级到2版本
//       if(store.version===1){
//         //version=1：表结构：EMPLOYEE(NAME,SALARY,CODES,ADDRESS)=>version=2：表结构：EMPLOYEE(NAME,AGE,SALARY,CODES,ADDRESS)
//         if(store!==undefined){
//           (store as relationalStore.RdbStore).executeSql('ALTER TABLE EMPLOYEE ADD COLUMN AGE INTEGER');
//           store.version=2;
//         }
//       }
//
//       //当数据库存在并假定版本为2时，例应用从某一版本升级到当前版本，数据库需要从2版本升级到3版本
//       if(store.version===2){
//         //version=2：表结构：EMPLOYEE(NAME,AGE,SALARY,CODES,ADDRESS)=>version=3：表结构：EMPLOYEE(NAME,AGE,SALARY,CODES)
//         if(store!==undefined){
//           (store as relationalStore.RdbStore).executeSql('ALTER TABLE EMPLOYEE DROP COLUMN ADDRESS TEXT');
//           store.version=3;
//         }
//       }
//     });
//
//     //请确保获取到RdbStore实例后，再进行数据库的增、删、改、查等操作
//   }
// }
