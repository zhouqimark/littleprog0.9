## Dialog 弹出框

### 使用指南
在 index.json 中引入组件
```json
{
  "usingComponents": {
    "zan-dialog": "path/to/zanui-weapp/dist/dialog/index"
  }
}
```

在需要使用的页面里引入组件库模板和脚本
```html
<zan-dialog id="zan-dialog-test"></zan-dialog>
```
```js
const Dialog = require('path/to/zanui-weapp/dist/dialog/dialog');

Page({
  // ...
  // 可以在任意方法里直接调用，即可唤起
  handleClick() {
    Dialog({
      title: '',
      message: '',
      selector: '#zan-dialog-test'
    }).then((res) => {
      console.log(res);
    })
  }
});
```

### 代码演示

#### 按钮展示方式
按钮可以通过设置 buttonsShowVertical 来切换按钮纵向展示或者横向并排展示，方便各种场景下使用。
```js
Dialog({
  message: '这是一个模态弹窗',
  buttonsShowVertical: true,
  showCancelButton: true
});
```

#### 自定义展示按钮
`dialog` 支持自定义展示按钮。设置 buttons 数组即可实现。自定义按钮的点击后，都会在 resolve 状态中监听到。
```js
Dialog({
  message: '这是一个模态弹窗',
  buttons: [{
    // 按钮文案
    text: '现金支付',
    // 按钮文字颜色
    color: 'red',
    // 按钮类型，用于在 then 中接受点击事件时，判断是哪一个按钮被点击
    type: 'cash'
  }, {
    text: '微信支付',
    color: '#3CC51F',
    type: 'wechat'
  }, {
    text: '取消',
    type: 'cancel'
  }]
}).then(({ type }) => {
  // type 可以用于判断具体是哪一个按钮被点击
  console.log('=== dialog with custom buttons ===', `type: ${type}`);
});
```

### 具体参数
| 参数       | 说明      | 类型       | 默认值       | 必须      |
|-----------|-----------|-----------|-------------|-------------|
| message | 弹窗内容 | String  | - | 必须 |
| selector | 显示弹窗对应组件节点的选择器 | String  | - | 必须 |
| title | 弹窗标题 | String | - | |
| buttonsShowVertical | 按钮是否纵向展示 | Boolean  | false | |
| showConfirmButton | 是否展示确认按钮 | Boolean  | true | |
| confirmButtonText | 确认按钮文案 | String  | 确定 | |
| confirmButtonColor | 确认按钮文字颜色 | String | #3CC51F | |
| showCancelButton | 是否展示取消按钮 | Boolean  | false | |
| cancelButtonText | 取消按钮文案 | String  | 取消 | |
| cancelButtonColor | 取消按钮文字颜色 | String  | #333 | |
| buttons | 自定义按钮列表，设置以后，以上关于 确认 和 取消 按钮的设置全部不生效。| Array | - | |

buttons 数据格式
```js
[{
  // 按钮文案
  text: '现金支付',
  // 按钮文字颜色
  color: 'red',
  // 按钮类型，用于在 then 中接受点击事件时，判断是哪一个按钮被点击
  type: 'cash'
}, {
  // 按钮文案
  text: '微信支付',
  // 按钮文字颜色
  color: '#3CC51F',
  // 按钮类型，用于在 then 中接受点击事件时，判断是哪一个按钮被点击
  type: 'wechat'
}, {
  // 按钮文案
  text: '取消',
  // 按钮类型，用于在 then 中接受点击事件时，判断是哪一个按钮被点击
  type: 'cancel'
}]
```

