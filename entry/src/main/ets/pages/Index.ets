import router from '@ohos.router';
import CommonConstants from '../common/constants/CommonConstants';
import TaskTable from '../common/database/tables/TaskTable';
import Logger from '../common/utils/Logger';
import TaskData from '../viewmodel/TaskData';
import { DialogComponent } from '../view/DialogComponent';

@Styles function card() {
    .width('95%')
  .height(50) // 自动高度适配内容
  .padding(16)    // 增大内边距
  .backgroundColor('#FFF5EE') // 更柔和的颜色
  .borderRadius(12)         // 更自然的圆角
  .shadow({
    radius: 8,
    color: '#D3D3D3',
    offsetX: 0,
    offsetY: 2
  } ) // 更细腻的阴影
}

interface PageParams {
  tasks?: Array<TaskData>; // 可选参数，可能未传递
  account?: string;        // 可选参数，可能未传递
}

@Entry
@Component
struct Index {
  // @State account: string = (router.getParams() as Record<string,string>) ['account'];
  private params = router.getParams() as PageParams;
  @State tasks: Array<TaskData> = this.params.tasks ?? []; // 如果没有传递任务，使用空数组
  account = this.params.account ?? ''; // 如果没有传递账户，使用空字符串
  // @State account: string = ''
  @State index: number = 0
  @State totalTask: number = 0
  @State finishTask: number = 0
  // @State tasks: Array<TaskData> = [];
  private TaskTable = new TaskTable(() => {});
  @State textValue: string = ''
  @State new_task_name: string = ''
  @State new_task_profile: string = ''
  @State new_task_interval: number = 25
  @State new_task_time: number = -1
  @State task_id: number = 0
  @State task_name: string = ''
  @State task_profile: string = ''
  @State task_interval: number = 25
  @State task_start_times: number = -1
  @State task_running_seconds: number = 0
  @State newTask:TaskData = { id: -1, account:this.account, task_name: '', task_interval: 25, task_start_times: 0,
    task_running_seconds:0}
  @State range:string[] = ['1min','5min', '10min', '25min', '30min', '45min','60min']
  @State isInsert: boolean = false;
  //
  aboutToAppear(): void {
    console.log('this.account:'+this.account)
    this.TaskTable.getRdbStore(() => {
      this.TaskTable.query(this.account, (result: TaskData[]) => {this.tasks=result}, false);
    });

  }


  private formatTime_hms(timeInSeconds: number): string {
    const hours = Math.floor(timeInSeconds / 3600); // 计算小时数
    const minutes = Math.floor((timeInSeconds % 3600) / 60); // 计算剩余的分钟数
    const seconds = timeInSeconds % 60; // 计算剩余的秒数
    return `${hours}时${minutes}分${seconds}秒`;
  }



  accept(isInsert: boolean, newTask: TaskData): void {
    console.info('accept this.isInsert:'+isInsert+'this.newTask:'+JSON.stringify(newTask))
    if (isInsert) {
      Logger.info(`${CommonConstants.INDEX_TAG}`, `The account inserted is:  ${JSON.stringify(newTask)}`);
      this.TaskTable.insertData(newTask, (id: number) => {
        if (id >= 0) {
          console.log(`Task added successfully with ID: ${id}`);
          newTask.id = id;
          this.tasks.push(newTask);}
        else {
          console.log('Task addition failed.');
        }
      });
    } else {
      Logger.info(`${CommonConstants.INDEX_TAG}`, `The account updated is:  ${JSON.stringify(newTask)}`);
      this.TaskTable.updateData(newTask, () => {
        const index = this.tasks.findIndex(task => task.id === newTask.id);
        if (index !== -1) {
          // 删除原来的任务
          this.tasks.splice(index, 1);

          // 在同一位置插入新任务
          this.tasks.splice(index, 0, newTask);
          console.log(`Task updated successfully at index: ${index}`);
        } else {
          console.log('Task update failed: Task not found in the list.');
        }
      });

    }
    this.isInsert = false
    this.newTask = { id: -1, account:this.account, task_name: '', task_interval: 25, task_start_times: 0,
      task_running_seconds:0}
  }


  dialogController: CustomDialogController = new CustomDialogController({
    builder: DialogComponent({
      isInsert: $isInsert,
      newTask: $newTask,
      confirm: (isInsert: boolean, newTask: TaskData) => this.accept(isInsert, newTask)
    }),
    cancel: this.exitApp,
    autoCancel: true,
    alignment: DialogAlignment.Center,
    offset: { dx: 0, dy: -20 },
    gridCount: 4,
    customStyle: false,
    cornerRadius: 10,
  })

