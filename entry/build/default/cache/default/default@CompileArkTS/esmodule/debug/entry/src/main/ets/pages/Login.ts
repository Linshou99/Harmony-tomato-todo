if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Login_Params {
    users?: Array<UserData>;
    searchText?: string;
    isEdit?: boolean;
    isInsert?: boolean;
    newUser?: UserData;
    index?: number;
    UserTable?;
    inputAccount?;
    inputPassword?;
}
import UserTable from "@normalized:N&&&entry/src/main/ets/common/database/tables/UserTable&";
import type UserData from '../viewmodel/UserData';
import CommonConstants from "@normalized:N&&&entry/src/main/ets/common/constants/CommonConstants&";
import Logger from "@normalized:N&&&entry/src/main/ets/common/utils/Logger&";
import router from "@ohos:router";
class Login extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__users = new ObservedPropertyObjectPU([], this, "users");
        this.__searchText = new ObservedPropertySimplePU('', this, "searchText");
        this.__isEdit = new ObservedPropertySimplePU(false, this, "isEdit");
        this.__isInsert = new ObservedPropertySimplePU(false, this, "isInsert");
        this.__newUser = new ObservedPropertyObjectPU({ id: 0, account: '', password: '' }, this, "newUser");
        this.__index = new ObservedPropertySimplePU(-1, this, "index");
        this.UserTable = new UserTable(() => { });
        this.inputAccount = '';
        this.inputPassword = '';
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Login_Params) {
        if (params.users !== undefined) {
            this.users = params.users;
        }
        if (params.searchText !== undefined) {
            this.searchText = params.searchText;
        }
        if (params.isEdit !== undefined) {
            this.isEdit = params.isEdit;
        }
        if (params.isInsert !== undefined) {
            this.isInsert = params.isInsert;
        }
        if (params.newUser !== undefined) {
            this.newUser = params.newUser;
        }
        if (params.index !== undefined) {
            this.index = params.index;
        }
        if (params.UserTable !== undefined) {
            this.UserTable = params.UserTable;
        }
        if (params.inputAccount !== undefined) {
            this.inputAccount = params.inputAccount;
        }
        if (params.inputPassword !== undefined) {
            this.inputPassword = params.inputPassword;
        }
    }
    updateStateVars(params: Login_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__users.purgeDependencyOnElmtId(rmElmtId);
        this.__searchText.purgeDependencyOnElmtId(rmElmtId);
        this.__isEdit.purgeDependencyOnElmtId(rmElmtId);
        this.__isInsert.purgeDependencyOnElmtId(rmElmtId);
        this.__newUser.purgeDependencyOnElmtId(rmElmtId);
        this.__index.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__users.aboutToBeDeleted();
        this.__searchText.aboutToBeDeleted();
        this.__isEdit.aboutToBeDeleted();
        this.__isInsert.aboutToBeDeleted();
        this.__newUser.aboutToBeDeleted();
        this.__index.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __users: ObservedPropertyObjectPU<Array<UserData>>;
    get users() {
        return this.__users.get();
    }
    set users(newValue: Array<UserData>) {
        this.__users.set(newValue);
    }
    private __searchText: ObservedPropertySimplePU<string>;
    get searchText() {
        return this.__searchText.get();
    }
    set searchText(newValue: string) {
        this.__searchText.set(newValue);
    }
    private __isEdit: ObservedPropertySimplePU<boolean>;
    get isEdit() {
        return this.__isEdit.get();
    }
    set isEdit(newValue: boolean) {
        this.__isEdit.set(newValue);
    }
    private __isInsert: ObservedPropertySimplePU<boolean>;
    get isInsert() {
        return this.__isInsert.get();
    }
    set isInsert(newValue: boolean) {
        this.__isInsert.set(newValue);
    }
    private __newUser: ObservedPropertyObjectPU<UserData>;
    get newUser() {
        return this.__newUser.get();
    }
    set newUser(newValue: UserData) {
        this.__newUser.set(newValue);
    }
    private __index: ObservedPropertySimplePU<number>;
    get index() {
        return this.__index.get();
    }
    set index(newValue: number) {
        this.__index.set(newValue);
    }
    private UserTable;
    private inputAccount;
    private inputPassword;
    accept(isInsert: boolean, newUser: UserData): void {
        if (isInsert) {
            Logger.info(`${CommonConstants.INDEX_TAG}`, `The user inserted is:  ${JSON.stringify(newUser)}`);
            this.UserTable.insertData(newUser, (id: number) => {
                newUser.id = id;
                this.users.push(newUser);
            });
        }
        else {
            this.UserTable.updateData(newUser, () => { });
            let list = this.users;
            this.users = [];
            list[this.index] = newUser;
            this.users = list;
            this.index = -1;
        }
    }
    aboutToAppear() {
        this.UserTable.getRdbStore(() => {
            // this.UserTable.query(0, (result: UserData[]) => {
            //   this.users = result;
            // }, true);
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 15 });
            Column.height("100%");
            Column.width('100%');
            Column.backgroundColor("#2db7f5");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.height(50);
            Row.width('90%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create("Welcome, this application is built by ArkTs.");
            Text.fontSize(14);
            Text.textAlign(TextAlign.Center);
            Text.width("100%");
            Text.fontColor("white");
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create('assets/images/login.png');
            Image.height(400);
            Image.width("80%");
        }, Image);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('90%');
            Row.height(50);
            Row.backgroundColor("white");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({
                placeholder: "please enter your account"
            });
            TextInput.type(InputType.Normal);
            TextInput.onChange((value: string) => {
                this.inputAccount = value;
            });
        }, TextInput);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('90%');
            Row.height(50);
            Row.backgroundColor("white");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({
                placeholder: "please enter your password"
            });
            TextInput.type(InputType.Password);
            TextInput.onChange((value: string) => {
                this.inputPassword = value;
            });
        }, TextInput);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel("登录");
            Button.width('90%');
            Button.height(50);
            Button.onClick(() => {
                if (this.inputAccount !== '' && this.inputPassword !== '') {
                    this.UserTable.query(this.inputAccount, (result: UserData[]) => {
                        if (result.length == 1 && result[0].password === this.inputPassword) {
                            Logger.info(`${CommonConstants.INDEX_TAG}`, 'Login successful!');
                            router.pushUrl({
                                url: 'pages/Index',
                                params: {
                                    account: this.inputAccount,
                                }
                            });
                        }
                        else {
                            Logger.info(`${CommonConstants.INDEX_TAG}`, 'Invalid credentials.');
                        }
                    }, false);
                }
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel("注册");
            Button.width('90%');
            Button.height(50);
            Button.onClick(() => {
                if (this.inputAccount !== '' && this.inputPassword !== '') {
                    const newUser: UserData = {
                        id: -1,
                        account: this.inputAccount,
                        password: this.inputPassword
                    };
                    this.UserTable.insertData(newUser, (id: number) => {
                        if (id >= 0) {
                            console.log(`User registered successfully with ID: ${id}`);
                        }
                        else {
                            console.log('User registration failed.');
                        }
                    });
                }
                else {
                    console.log('Account and password cannot be empty.');
                }
            });
        }, Button);
        Button.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Login";
    }
}
registerNamedRoute(() => new Login(undefined, {}), "", { bundleName: "com.example.todo", moduleName: "entry", pagePath: "pages/Login", pageFullPath: "entry/src/main/ets/pages/Login", integratedHsp: "false" });
