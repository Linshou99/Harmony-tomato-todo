if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Second_Params {
    message?: string;
}
import router from "@ohos:router";
import type { BusinessError } from "@ohos:base";
class Second extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__message = new ObservedPropertySimplePU('Hi there', this, "message");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Second_Params) {
        if (params.message !== undefined) {
            this.message = params.message;
        }
    }
    updateStateVars(params: Second_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__message.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__message.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __message: ObservedPropertySimplePU<string>;
    get message() {
        return this.__message.get();
    }
    set message(newValue: string) {
        this.__message.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.height('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.message);
            Text.fontSize(50);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.type(ButtonType.Capsule);
            Button.margin({
                top: 20
            });
            Button.backgroundColor('#0D9FFB');
            Button.width('40%');
            Button.height('5%');
            Button.onClick(() => {
                console.info(`Succeeded in clicking the 'Back' button.`);
                try {
                    // 返回第一页
                    router.back();
                    console.info('Succeeded in returning to the first page.');
                }
                catch (err) {
                    let code = (err as BusinessError).code;
                    let message = (err as BusinessError).message;
                    console.error(`Failed to return to the first page. Code is ${code}, message is ${message}`);
                }
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Back');
            Text.fontSize(30);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Button.pop();
        Column.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Second";
    }
}
registerNamedRoute(() => new Second(undefined, {}), "", { bundleName: "com.example.todo", moduleName: "entry", pagePath: "pages/Second", pageFullPath: "entry/src/main/ets/pages/Second", integratedHsp: "false" });
