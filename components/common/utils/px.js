/**
 * @file px.js
 * @author LipengJia (jialipeng@baidu.com)
 * @desc px方法
 */

// 屏幕宽度
const srnWidth = (swan.getSystemInfoSync() || {}).screenWidth || 0;

/**
 * upx2rpx 3倍ue图px转rpx
 * @param {number} px 默认三倍像素
 * @param {number=} precision rpx精确度
 * @param {number=} uiWidth 视觉图宽度 例如 1242
 * @return {number} 单位rpx
 */
export const upx2rpx = (px = 0, precision = 2, uiWidth = 1242) => {
    if (px === 0) {
        return 0;
    }
    let result = 750 / uiWidth * parseInt(px, 10);
    result = result.toFixed(precision);
    result = parseInt(result, 10) === +result ? parseInt(result, 10) : +result;
    return result;
};

/**
 * upx2dpx 3倍ue图px(1242)转设备px
 * dpx: device px, 通过swan.createSelectorQuery获取的px
 * 尽量使用此方法和boundingClientRect获取的值比较，因为rpx精度更差
 *
 * @param {number} px 3倍ue图px
 * @param {number=} precision 返回精度
 * @param {number=} uiWidth 视觉图宽度 例如 1242
 * @return {number} 设备上的px 单位：px
 */
export const upx2dpx = (px = 0, precision = 0, uiWidth = 1242) => {
    if (px === 0) {
        return 0;
    }
    const result = srnWidth / uiWidth * px;
    // 小程序只取整
    if (precision === 0) {
        return Math.round(result);
    }
    return parseFloat(result.toFixed(precision));
};

/**
 * dpx2upx 设备px转3倍ue图px(1242)
 * dpx: device px, 通过swan.createSelectorQuery获取的px
 *
 * @param {number} px 3倍ue图px
 * @param {number=} precision 返回精度
 * @param {number=} uiWidth 视觉图宽度 例如 1242
 * @return {number} 视觉图上的px 单位：px
 */
export const dpx2upx = (px = 0, precision = 0, uiWidth = 1242) => {
    if (px === 0) {
        return 0;
    }
    const result = px / (srnWidth / uiWidth);
    // 小程序只取整
    if (precision === 0) {
        return Math.round(result);
    }
    return parseFloat(result.toFixed(precision));
};

/**
 * dpx2rpx 设备px转rpx
 * @param {number} px 设备上通过query得到的px
 * @param {number=} precision rpx精确度
 * @param {number=} uiWidth 视觉图宽度 例如 1242
 * @return {number} 单位：rpx
 */
export const dpx2rpx = (px = 0, precision = 2, uiWidth = 1242) => {
    if (px === 0) {
        return 0;
    }
    const result = dpx2upx(px, precision, uiWidth);
    return upx2rpx(result, precision, uiWidth);
};


