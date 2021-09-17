/**
 * @file debounce.js
 * @author huangjing (huangjing02@baidu.com)
 * @desc 工具集
 */

import {
    upx2dpx
} from './px';

/**
 * 对比版本号大小
 *
 * @param {string} v1 版本号1
 * @param {string} v2 版本号2
 * @returns {number} 0 代表相等， 1代表v1版本号大于v2， -1 代表v1版本号小于v2
 */
export const compareVersion = (v1, v2) => {
    v1 = v1.split('.');
    v2 = v2.split('.');
    const len = Math.max(v1.length, v2.length);

    while (v1.length < len) {
        v1.push('0');
    }
    while (v2.length < len) {
        v2.push('0');
    }

    for (let i = 0; i < len; i++) {
        let num1 = parseInt(v1[i], 10);
        let num2 = parseInt(v2[i], 10);

        if (num1 > num2) {
            return 1;
        } else if (num1 < num2) {
            return -1;
        }
    }
    return 0;
};


/**
 * 选择组件 * 避免s-if出问题
 *
 * @param {Object} context this
 * @param {string} selector 选择操作符
 */
export const selComponent = (context, selector) =>
    new Promise((r, j) => {
        if (!context || !selector) {
            return j('context和selector必传！');
        }
        swan.createSelectorQuery().in(context)
            .select(selector).fields({
                id: true
            }, res => {
                try {
                    if (!res) {
                        return j('未找到节点');
                    }
                    const component = context.selectComponent(res.id);
                    component ? r(component) : j('选择自定义组件错误');
                } catch (err) {
                    j(err);
                }
            }).exec();
    });

/**
 * debounce 支持取消的防抖
 * @param {Function} func 执行的函数
 * @param {number=} wait 等待时间
 * @param {Object=} options 附加参数：初始执行、最大时间
 */
