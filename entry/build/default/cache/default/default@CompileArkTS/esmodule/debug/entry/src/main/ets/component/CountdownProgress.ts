if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CountdownProgress_Params {
    totalTime?: number;
    remainingTime?: number;
    isRunning?: boolean;
    intervalId?: number | null;
}
export class CountdownProgress extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__totalTime = new SynchedPropertySimpleOneWayPU(params.totalTime, this, "totalTime");
        this.__remainingTime = new ObservedPropertySimplePU(0, this, "remainingTime");
        this.__isRunning = new ObservedPropertySimplePU(false, this, "isRunning");
        this.intervalId = null;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CountdownProgress_Params) {
        if (params.remainingTime !== undefined) {
            this.remainingTime = params.remainingTime;
        }
        if (params.isRunning !== undefined) {
            this.isRunning = params.isRunning;
        }
        if (params.intervalId !== undefined) {
            this.intervalId = params.intervalId;
        }
    }
    updateStateVars(params: CountdownProgress_Params) {
        this.__totalTime.reset(params.totalTime);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__totalTime.purgeDependencyOnElmtId(rmElmtId);
        this.__remainingTime.purgeDependencyOnElmtId(rmElmtId);
        this.__isRunning.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__totalTime.aboutToBeDeleted();
        this.__remainingTime.aboutToBeDeleted();
        this.__isRunning.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __totalTime: SynchedPropertySimpleOneWayPU<number>; // 接收父组件传递的总时间（单位：分钟）
    get totalTime() {
        return this.__totalTime.get();
    }
    set totalTime(newValue: number) {
        this.__totalTime.set(newValue);
    }
    private __remainingTime: ObservedPropertySimplePU<number>; // 倒计时剩余时间（单位：秒）
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
    private intervalId: number | null; // 定时器ID
    aboutToAppear() {
        // 在组件挂载时初始化剩余时间（转换为秒）
        this.remainingTime = this.totalTime * 60;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 5 });
            Column.padding(20);
            Column.width('100%');
            Column.height('100%');
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 将剩余时间转换成分钟和秒进行显示
            Text.create(`${this.formatTime(this.remainingTime)}`);
            // 将剩余时间转换成分钟和秒进行显示
            Text.fontSize(24);
            // 将剩余时间转换成分钟和秒进行显示
            Text.fontWeight(FontWeight.Bold);
            // 将剩余时间转换成分钟和秒进行显示
            Text.textAlign(TextAlign.Center);
            // 将剩余时间转换成分钟和秒进行显示
            Text.margin({ top: 20 });
        }, Text);
        // 将剩余时间转换成分钟和秒进行显示
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 环形进度条
            Progress.create({
                value: (this.remainingTime / (this.totalTime * 60)) * 100,
                total: 100,
                type: ProgressType.Ring,
            });
            // 环形进度条
            Progress.color(Color.Green);
            // 环形进度条
            Progress.backgroundColor(Color.Gray);
            // 环形进度条
            Progress.width(200);
            // 环形进度条
            Progress.height(200);
            // 环形进度条
            Progress.margin({ top: 20 });
        }, Progress);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 开始或停止按钮
            Button.createWithLabel(this.isRunning ? '停止倒计时' : '开始倒计时');
            // 开始或停止按钮
            Button.onClick(() => {
                if (this.isRunning) {
                    this.stopCountdown();
                }
                else {
                    this.startCountdown();
                }
            });
            // 开始或停止按钮
            Button.fontSize(20);
            // 开始或停止按钮
            Button.backgroundColor(this.isRunning ? Color.Red : Color.Green);
            // 开始或停止按钮
            Button.fontColor(Color.White);
            // 开始或停止按钮
            Button.width('60%');
            // 开始或停止按钮
            Button.alignSelf(ItemAlign.Center);
        }, Button);
        // 开始或停止按钮
        Button.pop();
        Column.pop();
    }
    private startCountdown() {
        this.isRunning = true;
        this.intervalId = setInterval(() => {
            if (this.remainingTime > 0) {
                this.remainingTime--;
            }
            else {
                this.stopCountdown();
                this.showTimeUp();
            }
        }, 1000); // 每秒更新一次
    }
    private stopCountdown() {
        this.isRunning = false;
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    private showTimeUp() {
        console.log("时间到！");
    }
    // 工具函数：将秒数格式化为“分钟:秒”
    private formatTime(timeInSeconds: number): string {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}分${seconds}秒`;
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "CountdownProgress";
    }
}
registerNamedRoute(() => new CountdownProgress(undefined, {}), "", { bundleName: "com.example.todo", moduleName: "entry", pagePath: "component/CountdownProgress", pageFullPath: "entry/src/main/ets/component/CountdownProgress", integratedHsp: "false" });
