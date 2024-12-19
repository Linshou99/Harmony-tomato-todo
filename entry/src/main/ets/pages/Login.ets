// import UserTable from '../common/database/tables/UserTable';
// import UserData from '../viewmodel/UserData';
import UserTable from '../common/database/tables/UserTable';
import UserData from '../viewmodel/UserData';
import CommonConstants from '../common/constants/CommonConstants';
import Logger from '../common/utils/Logger';
import router from '@ohos.router';

@Entry
@Component
struct Login {
  @State users: Array<UserData> = [];
  @State searchText: string = '';
  @State isEdit: boolean = false;
  @State isInsert: boolean = false;
  @State newUser: UserData = { id: 0, account: '', password: '' };
  @State index: number = -1;

  private UserTable = new UserTable(() => {});
  private inputAccount = '';
  private inputPassword = '';


  accept(isInsert: boolean, newUser: UserData): void {
    if (isInsert) {
      Logger.info(`${CommonConstants.INDEX_TAG}`, `The user inserted is:  ${JSON.stringify(newUser)}`);
      this.UserTable.insertData(newUser, (id: number) => {
        newUser.id = id;
        this.users.push(newUser);
      });
    } else {
      this.UserTable.updateData(newUser, () => {});
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

  build() {
    Column({ space: 15 }) {
      Row() {
        Text("Welcome, this application is built by ArkTs.")
          .fontSize(14)
          .textAlign(TextAlign.Center)
          .width("100%")
          .fontColor("white");
      }
      .height(50)
      .width('90%');

      Row() {
        Image('assets/images/login.png')
          .height(400)
          .width("80%");
      }
      .justifyContent(FlexAlign.Center);

      Row() {
        TextInput({
          placeholder: "please enter your account"
        })
          .type(InputType.Normal)
          .onChange((value: string) => {
            this.inputAccount = value;
          });
      }
      .width('90%')
      .height(50)
      .backgroundColor("white");

      Row() {
        TextInput({
          placeholder: "please enter your password"
        })
          .type(InputType.Password)
          .onChange((value: string) => {
            this.inputPassword = value;
          });
      }
      .width('90%')
      .height(50)
      .backgroundColor("white");

      Button("登录").width('90%')
        .height(50)
        .onClick(() => {
          if (this.inputAccount !== '' && this.inputPassword !== '') {
            this.UserTable.query(this.inputAccount, (result: UserData[]) => {
              if (result.length ==1 && result[0].password === this.inputPassword) {
                Logger.info(`${CommonConstants.INDEX_TAG}`, 'Login successful!');
                router.pushUrl({
                  url:'pages/Index',
                  params:{
                    account:this.inputAccount,
                  }
                })
              } else {
                Logger.info(`${CommonConstants.INDEX_TAG}`, 'Invalid credentials.');
              }
            }, false);
          }
        });

      Button("注册").width('90%')
        .height(50)
        .onClick(() => {
          if (this.inputAccount !== '' && this.inputPassword !== '') {
            const newUser: UserData = {
              id: -1,
              account: this.inputAccount,
              password: this.inputPassword
            };
            this.UserTable.insertData(newUser, (id: number) => {
              if (id >= 0) {
                console.log(`User registered successfully with ID: ${id}`);
              } else {
                console.log('User registration failed.');
              }
            });
          } else {
            console.log('Account and password cannot be empty.');
          }
        });
    }
    .height("100%")
    .width('100%')
    .backgroundColor("#2db7f5");
  }
}