  exitApp() {
    console.info('Click the callback in the blank area')
  }

  build() {
    Column({ space: 10 }) {
      Row()
        { // 整体布局的高度
        Column({ space: 5 }) { // Column 放在右侧，用于纵向排列两个 Text
          Text('用户：'+this.account)
            .fontSize(15)
            .fontWeight(FontWeight.Bold)
            .textAlign(TextAlign.Start); // 左对齐

          Text('拥有'+this.tasks.length + "个事项")
            .fontSize(15)
            .fontWeight(FontWeight.Bold)
            .textAlign(TextAlign.Start); // 左对齐
        }
        .margin({ left: 10 }); // 设置按钮和文本之间的间距
        Button('+') // 按钮放在左侧
          .width(40)
          .height(40)
          .onClick(() => {
            // 添加任务总数据和数量
            this.isInsert = true;
            if (this.dialogController != null) {
              this.dialogController.open();
            }
          })
          .backgroundColor(0x317aff)
          .fontColor(0xffffff)
          .fontSize(15);
      }.justifyContent(FlexAlign.Start) // 设置水平对齐方式
      .alignItems(VerticalAlign.Center) // 设置垂直对齐方式
      .width('100%')
      .height(60)


      List({ space: 10 }) {
        ForEach(this.tasks, (item: TaskData, index) => {
            ListItem() {
              RelativeContainer() {
                Text(item.task_name).fontSize(20).id('name')
                  .alignRules({
                  top: {anchor: "__container__", align: VerticalAlign.Center},
                  left: {anchor: "__container__", align: HorizontalAlign.Start}
                })
                Text(`${item.task_interval.toString()}min | 累计已完整专注${item.task_start_times}次，累计专注${this.formatTime_hms(item.task_running_seconds)}`).fontSize(10)
                    .alignRules({
                  top: { anchor: 'name', align: VerticalAlign.Bottom },
                  left: { anchor: 'name', align: HorizontalAlign.Start }
                })
                Button('开始', { type: ButtonType.Normal, stateEffect: true })
                  .borderRadius(8)
                  .backgroundColor(0x317aff)
                  .width(50)
                  .onClick(() => {
                    router.pushUrl({
                      url:'pages/CountDown',
                      params:{
                        task:item,
                        tasks:this.tasks,
                        account:this.account
                      }
                    })
                  }).alignRules({
                    right: { anchor: "__container__", align: HorizontalAlign.End }
                  })
              }.card()
              // .justifyContent(FlexAlign.SpaceBetween)
            }
            .onClick(() => {
              //添加任务总数据和数量
              this.isInsert = false
              this.newTask = item
              if (this.dialogController != null) {
                this.dialogController.open()
              }
            })
            .swipeAction({ end: this.DeleteButton(index,item) })
          }
        )
      }
      .width('100%')
      .alignListItem(ListItemAlign.Center)
      //分配剩下高度
      .layoutWeight(1)

      // 添加返回登录页面的按钮
      Button('返回登录')
        .width('100%')
        .height(50)
        .backgroundColor(0xff4444)
        .fontColor(0xffffff)
        .fontSize(18)
        .onClick(() => {
          router.pushUrl({
            url: 'pages/Login'
          });
        });
    }
  }


  @Builder DeleteButton(index: number,item:TaskData) {
    Button() {
      Image($r('app.media.app_icon'))
        .fillColor(Color.White)
        .width(20)
    }
    .width(40)
    .height(40)
    .type(ButtonType.Capsule)
    .backgroundColor(Color.Red)
    .onClick(() => {
      AlertDialog.show({
        message: "是否删除此事项？",
        // title: "是否删除此文件？",
        // message: "移动到最近删除后最长保留30天，之后将永久删除。",
        alignment: DialogAlignment.Bottom,
        primaryButton: {
          value: '取消',
          fontColor: Color.Blue,
          action: () => {
            console.info('点击了取消')
          }
        },
        secondaryButton: {
          value: '删除',
          fontColor: Color.Red,
          action: () => {
            console.info('点击了删除')
            this.TaskTable.deleteData(item, (id: number) => {
              if (id >= 0) {
                this.tasks.splice(index, 1)
                console.log(`Task deleted successfully with ID: ${id}`);}
              else {
                console.log('Task deletion failed.');
              }
            });
          }
        },
      })
    })
  }
}