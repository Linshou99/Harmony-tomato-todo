if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CountDown_Params {
    remainingTime?: number;
    isRunning?: boolean;
    isResting?: boolean;
    intervalId?: number | null;
    task?: TaskData;
    account?: string;
    newTask?: TaskData;
    tasks?: Array<TaskData>;
    TaskTable?;
    totalWorkTime?: number;
    completedRounds?: number;
}
import router from "@ohos:router";
import type TaskData from '../viewmodel/TaskData';
import TaskTable from "@normalized:N&&&entry/src/main/ets/common/database/tables/TaskTable&";
import CommonConstants from "@normalized:N&&&entry/src/main/ets/common/constants/CommonConstants&";
import Logger from "@normalized:N&&&entry/src/main/ets/common/utils/Logger&";
class CountDown extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__remainingTime = new ObservedPropertySimplePU(0, this, "remainingTime");
        this.__isRunning = new ObservedPropertySimplePU(false, this, "isRunning");
        this.__isResting = new ObservedPropertySimplePU(false, this, "isResting");
        this.intervalId = null;
        this.__task = new ObservedPropertyObjectPU((router.getParams() as Record<string, TaskData>)['task'], this, "task");
        this.__account = new ObservedPropertySimplePU((router.getParams() as Record<string, string>)['account'], this, "account");
        this.__newTask = new ObservedPropertyObjectPU({
            id: -1,
            account: this.account,
            task_name: '',
            task_interval: 25,
            task_start_times: 0,
            task_running_seconds: 0,
        }, this, "newTask");
        this.__tasks = new ObservedPropertyObjectPU([], this, "tasks");
        this.TaskTable = new TaskTable(() => { });
        this.__totalWorkTime = new ObservedPropertySimplePU(0, this, "totalWorkTime");
        this.__completedRounds = new ObservedPropertySimplePU(0, this, "completedRounds");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CountDown_Params) {
        if (params.remainingTime !== undefined) {
            this.remainingTime = params.remainingTime;
        }
        if (params.isRunning !== undefined) {
            this.isRunning = params.isRunning;
        }
        if (params.isResting !== undefined) {
            this.isResting = params.isResting;
        }
        if (params.intervalId !== undefined) {
            this.intervalId = params.intervalId;
        }
        if (params.task !== undefined) {
            this.task = params.task;
        }
        if (params.account !== undefined) {
            this.account = params.account;
        }
        if (params.newTask !== undefined) {
            this.newTask = params.newTask;
        }
        if (params.tasks !== undefined) {
            this.tasks = params.tasks;
        }
        if (params.TaskTable !== undefined) {
            this.TaskTable = params.TaskTable;
        }
        if (params.totalWorkTime !== undefined) {
            this.totalWorkTime = params.totalWorkTime;
        }
        if (params.completedRounds !== undefined) {
            this.completedRounds = params.completedRounds;
        }
    }
    updateStateVars(params: CountDown_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__remainingTime.purgeDependencyOnElmtId(rmElmtId);
        this.__isRunning.purgeDependencyOnElmtId(rmElmtId);
        this.__isResting.purgeDependencyOnElmtId(rmElmtId);
        this.__task.purgeDependencyOnElmtId(rmElmtId);
        this.__account.purgeDependencyOnElmtId(rmElmtId);
        this.__newTask.purgeDependencyOnElmtId(rmElmtId);
        this.__tasks.purgeDependencyOnElmtId(rmElmtId);
        this.__totalWorkTime.purgeDependencyOnElmtId(rmElmtId);
        this.__completedRounds.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__remainingTime.aboutToBeDeleted();
        this.__isRunning.aboutToBeDeleted();
        this.__isResting.aboutToBeDeleted();
        this.__task.aboutToBeDeleted();
        this.__account.aboutToBeDeleted();
        this.__newTask.aboutToBeDeleted();
        this.__tasks.aboutToBeDeleted();
        this.__totalWorkTime.aboutToBeDeleted();
        this.__completedRounds.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __remainingTime: ObservedPropertySimplePU<number>; // 当前倒计时剩余时间（单位：秒）
    get remainingTime() {
        return this.__remainingTime.get();
    }
    set remainingTime(newValue: number) {
        this.__remainingTime.set(newValue);
    }
    private __isRunning: ObservedPropertySimplePU<boolean>; // 是否正在倒计时
    get isRunning() {
        return this.__isRunning.get();
    }
    set isRunning(newValue: boolean) {
        this.__isRunning.set(newValue);
    }
    private __isResting: ObservedPropertySimplePU<boolean>; // 是否处于休息阶段
    get isResting() {
        return this.__isResting.get();
    }
    set isResting(newValue: boolean) {
        this.__isResting.set(newValue);
    }
    private intervalId: number | null; // 定时器ID
    private __task: ObservedPropertyObjectPU<TaskData>;
    get task() {
        return this.__task.get();
    }
    set task(newValue: TaskData) {
        this.__task.set(newValue);
    }
    private __account: ObservedPropertySimplePU<string>;
    get account() {
        return this.__account.get();
    }
    set account(newValue: string) {
        this.__account.set(newValue);
    }
    private __newTask: ObservedPropertyObjectPU<TaskData>;
    get newTask() {
        return this.__newTask.get();
    }
    set newTask(newValue: TaskData) {
        this.__newTask.set(newValue);
    }
    private __tasks: ObservedPropertyObjectPU<Array<TaskData>>;
    get tasks() {
        return this.__tasks.get();
    }
    set tasks(newValue: Array<TaskData>) {
        this.__tasks.set(newValue);
    }
    private TaskTable;
    private __totalWorkTime: ObservedPropertySimplePU<number>; // 累计工作时间（秒）
    get totalWorkTime() {
        return this.__totalWorkTime.get();
    }
    set totalWorkTime(newValue: number) {
        this.__totalWorkTime.set(newValue);
    }
    private __completedRounds: ObservedPropertySimplePU<number>; // 完整的工作倒计时轮数
    get completedRounds() {
        return this.__completedRounds.get();
    }
    set completedRounds(newValue: number) {
        this.__completedRounds.set(newValue);
    }
    aboutToAppear(): void {
        this.newTask = this.task;
        this.remainingTime = this.task.task_interval * 60; // 初始化倒计时时间
        this.TaskTable.getRdbStore(() => {
            this.TaskTable.query(this.account, (result: TaskData[]) => {
                this.tasks = result;
            }, false);
        });
    }
    update_task(newTask: TaskData, callback?: () => void): void {
        Logger.info(`${CommonConstants.INDEX_TAG}`, `The account updated is:  ${JSON.stringify(newTask)}`);
        this.TaskTable.updateData(newTask, (id: number) => {
            const index = this.tasks.findIndex((task) => task.id === newTask.id);
            if (id >= 0) {
                console.log(`Task updated successfully`);
                if (index !== -1) {
                    this.tasks.splice(index, 1);
                    this.tasks.splice(index, 0, newTask);
                    console.log(`Task updated successfully at index: ${index}`);
                    if (callback)
                        callback(); // 更新完成后执行回调
                }
            }
            else {
                console.log('Task update failed.');
            }
        });
    }
    private promptRestDecision() {
        AlertDialog.show({
            message: '工作倒计时已结束，是否进入休息阶段？',
            alignment: DialogAlignment.Center,
            primaryButton: {
                value: '进入休息',
                fontColor: Color.Blue,
                action: () => {
                    console.info('用户选择进入休息');
                    this.startRestCountdown(); // 开启休息倒计时
                },
            },
            secondaryButton: {
                value: '跳过',
                fontColor: Color.Red,
                action: () => {
                    console.info('用户选择跳过休息');
                    this.isRunning = false; // 进入暂停状态
                    this.isResting = true;
                },
            },
        });
    }
    private promptWorkDecision() {
        AlertDialog.show({
            message: '休息倒计时已结束，是否进入工作阶段？',
            alignment: DialogAlignment.Center,
            primaryButton: {
                value: '进入工作',
                fontColor: Color.Blue,
                action: () => {
                    console.info('用户选择进入工作');
                    this.startWorkCountdown(); // 开启工作倒计时
                },
            },
            secondaryButton: {
                value: '暂不',
                fontColor: Color.Red,
                action: () => {
                    console.info('用户选择暂不工作');
                    this.isRunning = false; // 进入暂停状态
                    this.isResting = false;
                    this.remainingTime = this.task.task_interval * 60;
                },
            },
        });
    }
    private startCountdown() {
        this.isRunning = true;
        this.intervalId = setInterval(() => {
            if (this.remainingTime > 0) {
                this.remainingTime--;
            }
            else {
                this.stopCountdown();
                if (this.isResting) {
                    this.promptWorkDecision(); // 提示是否进入工作
                }
                else {
                    this.completedRounds++; // 完成工作倒计时
                    this.promptRestDecision(); // 提示是否进入休息
                }
            }
        }, 1000);
    }
    private stopCountdown() {
        this.isRunning = false;
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    private startRestCountdown() {
        this.isResting = true;
        this.remainingTime = 5; // 5分钟休息
        this.startCountdown();
    }
    private startWorkCountdown() {
        this.stopCountdown();
        this.isResting = false;
        this.remainingTime = this.task.task_interval * 60;
        this.startCountdown();
    }
    private calculateTotalWorkTime() {
        const currentWorkTime = this.isResting
            ? 0
            : this.task.task_interval * 60 - this.remainingTime; // 当前未完成轮的工作时间
        this.totalWorkTime = this.completedRounds * this.task.task_interval * 60 + currentWorkTime;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F1F3F5');
            Column.alignItems(HorizontalAlign.Center);
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`已专注 ${this.task.task_name} ${this.completedRounds} 次`);
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.textAlign(TextAlign.Center);
            Text.margin({ top: 20, bottom: 10 });
            Text.fontColor(Color.Black);
        }, Text);
        Text.pop();
        this.buildCountdownProgress.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('返回');
            Button.fontSize(20);
            Button.fontWeight(FontWeight.Medium);
            Button.backgroundColor(Color.Blue);
            Button.fontColor(Color.White);
            Button.width(200);
            Button.height(50);
            Button.margin({ top: 30 });
            Button.alignSelf(ItemAlign.Center);
            Button.onClick(() => {
                this.calculateTotalWorkTime();
                router.showAlertBeforeBackPage({ message: '是否确认返回？' });
                this.newTask.task_running_seconds += this.totalWorkTime;
                this.newTask.task_start_times += this.completedRounds;
                this.update_task(ObservedObject.GetRawObject(this.newTask), () => {
                    router.pushUrl({
                        url: 'pages/Index',
                        params: {
                            tasks: this.tasks,
                            account: this.account,
                        },
                    });
                });
            });
        }, Button);
        Button.pop();
        Column.pop();
    }
    buildCountdownProgress(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.alignSelf(ItemAlign.Center);
            Column.margin({ top: 20, bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.formatTime(this.remainingTime));
            Text.fontSize(26);
            Text.fontWeight(FontWeight.Bold);
            Text.textAlign(TextAlign.Center);
            Text.margin({ bottom: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Progress.create({
                value: this.isResting
                    ? (this.remainingTime / 5) * 100
                    : (this.remainingTime / (this.task.task_interval * 60)) * 100,
                total: 100,
                type: ProgressType.Ring,
            });
            Progress.color(this.isResting ? Color.Orange : Color.Green);
            Progress.backgroundColor(Color.Gray);
            Progress.width(180);
            Progress.height(180);
            Progress.margin({ bottom: 20 });
        }, Progress);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.isRunning ? '暂停' : '开始倒计时');
            Button.onClick(() => {
                this.isRunning ? this.stopCountdown() : this.startCountdown();
            });
            Button.fontSize(18);
            Button.fontColor(Color.White);
            Button.backgroundColor(this.isRunning ? Color.Red : Color.Green);
            Button.width(150);
            Button.height(45);
            Button.alignSelf(ItemAlign.Center);
        }, Button);
        Button.pop();
        Column.pop();
    }
    private formatTime(timeInSeconds: number): string {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}分${seconds}秒`;
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "CountDown";
    }
}
registerNamedRoute(() => new CountDown(undefined, {}), "", { bundleName: "com.example.todo", moduleName: "entry", pagePath: "pages/CountDown", pageFullPath: "entry/src/main/ets/pages/CountDown", integratedHsp: "false" });
