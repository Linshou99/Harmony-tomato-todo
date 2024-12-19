if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    params?;
    tasks?: Array<TaskData>;
    account?;
    index?: number;
    totalTask?: number;
    finishTask?: number;
    TaskTable?;
    textValue?: string;
    new_task_name?: string;
    new_task_profile?: string;
    new_task_interval?: number;
    new_task_time?: number;
    task_id?: number;
    task_name?: string;
    task_profile?: string;
    task_interval?: number;
    task_start_times?: number;
    task_running_seconds?: number;
    newTask?: TaskData;
    range?: string[];
    isInsert?: boolean;
    dialogController?: CustomDialogController;
}
import router from "@ohos:router";
import CommonConstants from "@normalized:N&&&entry/src/main/ets/common/constants/CommonConstants&";
import TaskTable from "@normalized:N&&&entry/src/main/ets/common/database/tables/TaskTable&";
import Logger from "@normalized:N&&&entry/src/main/ets/common/utils/Logger&";
import type TaskData from '../viewmodel/TaskData';
import { DialogComponent } from "@normalized:N&&&entry/src/main/ets/view/DialogComponent&";
interface PageParams {
    tasks?: Array<TaskData>; // 可选参数，可能未传递
    account?: string; // 可选参数，可能未传递
}
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.params = router.getParams() as PageParams;
        this.__tasks = new ObservedPropertyObjectPU(this.params.tasks ?? [], this, "tasks");
        this.account = this.params.account ?? '';
        this.__index = new ObservedPropertySimplePU(0, this, "index");
        this.__totalTask = new ObservedPropertySimplePU(0, this, "totalTask");
        this.__finishTask = new ObservedPropertySimplePU(0
        // @State tasks: Array<TaskData> = [];
        , this, "finishTask");
        this.TaskTable = new TaskTable(() => { });
        this.__textValue = new ObservedPropertySimplePU('', this, "textValue");
        this.__new_task_name = new ObservedPropertySimplePU('', this, "new_task_name");
        this.__new_task_profile = new ObservedPropertySimplePU('', this, "new_task_profile");
        this.__new_task_interval = new ObservedPropertySimplePU(25, this, "new_task_interval");
        this.__new_task_time = new ObservedPropertySimplePU(-1, this, "new_task_time");
        this.__task_id = new ObservedPropertySimplePU(0, this, "task_id");
        this.__task_name = new ObservedPropertySimplePU('', this, "task_name");
        this.__task_profile = new ObservedPropertySimplePU('', this, "task_profile");
        this.__task_interval = new ObservedPropertySimplePU(25, this, "task_interval");
        this.__task_start_times = new ObservedPropertySimplePU(-1, this, "task_start_times");
        this.__task_running_seconds = new ObservedPropertySimplePU(0, this, "task_running_seconds");
        this.__newTask = new ObservedPropertyObjectPU({ id: -1, account: this.account, task_name: '', task_interval: 25, task_start_times: 0,
            task_running_seconds: 0 }, this, "newTask");
        this.__range = new ObservedPropertyObjectPU(['1min', '5min', '10min', '25min', '30min', '45min', '60min'], this, "range");
        this.__isInsert = new ObservedPropertySimplePU(false, this, "isInsert");
        this.dialogController = new CustomDialogController({
            builder: () => {
                let jsDialog = new DialogComponent(this, {
                    isInsert: this.__isInsert,
                    newTask: this.__newTask,
                    confirm: (isInsert: boolean, newTask: TaskData) => this.accept(isInsert, newTask)
                }, undefined, -1, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 111, col: 14 });
                jsDialog.setController(this.dialogController);
                ViewPU.create(jsDialog);
                let paramsLambda = () => {
                    return {
                        isInsert: this.__isInsert,
                        newTask: this.__newTask,
                        confirm: (isInsert: boolean, newTask: TaskData) => this.accept(isInsert, newTask)
                    };
                };
                jsDialog.paramsGenerator_ = paramsLambda;
            },
            cancel: this.exitApp,
            autoCancel: true,
            alignment: DialogAlignment.Center,
            offset: { dx: 0, dy: -20 },
            gridCount: 4,
            customStyle: false,
            cornerRadius: 10
        }, this);
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.params !== undefined) {
            this.params = params.params;
        }
        if (params.tasks !== undefined) {
            this.tasks = params.tasks;
        }
        if (params.account !== undefined) {
            this.account = params.account;
        }
        if (params.index !== undefined) {
            this.index = params.index;
        }
        if (params.totalTask !== undefined) {
            this.totalTask = params.totalTask;
        }
        if (params.finishTask !== undefined) {
            this.finishTask = params.finishTask;
        }
        if (params.TaskTable !== undefined) {
            this.TaskTable = params.TaskTable;
        }
        if (params.textValue !== undefined) {
            this.textValue = params.textValue;
        }
        if (params.new_task_name !== undefined) {
            this.new_task_name = params.new_task_name;
        }
        if (params.new_task_profile !== undefined) {
            this.new_task_profile = params.new_task_profile;
        }
        if (params.new_task_interval !== undefined) {
            this.new_task_interval = params.new_task_interval;
        }
        if (params.new_task_time !== undefined) {
            this.new_task_time = params.new_task_time;
        }
        if (params.task_id !== undefined) {
            this.task_id = params.task_id;
        }
        if (params.task_name !== undefined) {
            this.task_name = params.task_name;
        }
        if (params.task_profile !== undefined) {
            this.task_profile = params.task_profile;
        }
        if (params.task_interval !== undefined) {
            this.task_interval = params.task_interval;
        }
        if (params.task_start_times !== undefined) {
            this.task_start_times = params.task_start_times;
        }
        if (params.task_running_seconds !== undefined) {
            this.task_running_seconds = params.task_running_seconds;
        }
        if (params.newTask !== undefined) {
            this.newTask = params.newTask;
        }
        if (params.range !== undefined) {
            this.range = params.range;
        }
        if (params.isInsert !== undefined) {
            this.isInsert = params.isInsert;
        }
        if (params.dialogController !== undefined) {
            this.dialogController = params.dialogController;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__tasks.purgeDependencyOnElmtId(rmElmtId);
        this.__index.purgeDependencyOnElmtId(rmElmtId);
        this.__totalTask.purgeDependencyOnElmtId(rmElmtId);
        this.__finishTask.purgeDependencyOnElmtId(rmElmtId);
        this.__textValue.purgeDependencyOnElmtId(rmElmtId);
        this.__new_task_name.purgeDependencyOnElmtId(rmElmtId);
        this.__new_task_profile.purgeDependencyOnElmtId(rmElmtId);
        this.__new_task_interval.purgeDependencyOnElmtId(rmElmtId);
        this.__new_task_time.purgeDependencyOnElmtId(rmElmtId);
        this.__task_id.purgeDependencyOnElmtId(rmElmtId);
        this.__task_name.purgeDependencyOnElmtId(rmElmtId);
        this.__task_profile.purgeDependencyOnElmtId(rmElmtId);
        this.__task_interval.purgeDependencyOnElmtId(rmElmtId);
        this.__task_start_times.purgeDependencyOnElmtId(rmElmtId);
        this.__task_running_seconds.purgeDependencyOnElmtId(rmElmtId);
        this.__newTask.purgeDependencyOnElmtId(rmElmtId);
        this.__range.purgeDependencyOnElmtId(rmElmtId);
        this.__isInsert.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__tasks.aboutToBeDeleted();
        this.__index.aboutToBeDeleted();
        this.__totalTask.aboutToBeDeleted();
        this.__finishTask.aboutToBeDeleted();
        this.__textValue.aboutToBeDeleted();
        this.__new_task_name.aboutToBeDeleted();
        this.__new_task_profile.aboutToBeDeleted();
        this.__new_task_interval.aboutToBeDeleted();
        this.__new_task_time.aboutToBeDeleted();
        this.__task_id.aboutToBeDeleted();
        this.__task_name.aboutToBeDeleted();
        this.__task_profile.aboutToBeDeleted();
        this.__task_interval.aboutToBeDeleted();
        this.__task_start_times.aboutToBeDeleted();
        this.__task_running_seconds.aboutToBeDeleted();
        this.__newTask.aboutToBeDeleted();
        this.__range.aboutToBeDeleted();
        this.__isInsert.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // @State account: string = (router.getParams() as Record<string,string>) ['account'];
    private params;
    private __tasks: ObservedPropertyObjectPU<Array<TaskData>>; // 如果没有传递任务，使用空数组
    get tasks() {
        return this.__tasks.get();
    }
    set tasks(newValue: Array<TaskData>) {
        this.__tasks.set(newValue);
    }
    private account; // 如果没有传递账户，使用空字符串
    // @State account: string = ''
    private __index: ObservedPropertySimplePU<number>;
    get index() {
        return this.__index.get();
    }
    set index(newValue: number) {
        this.__index.set(newValue);
    }
    private __totalTask: ObservedPropertySimplePU<number>;
    get totalTask() {
        return this.__totalTask.get();
    }
    set totalTask(newValue: number) {
        this.__totalTask.set(newValue);
    }
    private __finishTask: ObservedPropertySimplePU<number>;
    get finishTask() {
        return this.__finishTask.get();
    }
    set finishTask(newValue: number) {
        this.__finishTask.set(newValue);
    }
    // @State tasks: Array<TaskData> = [];
    private TaskTable;
    private __textValue: ObservedPropertySimplePU<string>;
    get textValue() {
        return this.__textValue.get();
    }
    set textValue(newValue: string) {
        this.__textValue.set(newValue);
    }
    private __new_task_name: ObservedPropertySimplePU<string>;
    get new_task_name() {
        return this.__new_task_name.get();
    }
    set new_task_name(newValue: string) {
        this.__new_task_name.set(newValue);
    }
    private __new_task_profile: ObservedPropertySimplePU<string>;
    get new_task_profile() {
        return this.__new_task_profile.get();
    }
    set new_task_profile(newValue: string) {
        this.__new_task_profile.set(newValue);
    }
    private __new_task_interval: ObservedPropertySimplePU<number>;
    get new_task_interval() {
        return this.__new_task_interval.get();
    }
    set new_task_interval(newValue: number) {
        this.__new_task_interval.set(newValue);
    }
    private __new_task_time: ObservedPropertySimplePU<number>;
    get new_task_time() {
        return this.__new_task_time.get();
    }
    set new_task_time(newValue: number) {
        this.__new_task_time.set(newValue);
    }
    private __task_id: ObservedPropertySimplePU<number>;
    get task_id() {
        return this.__task_id.get();
    }
    set task_id(newValue: number) {
        this.__task_id.set(newValue);
    }
    private __task_name: ObservedPropertySimplePU<string>;
    get task_name() {
        return this.__task_name.get();
    }
    set task_name(newValue: string) {
        this.__task_name.set(newValue);
    }
    private __task_profile: ObservedPropertySimplePU<string>;
    get task_profile() {
        return this.__task_profile.get();
    }
    set task_profile(newValue: string) {
        this.__task_profile.set(newValue);
    }
    private __task_interval: ObservedPropertySimplePU<number>;
    get task_interval() {
        return this.__task_interval.get();
    }
    set task_interval(newValue: number) {
        this.__task_interval.set(newValue);
    }
    private __task_start_times: ObservedPropertySimplePU<number>;
    get task_start_times() {
        return this.__task_start_times.get();
    }
    set task_start_times(newValue: number) {
        this.__task_start_times.set(newValue);
    }
    private __task_running_seconds: ObservedPropertySimplePU<number>;
    get task_running_seconds() {
        return this.__task_running_seconds.get();
    }
    set task_running_seconds(newValue: number) {
        this.__task_running_seconds.set(newValue);
    }
    private __newTask: ObservedPropertyObjectPU<TaskData>;
    get newTask() {
        return this.__newTask.get();
    }
    set newTask(newValue: TaskData) {
        this.__newTask.set(newValue);
    }
    private __range: ObservedPropertyObjectPU<string[]>;
    get range() {
        return this.__range.get();
    }
    set range(newValue: string[]) {
        this.__range.set(newValue);
    }
    private __isInsert: ObservedPropertySimplePU<boolean>;
    get isInsert() {
        return this.__isInsert.get();
    }
    set isInsert(newValue: boolean) {
        this.__isInsert.set(newValue);
    }
    //
    aboutToAppear(): void {
        console.log('this.account:' + this.account);
        this.TaskTable.getRdbStore(() => {
            this.TaskTable.query(this.account, (result: TaskData[]) => { this.tasks = result; }, false);
        });
    }
    private formatTime_hms(timeInSeconds: number): string {
        const hours = Math.floor(timeInSeconds / 3600); // 计算小时数
        const minutes = Math.floor((timeInSeconds % 3600) / 60); // 计算剩余的分钟数
        const seconds = timeInSeconds % 60; // 计算剩余的秒数
        return `${hours}时${minutes}分${seconds}秒`;
    }
    accept(isInsert: boolean, newTask: TaskData): void {
        console.info('accept this.isInsert:' + isInsert + 'this.newTask:' + JSON.stringify(newTask));
        if (isInsert) {
            Logger.info(`${CommonConstants.INDEX_TAG}`, `The account inserted is:  ${JSON.stringify(newTask)}`);
            this.TaskTable.insertData(newTask, (id: number) => {
                if (id >= 0) {
                    console.log(`Task added successfully with ID: ${id}`);
                    newTask.id = id;
                    this.tasks.push(newTask);
                }
                else {
                    console.log('Task addition failed.');
                }
            });
        }
        else {
            Logger.info(`${CommonConstants.INDEX_TAG}`, `The account updated is:  ${JSON.stringify(newTask)}`);
            this.TaskTable.updateData(newTask, () => {
                const index = this.tasks.findIndex(task => task.id === newTask.id);
                if (index !== -1) {
                    // 删除原来的任务
                    this.tasks.splice(index, 1);
                    // 在同一位置插入新任务
                    this.tasks.splice(index, 0, newTask);
                    console.log(`Task updated successfully at index: ${index}`);
                }
                else {
                    console.log('Task update failed: Task not found in the list.');
                }
            });
        }
        this.isInsert = false;
        this.newTask = { id: -1, account: this.account, task_name: '', task_interval: 25, task_start_times: 0,
            task_running_seconds: 0 };
    }
    private dialogController: CustomDialogController;
    exitApp() {
        console.info('Click the callback in the blank area');
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.justifyContent(FlexAlign.Start);
            Row.alignItems(VerticalAlign.Center);
            Row.width('100%');
            Row.height(60);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 5 });
            Column.margin({ left: 10 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('用户：' + this.account);
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Bold);
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('拥有' + this.tasks.length + "个事项");
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Bold);
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('+');
            Button.width(40);
            Button.height(40);
            Button.onClick(() => {
                // 添加任务总数据和数量
                this.isInsert = true;
                if (this.dialogController != null) {
                    this.dialogController.open();
                }
            });
            Button.backgroundColor(0x317aff);
            Button.fontColor(0xffffff);
            Button.fontSize(15);
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create({ space: 10 });
            List.width('100%');
            List.alignListItem(ListItemAlign.Center);
            List.layoutWeight(1);
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index) => {
                const item = _item;
                {
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        itemCreation2(elmtId, isInitialRender);
                        if (!isInitialRender) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        ListItem.create(deepRenderFunction, true);
                        ListItem.onClick(() => {
                            //添加任务总数据和数量
                            this.isInsert = false;
                            this.newTask = item;
                            if (this.dialogController != null) {
                                this.dialogController.open();
                            }
                        });
                        ListItem.swipeAction({ end: this.DeleteButton.bind(this, index, item) });
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            RelativeContainer.create();
                            RelativeContainer.width('95%');
                            RelativeContainer.height(50);
                            RelativeContainer.padding(16);
                            RelativeContainer.backgroundColor('#FFF5EE');
                            RelativeContainer.borderRadius(12);
                            RelativeContainer.shadow({
                                radius: 8,
                                color: '#D3D3D3',
                                offsetX: 0,
                                offsetY: 2
                            });
                        }, RelativeContainer);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(item.task_name);
                            Text.fontSize(20);
                            Text.id('name');
                            Text.alignRules({
                                top: { anchor: "__container__", align: VerticalAlign.Center },
                                left: { anchor: "__container__", align: HorizontalAlign.Start }
                            });
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(`${item.task_interval.toString()}min | 累计已完整专注${item.task_start_times}次，累计专注${this.formatTime_hms(item.task_running_seconds)}`);
                            Text.fontSize(10);
                            Text.alignRules({
                                top: { anchor: 'name', align: VerticalAlign.Bottom },
                                left: { anchor: 'name', align: HorizontalAlign.Start }
                            });
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Button.createWithLabel('开始', { type: ButtonType.Normal, stateEffect: true });
                            Button.borderRadius(8);
                            Button.backgroundColor(0x317aff);
                            Button.width(50);
                            Button.onClick(() => {
                                router.pushUrl({
                                    url: 'pages/CountDown',
                                    params: {
                                        task: item,
                                        tasks: this.tasks,
                                        account: this.account
                                    }
                                });
                            });
                            Button.alignRules({
                                right: { anchor: "__container__", align: HorizontalAlign.End }
                            });
                        }, Button);
                        Button.pop();
                        RelativeContainer.pop();
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, this.tasks, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        List.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 添加返回登录页面的按钮
            Button.createWithLabel('返回登录');
            // 添加返回登录页面的按钮
            Button.width('100%');
            // 添加返回登录页面的按钮
            Button.height(50);
            // 添加返回登录页面的按钮
            Button.backgroundColor(0xff4444);
            // 添加返回登录页面的按钮
            Button.fontColor(0xffffff);
            // 添加返回登录页面的按钮
            Button.fontSize(18);
            // 添加返回登录页面的按钮
            Button.onClick(() => {
                router.pushUrl({
                    url: 'pages/Login'
                });
            });
        }, Button);
        // 添加返回登录页面的按钮
        Button.pop();
        Column.pop();
    }
    DeleteButton(index: number, item: TaskData, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(40);
            Button.height(40);
            Button.type(ButtonType.Capsule);
            Button.backgroundColor(Color.Red);
            Button.onClick(() => {
                AlertDialog.show({
                    message: "是否删除此事项？",
                    // title: "是否删除此文件？",
                    // message: "移动到最近删除后最长保留30天，之后将永久删除。",
                    alignment: DialogAlignment.Bottom,
                    primaryButton: {
                        value: '取消',
                        fontColor: Color.Blue,
                        action: () => {
                            console.info('点击了取消');
                        }
                    },
                    secondaryButton: {
                        value: '删除',
                        fontColor: Color.Red,
                        action: () => {
                            console.info('点击了删除');
                            this.TaskTable.deleteData(item, (id: number) => {
                                if (id >= 0) {
                                    this.tasks.splice(index, 1);
                                    console.log(`Task deleted successfully with ID: ${id}`);
                                }
                                else {
                                    console.log('Task deletion failed.');
                                }
                            });
                        }
                    },
                });
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777217, "type": 20000, params: [], "bundleName": "com.example.todo", "moduleName": "entry" });
            Image.fillColor(Color.White);
            Image.width(20);
        }, Image);
        Button.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.example.todo", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false" });
