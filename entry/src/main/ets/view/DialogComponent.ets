/*
 * Copyright (c) 2023 Huawei Device Co., Ltd.
 * Licensed under the Apache License,Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import TaskData from '../viewmodel/TaskData';

@CustomDialog
export struct DialogComponent {
  private new_task_name: string = ''
  private new_task_interval: number = 25

  @Link isInsert: boolean;
  @Link newTask: TaskData;
  @State select: number | number[]  = 3
  private fruits: string[] | Resource = ['1min','5min', '10min', '25min', '30min', '45min','60min']
  controller?: CustomDialogController;
  confirm?: (isInsert: boolean, newTask: TaskData) => void;



  build() {
    Column() {
      TextInput({ placeholder: '输入任务名称', text: this.newTask.task_name })
        .height(60)
        .width('90%')
        .onChange((value: string) => {
          this.new_task_name = value
        })
      TextPicker({ range: this.fruits, selected: this.select,value: this.newTask.task_interval+"min" })
        .onChange((value: string | string[], index: number | number[]) => {
          console.info('Picker item changed, value: ' + value + ', index: ' + index)
          this.select = index;
          this.new_task_interval = Number(value.toString().replace("min", "").trim())

        })
      Divider().color("#D8D8D8").height(0.5)
      RowSplit() {
        Button("取消").fontSize(17).fontColor("#181818")
          .fontWeight(FontWeight.Bold).onClick(() => {
          if (this.controller != undefined) {
            this.controller.close()
          }
        }
        ).backgroundColor(0xffffff).fontColor(Color.Black)

        Button("确定").fontSize(17).fontColor('#DC143C')
          .fontWeight(FontWeight.Bold).onClick(() => {
          console.info('click 确定')
          if (this.new_task_name!='' && this.controller != undefined) {
            this.newTask.task_name = this.new_task_name
            this.newTask.task_interval = this.new_task_interval
            console.info('this.isInsert:'+this.isInsert+'this.newTask:'+JSON.stringify(this.newTask))
            this.confirm && this.confirm(this.isInsert,this.newTask)
            this.controller?.close();
          }
        }).backgroundColor(0xffffff).fontColor(Color.Red)
      }.margin({ bottom: 10 })
    }
  }
}