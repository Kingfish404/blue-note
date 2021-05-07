/**
 * @file index.js
 * @author jinyu
 */
//

import * as utils from '../../util/util'

const app = getApp()

Page({
    data: {
        userInfo: null,
        isLogin: false,
        isEmpty: true,

        noteDateList: [],
        noteDescribeList: [],
        noteRankList: [],
        currentDate: '日期',
        currentNoteValue: null,
        currentRank: 3,

        states: {
            "haveLoc": false
        },

        // 有趣的信息
        oneWord: "每天都要多喝水",
        wheather: "点我获取天气",

        canIUse: swan.canIUse('button.open-type.getUserInfo'),
        nowState: -1, // -1为均无,0为Note，1为历史，2为我的
        lastState: -1, // 上一个状态
        rangeP: [],
        value: {},
        allDayValue: {},
        allDayValid: true,
        weekText: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    },
    onLoad() {
        // 监听页面加载的生命周期函数
        //初始化数据管理

        // 设置日历
        var timestamp = Date.parse(new Date());
        var date = new Date(timestamp);
        //获取年份  
        var Y = date.getFullYear();
        //获取月份  
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        //获取当日日期 
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        var t_currentDay = String(Y + '-' + M + '-' + D);

        // console.log(t_currentDay);

        let rangeP = [];
        for (let i = 2021; i <= Y; ++i) {
            for (let j = 1;
                (i < Y && j <= 12) || (j <= M); ++j) {
                let month_name = String(i) + '-' + (j < 10 ? '0' + String(j) : String(j));
                let month_value = new Array(30).fill(0).map((_, index) => {
                    return {
                        day: month_name + '-' + (index + 1),
                        state: 1
                    }
                });
                if (j & 1) {
                    month_value.push({
                        day: 31,
                        state: 1
                    });
                } else {
                    if (j == 2) {
                        month_value.pop();
                        if ((i % 4 == 0 && i % 100 != 0) || i % 400 == 0) {} else {
                            month_value.pop();
                        }
                    }
                    // console.log(month_value);
                }
                rangeP.push({
                    name: month_name,
                    value: month_value
                })
            }
        }

        this.setData({
            allDayValue: {
                day: t_currentDay,
                state: 1
            },
            rangeP
        });
        this.switchTab(this.nowState = this.data.nowState);
    },
    onReady: function () {
        // 监听页面初次渲染完成的生命周期函数
        if (this.removeSkeleton && this.removeSkeleton()) {
            console.log("onReady - 移除skeleton success");
        }

        // 读取Note列表数据
        swan.getStorage({
            key: 'noteDateList',
            success: res => {
                if (res.data != '') {
                    this.setData({
                        noteDateList: res.data,
                        isEmpty: false
                    })
                } else {
                    this.setData({
                        noteDateList: [],
                        isEmpty: true
                    })
                }
            },
        });
        // 读取Note简介数据
        swan.getStorage({
            key: 'noteDescribeList',
            success: res => {
                if (res.data != '') {
                    this.setData({
                        noteDescribeList: res.data
                    })
                } else {
                    this.setData({
                        noteDescribeList: []
                    })
                }
            },
        });
        // 读取Note等级数据
        swan.getStorage({
            key: 'noteRankList',
            success: res => {
                if (res.data != '') {
                    this.updateDate();
                    this.setData({
                        noteRankList: res.data,
                    });
                } else {
                    this.setData({
                        noteRankList: []
                    })
                }
            },
        });
        // 读取用户数据
        swan.getStorage({
            key: 'userInfo',
            success: res => {
                if (res.data) {
                    this.setData({
                        userInfo: res.data,
                        isLogin: true

                    })
                } else {
                    this.setData({
                        isLogin: false
                    })
                }
            },
            fail: () => {
                console.log("read userInfo fail")
            }
        });
        // 读取states数据
        swan.getStorage({
            key: 'states',
            success: res => {
                console.log('get states:', this.data.states.haveLoc);
                if (res.data.haveLoc) {
                    this.data.states.haveLoc = res.data.haveLoc;
                    this.setData({
                        wheather: ""
                    })
                    this.getWheather();
                }
            },
        });
    },
    onShow: function () {
        // 监听页面显示的生命周期函数

        swan.request({
            url: 'https://v1.hitokoto.cn?c=d&c=i&c=k&encode=utf-8',
            success: (res) => {
                this.setData({
                    oneWord: res.data.hitokoto
                })
            },
            fail: (res) => {
                console.log(res)
            }
        });
    },
    onHide: function () {
        // 监听页面隐藏的生命周期函数
    },
    onUnload: function () {
        // 监听页面卸载的生命周期函数
        this.submit();
    },
    onPullDownRefresh: function () {
        // 监听用户下拉动作
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
    },
    onShareAppMessage: function () {
        // 用户点击右上角转发
    },
    onTap: function onTap() {
        this.switchTab(this.nowState);
    },

    // 以下为自定义功能函数
    startNote: function loadNotice() {
        this.nowState = -1;
    },
    startNotice: function loadNotice() {
        this.nowState = 1;
    },
    startMe: function loadMe() {
        this.nowState = 2;
    },
    //  更新日历
    async updateDate() {
        // 标记所有已经保存了的Note，修改range中的state为0
        for (var i = 0; i < this.data.rangeP.length; i++) {

            for (var key in this.data.rangeP[i].value) {
                if (this.data.noteDateList.indexOf(this.data.rangeP[i].value[key].day) != -1) {
                    this.data.rangeP[i].value[key].state = 0;
                } else {
                    this.data.rangeP[i].value[key].state = 1;
                }
            }
        }
        this.setData({
            rangeP: this.data.rangeP
        })
    },
    // 获取天气
    getWheather() {
        swan.getLocation({
            type: 'gcj02',
            altitude: true,
            success: res => {
                var urlMsg = 'location=' + res.longitude + ',' + res.latitude;
                urlMsg = urlMsg + '&key=5ea3b6508c4148fab55ddb4c32e1832f'
                urlMsg = 'https://devapi.qweather.com/v7/weather/now?' + urlMsg;
                if (this.data.states.haveLoc == false) {
                    this.data.states['haveLoc'] = true;
                    swan.setStorage({
                        key: 'states',
                        data: this.data.states
                    });
                }
                swan.request({
                    url: urlMsg,
                    success: (res) => {
                        // console.log(res.data.now)
                        var wheatherNow = res.data.now;
                        this.setData({
                            wheather: String(wheatherNow.text + '   ' + wheatherNow.temp + '℃')
                        })
                    },
                    fail: (res) => {
                        console.log('fail!', res);
                        swan.showToast("获取天气失败");
                    }
                });
            },
            fail: err => {
                swan.showToast({
                    title: '无位置权限，请手动开启'
                });
                this.data.states['haveLoc'] = false;
                swan.setStorage({
                    key: 'states',
                    data: this.data.states
                });
            }
        });
    },

    // 自动保存日记
    autoSave(e) {
        this.setData({
            currentNoteValue: e.detail['value']
        });
    },
    // 删除笔记
    delNote() {
        this.data.currentNoteValue = "";
        this.submit();
        this.updateDate();
    },

    // 提交最终日记
    submit: function submit() {
        // 保存当前文章
        if (this.data.currentNoteValue != "") {
            // 如果内容不为空，则保存
            var noteStr = this.data.currentNoteValue;
            var firstLine;
            if (noteStr.indexOf('\n') != -1) {
                firstLine = noteStr.substring(0, noteStr.indexOf('\n'));
            } else {
                firstLine = noteStr;
            }

            swan.setStorage({
                key: this.data.currentDate + '-Note',
                data: this.data.currentNoteValue
            });
            if (this.data.noteDateList.indexOf(this.data.currentDate) == -1) {
                // 未找到已有的日期
                this.data.noteDescribeList.push(firstLine);
                this.data.noteDateList.push(this.data.currentDate);
                this.data.noteRankList.push(this.data.currentRank);
                this.updateDate();
            } else {
                // 找到了已有的记录
                this.data.noteDescribeList[this.data.noteDateList.indexOf(this.data.currentDate)] = firstLine;
                this.data.noteRankList[this.data.noteDateList.indexOf(this.data.currentDate)] = this.data.currentRank;
            }
        } else if (this.data.noteDateList.indexOf(this.data.currentDate) != -1) {
            // 如果内容为空，则清楚储存并更新记录
            swan.removeStorage({
                key: this.data.currentDate + '-Note',
                success: res => {
                    console.log(this.data.currentDate + '-Note', ' remove success');
                }
            });
            this.data.noteDateList.splice(this.data.noteDateList.indexOf(this.data.currentDate), 1);
            this.data.noteRankList.splice(this.data.noteDateList.indexOf(this.data.currentDate), 1);
            if (this.data.noteDateList.length == 0) {
                this.data.isEmpty = true;
            }
        }
        if (this.data.noteDateList.length == 0) {
            this.data.isEmpty = true;
        } else {
            this.data.isEmpty = false;
        }
        this.setData({
            noteDateList: this.data.noteDateList,
            noteDescribeList: this.data.noteDescribeList,
            noteRankList: this.data.noteRankList,
            currentNoteValue: '',
            currentRank: 3,
            isEmpty: this.data.isEmpty
        })

        // 保存日期列表
        swan.setStorage({
            key: 'noteDateList',
            data: this.data.noteDateList
        });
        // 保存简介列表
        swan.setStorage({
            key: 'noteDescribeList',
            data: this.data.noteDescribeList
        });
        // 保存Rank列表
        swan.setStorage({
            key: 'noteRankList',
            data: this.data.noteRankList
        });

        // 返回
        if (this.data.lastState == 1) {
            this.switchTab(1);
        } else {
            this.switchTab();
        }
    },
    switchTab: function switchTab(tabNum) {
        //  默认为日历，0为Note，1为历史，2为我的
        if (tabNum == null) {
            tabNum = -1;
        }
        switch (tabNum) {
            case 0:
                this.setData({
                    noteDisplay: "block",
                    msgDisplay: "none",
                    meDisplay: "none",
                    dateDisplay: "none"
                })
                break;
            case 1:
                this.setData({
                    msgDisplay: "block",
                    noteDisplay: "none",
                    meDisplay: "none",
                    dateDisplay: "none"
                })
                break;
            case 2:
                this.setData({
                    meDisplay: "block",
                    noteDisplay: "none",
                    msgDisplay: "none",
                    dateDisplay: "none"
                })
                break;
            default:
                this.setData({
                    dateDisplay: "block",
                    noteDisplay: "none",
                    msgDisplay: "none",
                    meDisplay: "none",
                })
                break;
        }
    },
    // 加载日记
    loadNote(date) {
        if (date != null) {
            this.setData({
                currentDate: date
            });
            swan.getStorage({
                key: this.data.currentDate + '-Note',
                success: res => {
                    console.log(date);
                    this.setData({
                        currentNoteValue: res.data
                    })
                }
            });
        } else {

        }
    },

    // 用户登陆用
    getUserInfo(e) {
        if (e.detail.userInfo) {
            this.setData({
                isLogin: true,
                userInfo: e.detail.userInfo
            })
        } else {
            this.setData({
                isLogin: false,
                userInfo: e.detail.userInfo
            })
        }
        swan.setStorage({
            key: 'userInfo',
            data: this.data.userInfo
        });
    },

    // 历史记录中点击
    getNote(e) {
        this.data.lastState = 1;
        var data = JSON.parse(e.currentTarget.dataset.date);
        this.nowState = 0;
        this.setData({
            currentRank: this.data.noteRankList[this.data.noteDateList.indexOf(data['day'])]
        });
        this.loadNote(data['day']);
        this.switchTab(this.nowState);
    },
    aboutUs() {
        swan.showModal({
            title: '关于我们',
            content: 'Team from WUT\r\n开发：Kingfish404\r\n产品：小施小施不吃鱼籽\r\n特别鸣谢：shandianchengzi\r\n所有数据均保存在本地\r\nVersion:1.0.0\r\ncopyright@2020\r\n反馈群：631586660',
            showCancel: false,
            confirmText: '知道啦'
        });
    },

    todayClick(e) {
        var value = e.currentTarget.dataset;
        console.log(value);
        this.allDayClick(value);
    },

    // 组件事件
    /**
     * 全部日历点击
     *
     * @param {Object} param 点击事件回调
     * @param {Object} param.value day 状态对象
     */
    allDayClick({
        value
    }) {
        console.log(value);
        if (value.state) {
            this.setData({
                allDayValue: value
            });
        }
        this.data.lastState = this.data.nowState;

        this.data.nowState = 0;

        console.log('AllDayClick:', value['day']);

        if (this.data.noteDateList.indexOf(value['day']) != -1) {
            // 列表内已经存在当日日记
            this.loadNote(value['day']);
            this.setData({
                currentRank: this.data.noteRankList[this.data.noteDateList.indexOf(value['day'])]
            })
        } else {
            // 更新日记列表
            this.setData({
                currentDate: value['day'],
                currentNoteValue: ''
            });
        }

        this.switchTab(this.data.nowState);
    },
    /**
     * 选择星星事件
     *
     * @param {Object} detail 事件详情
     */
    rankChange({
        detail
    }) {
        // console.log(detail, '选中星星值');
        this.data.currentRank = detail.new;
    }
})