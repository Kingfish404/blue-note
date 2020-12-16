/**
 * @file util.js
 * @author huangzilong (huangzilong@baidu.com)
 */

/**
 * 获取当前日期，格式 yyyy-mm-dd
 *
 * @param {number} offset 偏移，+- number
 * @param {Date} d 当前日期
 * @param {string} separation 分隔
 */
export const getDay = (offset = 0, d = new Date(), separation = '-') => {
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate() + offset);
    const month = day.getMonth() + 1;
    const today = day.getDate();
    return [
        day.getFullYear(),
        month > 9 && month || '0' + month, today > 9 && today || '0' + today
    ].join(separation);
};

/**
 * 获取当前年月 yyyy-mm
 *
 * @param {number} offset 月份偏移 +- number
 * @param {Date} obj 当前日期
 * @param {string} separation 分隔
 */
export const getMonth = (offset = 0, d = new Date(), separation = '-') => {
    const m = new Date(d.getFullYear(), d.getMonth() + offset);
    const month = m.getMonth() + 1;
    return [
        m.getFullYear(),
        month > 9 && month || '0' + month
    ].join(separation);
};
