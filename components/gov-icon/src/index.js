/**
 * @file 政务icon组件
 * @author zhangwen22(zhangwen22@baidu.com)
 */

/* global Component */
Component({
    extrnalClasses: ['gov-icon'], // eslint-disable-line

    properties: {
        // icon名称
        name: {
            type: String,
            value: ''
        },
        // icon大小
        size: {
            type: String,
            value: '36.232rpx'
        },
        // icon颜色
        color: {
            type: [Array, String],
            value: '',
            observer(n) {
                let fixedColor = n;
                const trans = hexColor => {
                    if (hexColor && hexColor.charAt(0) === '#') {
                        return '%23' + hexColor.slice(1);
                    }
                    return hexColor;
                };
                if (typeof n === 'string') {
                    fixedColor = trans(n);
                }
                else {
                    fixedColor = [];
                    for (const i of n) {
                        fixedColor.push(trans(i));
                    }
                }
                this.setData({
                    singleColor: typeof n === 'string',
                    fixedColor
                });
            }
        },
        // background-image中url包裹符号，默认为双引号
        quot: {
            type: String,
            value: '"'
        }
    },

    data: {
        // icon颜色默认为单色
        singleColor: true,
        // 初始化class
        inited: false,
        // 16进制颜色
        fixedColor: ''
    },

    attached() {
        // 防止抖动
        this.setData({inited: true});
    }
});