export function debounce(func, wait = 0, options = {}) {
    let lastArgs;
    let lastThis;
    let maxWait;
    let result;
    let timerId;
    let lastCallTime;
    let lastInvokeTime = 0;
    let leading = false;
    let maxing = false;
    let trailing = true;

    if (typeof func !== 'function') {
        throw new TypeError('第一个参数必须是函数');
    }

    leading = !!options.leading;
    maxing = options.hasOwnProperty('maxWait');
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait;
    trailing = options.hasOwnProperty('trailing') ? !!options.trailing : trailing;

    function invokeFunc(time) {
        let args = lastArgs;
        let thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
    }

    function leadingEdge(time) {
        lastInvokeTime = time;
        timerId = setTimeout(timerExpired, wait);
        return leading ? invokeFunc(time) : result;
    }

    function remainingWait(time) {
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;
        const result = wait - timeSinceLastCall;

        return maxing ? Math.min(result, maxWait - timeSinceLastInvoke) : result;
    }

    function shouldInvoke(time) {
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;
        return (
            lastCallTime === undefined ||
            timeSinceLastCall >= wait ||
            timeSinceLastCall < 0 ||
            maxing && timeSinceLastInvoke >= maxWait
        );
    }

    function timerExpired() {
        const time = Date.now();
        if (shouldInvoke(time)) {
            return trailingEdge(time);
        }
        timerId = setTimeout(timerExpired, remainingWait(time));
    }

    function trailingEdge(time) {
        timerId = undefined;

        if (trailing && lastArgs) {
            return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
    }

    function cancel() {
        if (timerId !== undefined) {
            clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
    }

    function flush() {
        return timerId === undefined ? result : trailingEdge(Date.now());
    }

    function debounced(...args) {
        const time = Date.now();
        const isInvoking = shouldInvoke(time);

        lastArgs = args;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
            if (timerId === undefined) {
                return leadingEdge(lastCallTime);
            }
            if (maxing) {
                timerId = setTimeout(timerExpired, wait);
                return invokeFunc(lastCallTime);
            }
        }
        if (timerId === undefined) {
            timerId = setTimeout(timerExpired, wait);
        }
        return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
}

/**
 * 简易版 promiseDebounce
 * @param {Function} fn 执行函数
 * @param {number} delay 间隔
 */
export const promiseDebounce = (fn, delay) => {
    let timer;
    const debounce = function (...args) {
        clearTimeout(timer);
        return new Promise(resolve => {
            timer = setTimeout(
                () => Promise.resolve(fn(...args)).then(result => resolve(result)), delay);
        });
    };

    debounce.cancel = () => clearTimeout(timer);

    return debounce;
};

/**
 * 线性累加
 *
 * @param {Function} exector 执行函数 * 该函数参数包含 当前高度、终止高度、回调
 * @param {number=} start 初始大小
 * @param {number=} ms 时间
 * @param {number=} fps 帧率
 */
export const linearAccu = (exector, start = 0, end = 192, ms = 350, fps = 30) =>
    new Promise(r => {
        if (typeof exector !== 'function') {
            throw '第一个参数必须是函数';
        }
        if (start === end) {
            return r();
        }
        const open = start - end < 0;
        const height = Math.abs(start - end);
        const distance = height / (ms / (1000 / fps));
        const proc = () => {
            if (open && start >= end || !open && start <= end) {
                return r();
            }
            const y = open ? start += distance : start -= distance;
            exector(y, proc);
        };
        proc();
    });

/**
 * setData 方便 await
 * @param {Object} context this
 * @param {Object} obj 要设置的值
 */
export const syncSetData = (context, obj = {}) => new Promise(r => context.setData(obj, r));

/**
 * 下拉刷新、feed 小球高度计算计算小球位置
 *
 * @param {number} offsetY 滑动长度
 * @param {number=} boxHeight 容器高度 单位px
 * @param {number=} circleSize 小球大小，默认 21px
 * @param {number=} offsetX 小球移动距离 默认33px
 */
export const calcCircle = (offsetY, boxHeight = upx2dpx(192), circleSize = upx2dpx(21), offsetX = upx2dpx(33)) => {
    const limitL = (boxHeight - circleSize) / 2 | 0;
    const limitR = limitL + (limitL / 2 | 0);
    let opacityL = 0;
    let opacityR = 0;
    let xL = 0;
    let xR = 0;
    if (offsetY > limitL) {
        opacityL = (offsetY - limitL) / limitL;
        opacityL = opacityL > 1 ? 1 : opacityL;

        if (offsetY > limitR) {
            opacityR = (offsetY - limitR) / (boxHeight - limitR);
            opacityR = opacityR > 1 ? 1 : opacityR;
            xL = opacityR * offsetX;
            xR = opacityR * offsetX;
        }

        return {
            'circle.opacityL': opacityL.toFixed(2),
            'circle.opacityR': opacityR.toFixed(2),
            'circle.xL': xL.toFixed(2),
            'circle.xR': xR.toFixed(2)
        };
    }
};


/**
 * 平台信息
 */
export const systemInfo = (() => {
    let info = {};
    try {
        info = swan.getSystemInfoSync();
    } catch (e) {}
    return info;
})();

/**
 * 判断机型
 */
export const checkModel = (mobile = 'iphone x') => systemInfo.model.toLowerCase().includes(mobile);

/** 避免重复执行
 *
 * @param {Function} exector 执行函数
 * @param {number=} time 防止重复执行时间 * 可不设置
 */
let disabled = false;
let last = Date.now();
export const preventRepeat = (exector, time) => {
    if (typeof exector !== 'function') {
        throw 'preventRepeat的第一个参数必须是函数';
    }

    if (!disabled || ((Date.now() - last) / 1000 | 0) > 3) {
        disabled = true;
        last = Date.now();
        const done = () => (disabled = false);
        exector(done);
        typeof time === 'number' && setTimeout(done, time);
    }
};
/**
 * 限制字符串字数
 *
 * @param {number} limit 限制长度
 * @param {string} string 被检测的字符串
 * @returns {string} 返回符合要求的字符串
 */
export const limitStr = (str = '', limit) => str.length <= limit ? str : str.substr(0, limit);

/**
 * 一维数组转多维数组
 *
 * @param {Array} arr 原始数组
 * @param {number} col 结果数组维度
 * @return {Array} 多维数组
 */
export const multipleColumnsArr = (arr, col) => {
    if (!Array.isArray(arr)) {
        throw new TypeError('function multipleColumnsArr 第一个参数必须是数组');
    }
    if (typeof col !== 'number') {
        throw new TypeError('function multipleColumnsArr 第二个参数必须是数字');
    }
    const resArr = [];
    const n = Math.ceil(arr.length / col);
    for (let i = 0; i < n; i++) {
        const tempArr = [];
        for (let j = 0; j < col; j++) {
            const val = arr[i * col + j];
            val && tempArr.push(val);
        }
        resArr.push(tempArr);
    }
    return resArr;
};

/**
 * 判断是否 ios
 *
 * @return {boolean} true | false
 */
export const isIos = (() => systemInfo.platform === 'ios')();

/**
 * 检查是不是全面屏
 *
 * @return {boolean} 是不是全面屏机型
 */
export const isFullScreen = (function () {
    try {
        const info = systemInfo.model.toLowerCase();
        const spPhoneType = [
            'iphone x',
            'iphone xr',
            'iphone xs',
            'iphone xs max',
            'iphone 11',
            'iphone 11 pro',
            'iphone 11 pro max'
        ];
        return spPhoneType.some(ele => info.includes(ele));
    } catch (err) {
        console.log('设备信息获取失败', err);
    }
})();

/**
 * 获取元素计算样式
 */
export const getComputedStyle = (id, self) =>
    new Promise((r, j) => {
        try {
            const query = swan.createSelectorQuery().in(self).select(id);
            query.boundingClientRect(res => {
                res ? r(res) : j('获取失败');
            }).exec();
        } catch (err) {
            j('获取失败');
        }
    });

/**
 * 获取当前页面的page信息
 *
 * @return {Object}  页面信息
 */
export const getCurrentPage = () => {
    let pages = getCurrentPages();
    return pages[pages.length - 1];
};