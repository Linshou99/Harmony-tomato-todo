import { router } from '@kit.ArkUI';
import TaskData from '../viewmodel/TaskData';
import TaskTable from '../common/database/tables/TaskTable';
import CommonConstants from '../common/constants/CommonConstants';
import Logger from '../common/utils/Logger';


@Entry
@Component
struct CountDown {
  @State remainingTime: number = 0; // 当前倒计时剩余时间（单位：秒）
  @State isRunning: boolean = false; // 是否正在倒计时
  @State isResting: boolean = false; // 是否处于休息阶段
  private intervalId: number | null = null; // 定时器ID

  @State task: TaskData = (router.getParams() as Record<string, TaskData>)['task'];
  @State account: string = (router.getParams() as Record<string, string>)['account'];
  @State newTask: TaskData = {
    id: -1,
    account: this.account,
    task_name: '',
    task_interval: 25,
    task_start_times: 0,
    task_running_seconds: 0,
  };
  @State tasks: Array<TaskData> = [];
  private TaskTable = new TaskTable(() => {});

  @State totalWorkTime: number = 0; // 累计工作时间（秒）
  @State completedRounds: number = 0; // 完整的工作倒计时轮数

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
              if (callback) callback(); // 更新完成后执行回调
            }
          } else {
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
      } else {
        this.stopCountdown();
        if (this.isResting) {
          this.promptWorkDecision(); // 提示是否进入工作
        } else {
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

  build() {
    Column() {
      Text(`已专注 ${this.task.task_name} ${this.completedRounds} 次`)
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .textAlign(TextAlign.Center)
        .margin({ top: 20, bottom: 10 })
        .fontColor(Color.Black);

      this.buildCountdownProgress();

      Button('返回')
        .fontSize(20)
        .fontWeight(FontWeight.Medium)
        .backgroundColor(Color.Blue)
        .fontColor(Color.White)
        .width(200)
        .height(50)
        .margin({ top: 30 })
        .alignSelf(ItemAlign.Center)
        .onClick(() => {
          this.calculateTotalWorkTime();
          router.showAlertBeforeBackPage({ message: '是否确认返回？' });
          this.newTask.task_running_seconds += this.totalWorkTime;
          this.newTask.task_start_times += this.completedRounds;

          this.update_task(this.newTask, () => {
            router.pushUrl({
              url: 'pages/Index',
              params: {
                tasks: this.tasks,
                account: this.account,
              },
            });
          });
        });
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F1F3F5')
    .alignItems(HorizontalAlign.Center)
    .justifyContent(FlexAlign.Center);
  }

  @Builder buildCountdownProgress() {
    Column({ space: 10 }) {
      Text(this.formatTime(this.remainingTime))
        .fontSize(26)
        .fontWeight(FontWeight.Bold)
        .textAlign(TextAlign.Center)
        .margin({ bottom: 20 });

      Progress({
        value: this.isResting
          ? (this.remainingTime / 5) * 100
          : (this.remainingTime / (this.task.task_interval * 60)) * 100,
        total: 100,
        type: ProgressType.Ring,
      })
        .color(this.isResting ? Color.Orange : Color.Green)
        .backgroundColor(Color.Gray)
        .width(180)
        .height(180)
        .margin({ bottom: 20 });

      Button(this.isRunning ? '暂停' : '开始倒计时')
        .onClick(() => {
          this.isRunning ? this.stopCountdown() : this.startCountdown();
        })
        .fontSize(18)
        .fontColor(Color.White)
        .backgroundColor(this.isRunning ? Color.Red : Color.Green)
        .width(150)
        .height(45)
        .alignSelf(ItemAlign.Center);
    }
    .alignSelf(ItemAlign.Center)
    .margin({ top: 20, bottom: 20 });
  }

  private formatTime(timeInSeconds: number): string {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}分${seconds}秒`;
  }
}


// import { router } from '@kit.ArkUI';
// import TaskData from '../viewmodel/TaskData';
// import TaskTable from '../common/database/tables/TaskTable';
// import CommonConstants from '../common/constants/CommonConstants';
// import Logger from '../common/utils/Logger';
//
// @Entry
// @Component
// struct CountDown {
//   @State remainingTime: number = 0; // 当前倒计时剩余时间（单位：秒）
//   @State isRunning: boolean = false; // 是否正在倒计时
//   @State isResting: boolean = false; // 是否处于休息阶段
//   private intervalId: number | null = null; // 定时器ID
//
//   @State task: TaskData = (router.getParams() as Record<string, TaskData>)['task'];
//   @State account: string = (router.getParams() as Record<string, string>)['account'];
//   @State newTask: TaskData = {
//     id: -1,
//     account: this.account,
//     task_name: '',
//     task_interval: 25,
//     task_start_times: 0,
//     task_running_seconds: 0,
//   };
//   @State tasks: Array<TaskData> = [];
//   private TaskTable = new TaskTable(() => {});
//
//   @State totalWorkTime: number = 0; // 累计工作时间（秒）
//   @State completedRounds: number = 0; // 完整的工作倒计时轮数
//
//   aboutToAppear(): void {
//     this.newTask = this.task;
//     this.remainingTime = this.task.task_interval * 60; // 初始化倒计时时间
//     this.TaskTable.getRdbStore(() => {
//       this.TaskTable.query(this.account, (result: TaskData[]) => {
//         this.tasks = result;
//       }, false);
//     });
//   }
//
//   private promptRestDecision() {
//     AlertDialog.show({
//       message: '工作倒计时已结束，是否进入休息阶段？',
//       alignment: DialogAlignment.Center,
//       primaryButton: {
//         value: '进入休息',
//         fontColor: Color.Blue,
//         action: () => {
//           console.info('用户选择进入休息');
//           this.startRestCountdown(); // 开启休息倒计时
//         },
//       },
//       secondaryButton: {
//         value: '跳过',
//         fontColor: Color.Red,
//         action: () => {
//           console.info('用户选择跳过休息');
//           this.isRunning = false; // 进入暂停状态
//           this.isResting = true;
//         },
//       },
//     });
//   }
//
//   update_task(newTask: TaskData, callback?: () => void): void {
//     Logger.info(`${CommonConstants.INDEX_TAG}`, `The account updated is:  ${JSON.stringify(newTask)}`);
//     this.TaskTable.updateData(newTask, (id: number) => {
//       const index = this.tasks.findIndex((task) => task.id === newTask.id);
//       if (id >= 0) {
//         console.log(`Task updated successfully`);
//         if (index !== -1) {
//           this.tasks.splice(index, 1);
//           this.tasks.splice(index, 0, newTask);
//           console.log(`Task updated successfully at index: ${index}`);
//           if (callback) callback(); // 更新完成后执行回调
//         }
//       } else {
//         console.log('Task update failed.');
//       }
//     });
//   }
//
//   build() {
//     Column() {
//       Text(`已专注 ${this.task.task_name} ${this.completedRounds} 次`)
//         .fontSize(24)
//         .fontWeight(FontWeight.Bold)
//         .textAlign(TextAlign.Center)
//         .margin({ top: 20, bottom: 10 })
//         .fontColor(Color.Black);
//
//       this.buildCountdownProgress();
//
//       Button('返回')
//         .fontSize(20)
//         .fontWeight(FontWeight.Medium)
//         .backgroundColor(Color.Blue)
//         .fontColor(Color.White)
//         .width(200)
//         .height(50)
//         .margin({ top: 30 })
//         .alignSelf(ItemAlign.Center)
//         .onClick(() => {
//           this.calculateTotalWorkTime();
//           router.showAlertBeforeBackPage({ message: '是否确认返回？' });
//           this.newTask.task_running_seconds += this.totalWorkTime;
//           this.newTask.task_start_times += this.completedRounds;
//
//           this.update_task(this.newTask, () => {
//             router.pushUrl({
//               url: 'pages/Index',
//               params: {
//                 tasks: this.tasks,
//                 account: this.account,
//               },
//             });
//           });
//         });
//     }
//     .width('100%')
//     .height('100%')
//     .backgroundColor('#F1F3F5')
//     .alignItems(HorizontalAlign.Center)
//     .justifyContent(FlexAlign.Center);
//   }
//
//   @Builder buildCountdownProgress() {
//     Column({ space: 10 }) {
//       Text(this.formatTime(this.remainingTime))
//         .fontSize(26)
//         .fontWeight(FontWeight.Bold)
//         .textAlign(TextAlign.Center)
//         .margin({ bottom: 20 });
//
//       Progress({
//         value: this.isResting
//           ? (this.remainingTime / 300) * 100
//           : (this.remainingTime / (this.task.task_interval * 60)) * 100,
//         total: 100,
//         type: ProgressType.Ring,
//       })
//         .color(this.isResting ? Color.Orange : Color.Green)
//         .backgroundColor(Color.Gray)
//         .width(180)
//         .height(180)
//         .margin({ bottom: 20 });
//
//       Button(this.isRunning ? '暂停' : '开始倒计时')
//         .onClick(() => {
//           this.isRunning ? this.stopCountdown() : this.startCountdown();
//         })
//         .fontSize(18)
//         .fontColor(Color.White)
//         .backgroundColor(this.isRunning ? Color.Red : Color.Green)
//         .width(150)
//         .height(45)
//         .alignSelf(ItemAlign.Center);
//     }
//     .alignSelf(ItemAlign.Center)
//     .margin({ top: 20, bottom: 20 });
//   }
//
//   private startCountdown() {
//     this.isRunning = true;
//     this.intervalId = setInterval(() => {
//       if (this.remainingTime > 0) {
//         this.remainingTime--;
//       } else {
//         this.stopCountdown();
//         if (this.isResting) {
//           this.startWorkCountdown();
//         } else {
//           this.completedRounds++; // 完成工作倒计时
//           this.promptRestDecision(); // 提示是否进入休息
//         }
//       }
//     }, 1000);
//   }
//
//   private stopCountdown() {
//     this.isRunning = false;
//     if (this.intervalId !== null) {
//       clearInterval(this.intervalId);
//       this.intervalId = null;
//     }
//   }
//
//   private startRestCountdown() {
//     this.isResting = true;
//     this.remainingTime = 300; // 5分钟休息
//     this.startCountdown();
//   }
//
//   private startWorkCountdown() {
//     this.stopCountdown();
//     this.isResting = false;
//     this.remainingTime = this.task.task_interval * 60;
//     this.startCountdown();
//   }
//
//   private calculateTotalWorkTime() {
//     const currentWorkTime = this.isResting
//       ? 0
//       : this.task.task_interval * 60 - this.remainingTime; // 当前未完成轮的工作时间
//     this.totalWorkTime = this.completedRounds * this.task.task_interval * 60 + currentWorkTime;
//   }
//
//   private formatTime(timeInSeconds: number): string {
//     const minutes = Math.floor(timeInSeconds / 60);
//     const seconds = timeInSeconds % 60;
//     return `${minutes}分${seconds}秒`;
//   }
// }
//
// // import { router } from '@kit.ArkUI';
// // import TaskData from '../viewmodel/TaskData';
// // import TaskTable from '../common/database/tables/TaskTable';
// // import CommonConstants from '../common/constants/CommonConstants';
// // import Logger from '../common/utils/Logger';
// //
// // @Entry
// // @Component
// // struct CountDown {
// //   @State remainingTime: number = 0; // 当前倒计时剩余时间（单位：秒）
// //   @State isRunning: boolean = false; // 是否正在倒计时
// //   @State isResting: boolean = false; // 是否处于休息阶段
// //   private intervalId: number | null = null; // 定时器ID
// //
// //   @State task: TaskData = (router.getParams() as Record<string, TaskData>)['task'];
// //   @State account: string = (router.getParams() as Record<string, string>)['account'];
// //   @State newTask:TaskData = { id: -1, account:this.account, task_name: '', task_interval: 25, task_start_times: 0,
// //     task_running_seconds:0}
// //   @State tasks: Array<TaskData> = [];
// //   private TaskTable = new TaskTable(() => {});
// //
// //   @State totalWorkTime: number = 0; // 累计工作时间（秒）
// //   @State completedRounds: number = 0; // 完整的工作倒计时轮数
// //
// //   aboutToAppear(): void {
// //     this.newTask = this.task
// //     this.remainingTime = this.task.task_interval * 60; // 初始化倒计时时间
// //     this.TaskTable.getRdbStore(() => {
// //       this.TaskTable.query(this.account, (result: TaskData[]) => {
// //         this.tasks = result;
// //       }, false);
// //     });
// //   }
// //
// //   update_task(newTask: TaskData, callback?: () => void): void {
// //     Logger.info(`${CommonConstants.INDEX_TAG}`, `The account updated is:  ${JSON.stringify(newTask)}`);
// //     this.TaskTable.updateData(newTask, (id: number) => {
// //       const index = this.tasks.findIndex(task => task.id === newTask.id);
// //       if (id >= 0) {
// //         console.log(`Task updated successfully`);
// //         if (index !== -1) {
// //           // 删除原来的任务
// //           this.tasks.splice(index, 1);
// //
// //           // 在同一位置插入新任务
// //           this.tasks.splice(index, 0, newTask);
// //           console.log(`Task updated successfully at index: ${index}`);
// //           if (callback) callback(); // 更新完成后执行回调
// //           }
// //       else {
// //           console.log('Task update failed: Task not found in the list.');
// //         }
// //       } else {
// //         console.log('Task update failed.');
// //       }
// //     });
// //   }
// //
// //
// //   build() {
// //     Column() {
// //       // 显示已专注次数
// //       Text(`已专注 ${this.task.task_name} ${this.completedRounds} 次`)
// //         .fontSize(24)
// //         .fontWeight(FontWeight.Bold)
// //         .textAlign(TextAlign.Center)
// //         .margin({ top: 20, bottom: 10 })
// //         .fontColor(Color.Black);
// //
// //       this.buildCountdownProgress();
// //
// //       Button('返回')
// //         .fontSize(20)
// //         .fontWeight(FontWeight.Medium)
// //         .backgroundColor(Color.Blue)
// //         .fontColor(Color.White)
// //         .width(200)
// //         .height(50)
// //         .margin({ top: 30 })
// //         .alignSelf(ItemAlign.Center)
// //         .onClick(() => {
// //           this.calculateTotalWorkTime();
// //           router.showAlertBeforeBackPage({ message: '是否确认返回？' });
// //           this.newTask.task_running_seconds += this.totalWorkTime;
// //           this.newTask.task_start_times += this.completedRounds;
// //
// //           this.update_task(this.newTask, () => {
// //             // 确保更新完成后再返回
// //             router.pushUrl({
// //               url:'pages/Index',
// //               params:{
// //                 tasks:this.tasks,
// //                 account:this.account
// //               }
// //             })
// //             // router.back({tasks:this.tasks});
// //           });
// //         });
// //     }
// //     .width('100%')
// //     .height('100%')
// //     .backgroundColor('#F1F3F5')
// //     .alignItems(HorizontalAlign.Center)
// //     .justifyContent(FlexAlign.Center);
// //   }
// //
// //   @Builder buildCountdownProgress() {
// //     Column({ space: 10 }) {
// //       Text(this.formatTime(this.remainingTime))
// //         .fontSize(26)
// //         .fontWeight(FontWeight.Bold)
// //         .textAlign(TextAlign.Center)
// //         .margin({ bottom: 20 });
// //
// //       Progress({
// //         value: this.isResting
// //           ? (this.remainingTime / 300) * 100
// //           : (this.remainingTime / (this.task.task_interval * 60)) * 100,
// //         total: 100,
// //         type: ProgressType.Ring,
// //       })
// //         .color(this.isResting ? Color.Orange : Color.Green)
// //         .backgroundColor(Color.Gray)
// //         .width(180)
// //         .height(180)
// //         .margin({ bottom: 20 });
// //
// //       Button(this.isRunning ? '暂停' : '开始倒计时')
// //         .onClick(() => {
// //           this.isRunning ? this.stopCountdown() : this.startCountdown();
// //         })
// //         .fontSize(18)
// //         .fontColor(Color.White)
// //         .backgroundColor(this.isRunning ? Color.Red : Color.Green)
// //         .width(150)
// //         .height(45)
// //         .alignSelf(ItemAlign.Center);
// //
// //       if (this.isResting) {
// //         Button('提前结束休息')
// //           .onClick(() => this.startWorkCountdown())
// //           .fontSize(18)
// //           .fontColor(Color.White)
// //           .backgroundColor(Color.Blue)
// //           .width(150)
// //           .height(45)
// //           .alignSelf(ItemAlign.Center);
// //       }
// //     }.alignSelf(ItemAlign.Center)
// //     .margin({ top: 20, bottom: 20 });
// //   }
// //
// //   private startCountdown() {
// //     this.isRunning = true;
// //     this.intervalId = setInterval(() => {
// //       if (this.remainingTime > 0) {
// //         this.remainingTime--;
// //       } else {
// //         this.stopCountdown();
// //         if (this.isResting) {
// //           this.startWorkCountdown();
// //         } else {
// //           this.completedRounds++; // 完成工作倒计时时立刻更新
// //           this.startRestCountdown();
// //         }
// //       }
// //     }, 1000);
// //   }
// //
// //   private stopCountdown() {
// //     this.isRunning = false;
// //     if (this.intervalId !== null) {
// //       clearInterval(this.intervalId);
// //       this.intervalId = null;
// //     }
// //   }
// //
// //   private startRestCountdown() {
// //     this.isResting = true;
// //     this.remainingTime = 300; // 5分钟休息
// //     this.startCountdown();
// //   }
// //
// //   private startWorkCountdown() {
// //     this.stopCountdown();
// //     this.isResting = false;
// //     this.remainingTime = this.task.task_interval * 60;
// //     this.startCountdown();
// //   }
// //
// //   private calculateTotalWorkTime() {
// //     const currentWorkTime = this.isResting
// //       ? 0
// //       : (this.task.task_interval * 60 - this.remainingTime); // 当前未完成轮的工作时间
// //     this.totalWorkTime = this.completedRounds * this.task.task_interval * 60 + currentWorkTime;
// //   }
// //
// //   private formatTime(timeInSeconds: number): string {
// //     const minutes = Math.floor(timeInSeconds / 60);
// //     const seconds = timeInSeconds % 60;
// //     return `${minutes}分${seconds}秒`;
// //   }
// // }
