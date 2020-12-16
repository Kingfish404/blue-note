/**
 * @file calendar.js
 * @author huangzilong (huangzilong@baidu.com)
 */
import {getDay, getMonth} from './util';

Component({ // eslint-disable-line
    properties: {
        /* eslint-disable fecs-properties-quote */

        // 日历数组
        range: {
            type: Array,
            value: [],
            observer(n) {
                // 更新时自动校验日历状态
                n && this.checkForbidVal();
            }
        },

        // 日历选中值
        value: {
            type: Object,
            value: {},
            observer(n) {
                const normVal = JSON.stringify(n);
                const normCurrVal = JSON.stringify(this.data.currentValue);
                if (normVal !== normCurrVal) {
                    if (n && !/\d{4}-\d{2}-\d{2}/.test(n.day)) {
                        return console.error('value回填错误，格式须为: yyyy-mm-dd');
                    }

                    this.setData({
                        monthIdx: this.getMonthIdx(n),
                        currentValue: n
                    });
                    swan.nextTick(() => this.checkForbidVal());
                }
            }
        },

        // 日期链接符
        separation: {
            type: String,
            value: '-'
        },

        // 日期是否可被选中
        disabled: {
            type: Boolean,
            value: false
        },

        // 日期文案
        weekText: {
            type: Array,
            value: ['日', '一', '二', '三', '四', '五', '六']
        },

        // 是否展示月份更改面板
        showOptionPanel: {
            type: Boolean,
            value: true
        }
        /* eslint-enable fecs-properties-quore */
    },
    data: {
        currentValue: '',
        // yyyy-mm-dd
        today: getDay(),
        monthIdx: 0,
        fmtedMonths: []
    },
    created() {
        // 初始化联动相关
        let value = this.data.value;

        this.setData({
            monthIdx: value ? this.getMonthIdx(value) : 0,
            currentValue: value ? value : ''
        });
        swan.nextTick(() => this.fmtedMonth());
    },
    methods: {
        /**
         * 格式化月份
         */
        fmtedMonth() {
            const {range, separation} = this.data;

            const result = range.map(({name, value}) => {
                const [y, m] = name.split(separation);
                // 渲染后端返回的总天数
                const days = Array.from({length: value.length}, (_, i) => i + 1);
                const n = new Date(y, m - 1, 1).getDay();
                days.unshift(...new Array(n).fill(null));
                const r = [];
                let day = 1;

                days.forEach(e => {
                    const item = e && {
                        value: [
                            y, m, day > 9 && day || '0' + day
                        ].join(separation), day
                    };
                    item && day++;
                    r.push(item);
                });

                return {name, title: `${y}年${+m}月`, value: r, offset: n};
            });

            this.setData({
                fmtedMonths: result
            });
        },

        /**
         * 月份变更
         *
         * @param {Event} e Event
         */
        monthClk(e) {
            let next = e.currentTarget.dataset.next;
            let {range, monthIdx} = this.data;

            next && monthIdx < range.length - 1 && monthIdx++;
            !next && monthIdx > 0 && monthIdx--;

            this.setData({
                monthIdx
            });
        },

        /**
         * 获取月份索引
         *
         * @param {object} value 月份对象
         */
        getMonthIdx(value = this.data.value) {
            const {range, separation} = this.data;
            const ym = (value && value.day || getMonth()).split(separation).slice(0, 2).join('-');
            return range.map(e => e.name).indexOf(ym);
        },

        /**
         * 日期点击
         *
         * @param {Event} e Event
         */
        dayClk(e) {
            let value = e.currentTarget.dataset.value;
            let disabled = this.data.disabled;

            this.triggerEvent('dayclick', {value, disabled});
            if (!disabled && value.state) {
                if (this.data.value !== value) {
                    return this.triggerEvent('change', value);
                }
            }
        },

        /**
         * 校验日历状态
         */
        checkForbidVal() {
            let {range, value} = this.data;

            const monthIdx = this.getMonthIdx();
            const dates = range[monthIdx] && range[monthIdx].value;
            if (Array.isArray(dates) && dates.length) {
                const dayIdx = dates.map(({day}) => day).indexOf(value.day);
                if (dayIdx > -1) {
                    const state = dates[dayIdx].state;
                    if (!state) {
                        this.triggerEvent('change', '');
                    }
                }
            }
        }
    }
});
