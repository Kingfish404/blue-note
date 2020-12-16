#### 组件名称
smt-calendar

#### 解释：
日历组件，可配置选中日期、日历数据、星期文案，适用于信息输入，并可放置在页面的任何位置。

#### 属性说明：
|属性名 | 类型 | 必填 | 默认值 |说明 |
|---|---|---|---|---|
|value |Object |是|-|默认选中日期，value 示例：{day: &#39;2020-06-15&#39;, state: 1}，详细代码请阅读代码示例|
|range |Array |是|-|日历数据，range 示例：{name: &#39;2020-06&#39;, value: [{day: &#39;2020-06-01&#39;, state: 1}]}，详细代码请阅读代码示例|
|separation |String |否|&#39;-&#39;|连接年月日的符号|
|repeatable |Boolean |否|false|选中的日期是否可以多次点击|
|disabled |Boolean |否|false|是否禁用该组件|
|allDayValid |Boolean |否|false|所有日期是否可选|
|weekText |Array |否|[&#39;日&#39;, &#39;一&#39;, &#39;二&#39;, &#39;三&#39;, &#39;四&#39;, &#39;五&#39;, &#39;六&#39;]|星期默认文案|
|showOptionPanel |Boolean |否|false|是否展示月份面板|

#### 代码示例
swan:
```
<view class="wrap">
    <view class="content">
            <view class="comp-wrap">
                <smt-calendar
                    class="calendar"
                    range="{{range}}"
                    value="{{value}}"
                    bind:dayclick="dayClick"
                    showOptionPanel="{{false}}"
                >
                </smt-calendar>
            </view>
        </view>
        <view class="card-panel">
            <view class="comp-wrap">
                <smt-calendar
                    class="calendar"
                    range="{{range}}"
                    value="{{allDayValue}}"
                    bind:dayclick="allDayClick"
                >
                </smt-calendar>
            </view>
        </view>
    </view>
</view>
```
js:
```
Page({
    data: {
        range: [
            {
                name: '2020-06',
                value: [
                    {
                        day: '2020-06-01',
                        state: 1
                    },
                    {
                        day: '2020-06-02',
                        state: 1
                    },
                    {
                        day: '2020-06-03',
                        state: 1
                    },
                    {
                        day: '2020-06-04',
                        state: 1
                    },
                    {
                        day: '2020-06-05',
                        state: 1
                    },
                    {
                        day: '2020-06-06',
                        state: 1
                    },
                    {
                        day: '2020-06-07',
                        state: 0
                    },
                    {
                        day: '2020-06-08',
                        state: 0
                    },
                    {
                        day: '2020-06-09',
                        state: 1
                    },
                    {
                        day: '2020-06-10',
                        state: 1
                    },
                    {
                        day: '2020-06-11',
                        state: 1
                    },
                    {
                        day: '2020-06-12',
                        state: 1
                    },
                    {
                        day: '2020-06-13',
                        state: 1
                    },
                    {
                        day: '2020-06-14',
                        state: 0
                    },
                    {
                        day: '2020-06-15',
                        state: 1
                    },
                    {
                        day: '2020-06-16',
                        state: 1
                    },
                    {
                        day: '2020-06-17',
                        state: 1
                    },
                    {
                        day: '2020-06-18',
                        state: 1
                    },
                    {
                        day: '2020-06-19',
                        state: 1
                    },
                    {
                        day: '2020-06-20',
                        state: 1
                    },
                    {
                        day: '2020-06-21',
                        state: 0
                    },
                    {
                        day: '2020-06-22',
                        state: 0
                    },
                    {
                        day: '2020-06-23',
                        state: 1
                    },
                    {
                        day: '2020-06-24',
                        state: 1
                    },
                    {
                        day: '2020-06-25',
                        state: 1
                    },
                    {
                        day: '2020-06-26',
                        state: 1
                    },
                    {
                        day: '2020-06-27',
                        state: 1
                    }
                ]
            },
            {
                name: '2020-07',
                value: [
                    {
                        day: '2020-07-01',
                        state: 0
                    },
                    {
                        day: '2020-07-02',
                        state: 0
                    },
                    {
                        day: '2020-07-03',
                        state: 0
                    },
                    {
                        day: '2020-07-04',
                        state: 0
                    },
                    {
                        day: '2020-07-05',
                        state: 0
                    },
                    {
                        day: '2020-07-06',
                        state: 0
                    },
                    {
                        day: '2020-07-07',
                        state: 0
                    },
                    {
                        day: '2020-07-08',
                        state: 1
                    },
                    {
                        day: '2020-07-09',
                        state: 1
                    },
                    {
                        day: '2020-07-10',
                        state: 1
                    },
                    {
                        day: '2020-07-11',
                        state: 1
                    },
                    {
                        day: '2020-07-12',
                        state: 0
                    },
                    {
                        day: '2020-07-13',
                        state: 0
                    },
                    {
                        day: '2020-07-14',
                        state: 1
                    },
                    {
                        day: '2020-07-15',
                        state: 1
                    },
                    {
                        day: '2020-07-16',
                        state: 1
                    },
                    {
                        day: '2020-07-17',
                        state: 1
                    },
                    {
                        day: '2020-07-18',
                        state: 1
                    },
                    {
                        day: '2020-07-19',
                        state: 0
                    },
                    {
                        day: '2020-07-20',
                        state: 0
                    },
                    {
                        day: '2020-07-21',
                        state: 1
                    },
                    {
                        day: '2020-07-22',
                        state: 1
                    },
                    {
                        day: '2020-07-23',
                        state: 1
                    },
                    {
                        day: '2020-07-24',
                        state: 1
                    },
                    {
                        day: '2020-07-25',
                        state: 1
                    },
                    {
                        day: '2020-07-26',
                        state: 0
                    },
                    {
                        day: '2020-07-27',
                        state: 0
                    },
                    {
                        day: '2020-07-28',
                        state: 1
                    },
                    {
                        day: '2020-07-29',
                        state: 1
                    },
                    {
                        day: '2020-07-30',
                        state: 1
                    },
                    {
                        day: '2020-07-31',
                        state: 1
                    }
                ]
            }
        ],
        value: {day: '2020-06-15', state: 1},
        allDayValue: {day: '2020-07-29', state: 1},
        weekText: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    },

    /**
     * 单月日历点击
     *
     * @param {Object} param 点击事件回调
     * @param {Object} param.value day 状态对象
     */
    dayClick({value}) {
        if (value.state) {
            this.setData({
                value
            });
        }
    },

    /**
     * 全部日历点击
     *
     * @param {Object} param 点击事件回调
     * @param {Object} param.value day 状态对象
     */
    allDayClick({value}) {
        if (value.state) {
            this.setData({
                allDayValue: value
            });
        }
    }
});
```
css:
```
.wrap {
    background-color: #f5f5f5;
    height: 100vh;
}

.content {
    padding-top: 0.2rem;
}

.smt-card-area {
    margin-top: 25.36rpx;
    background-color: #fff;
}

.card-panel {
    margin-top: 72.46rpx;
}

.card-panel:first-child {
    margin-top: 0;
}

.card-area {
    display: flex;
    margin: 90.58rpx 0 0;
    padding: 28.382rpx 30.797rpx;
    border: none;
    border-radius: 0;
    transition: background-color 200ms linear;
    align-items: center;
    justify-content: space-between;
}

.comp-wrap {
    background-color: #fff;
    margin-top: 25.362rpx;
    padding: 27.174rpx 0;
}
```