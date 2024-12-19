if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface DialogComponent_Params {
    new_task_name?: string;
    new_task_interval?: number;
    isInsert?: boolean;
    newTask?: TaskData;
    select?: number | number[];
    fruits?: string[] | Resource;
    controller?: CustomDialogController;
    confirm?: (isInsert: boolean, newTask: TaskData) => void;
}
import type TaskData from '../viewmodel/TaskData';
export class DialogComponent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.new_task_name = '';
        this.new_task_interval = 25;
        this.__isInsert = new SynchedPropertySimpleTwoWayPU(params.isInsert, this, "isInsert");
        this.__newTask = new SynchedPropertyObjectTwoWayPU(params.newTask, this, "newTask");
        this.__select = new ObservedPropertyObjectPU(3, this, "select");
        this.fruits = ['1min', '5min', '10min', '25min', '30min', '45min', '60min'];
        this.controller = undefined;
        this.confirm = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: DialogComponent_Params) {
        if (params.new_task_name !== undefined) {
            this.new_task_name = params.new_task_name;
        }
        if (params.new_task_interval !== undefined) {
            this.new_task_interval = params.new_task_interval;
        }
        if (params.select !== undefined) {
            this.select = params.select;
        }
        if (params.fruits !== undefined) {
            this.fruits = params.fruits;
        }
        if (params.controller !== undefined) {
            this.controller = params.controller;
        }
        if (params.confirm !== undefined) {
            this.confirm = params.confirm;
        }
    }
    updateStateVars(params: DialogComponent_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isInsert.purgeDependencyOnElmtId(rmElmtId);
        this.__newTask.purgeDependencyOnElmtId(rmElmtId);
        this.__select.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isInsert.aboutToBeDeleted();
        this.__newTask.aboutToBeDeleted();
        this.__select.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private new_task_name: string;
    private new_task_interval: number;
    private __isInsert: SynchedPropertySimpleTwoWayPU<boolean>;
    get isInsert() {
        return this.__isInsert.get();
    }
    set isInsert(newValue: boolean) {
        this.__isInsert.set(newValue);
    }
    private __newTask: SynchedPropertySimpleOneWayPU<TaskData>;
    get newTask() {
        return this.__newTask.get();
    }
    set newTask(newValue: TaskData) {
        this.__newTask.set(newValue);
    }
    private __select: ObservedPropertyObjectPU<number | number[]>;
    get select() {
        return this.__select.get();
    }
    set select(newValue: number | number[]) {
        this.__select.set(newValue);
    }
    private fruits: string[] | Resource;
    private controller?: CustomDialogController;
    setController(ctr: CustomDialogController) {
        this.controller = ctr;
    }
    private confirm?: (isInsert: boolean, newTask: TaskData) => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '输入任务名称', text: this.newTask.task_name });
            TextInput.height(60);
            TextInput.width('90%');
            TextInput.onChange((value: string) => {
                this.new_task_name = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextPicker.create({ range: this.fruits, selected: this.select, value: this.newTask.task_interval + "min" });
            TextPicker.onChange((value: string | string[], index: number | number[]) => {
                console.info('Picker item changed, value: ' + value + ', index: ' + index);
                this.select = index;
                this.new_task_interval = Number(value.toString().replace("min", "").trim());
            });
        }, TextPicker);
        TextPicker.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color("#D8D8D8");
            Divider.height(0.5);
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            RowSplit.create();
            RowSplit.margin({ bottom: 10 });
        }, RowSplit);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel("取消");
            Button.fontSize(17);
            Button.fontColor("#181818");
            Button.fontWeight(FontWeight.Bold);
            Button.onClick(() => {
                if (this.controller != undefined) {
                    this.controller.close();
                }
            });
            Button.backgroundColor(0xffffff);
            Button.fontColor(Color.Black);
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel("确定");
            Button.fontSize(17);
            Button.fontColor('#DC143C');
            Button.fontWeight(FontWeight.Bold);
            Button.onClick(() => {
                console.info('click 确定');
                if (this.new_task_name != '' && this.controller != undefined) {
                    this.newTask.task_name = this.new_task_name;
                    this.newTask.task_interval = this.new_task_interval;
                    console.info('this.isInsert:' + this.isInsert + 'this.newTask:' + JSON.stringify(ObservedObject.GetRawObject(this.newTask)));
                    this.confirm && this.confirm(this.isInsert, ObservedObject.GetRawObject(this.newTask));
                    this.controller?.close();
                }
            });
            Button.backgroundColor(0xffffff);
            Button.fontColor(Color.Red);
        }, Button);
        Button.pop();
        RowSplit.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
