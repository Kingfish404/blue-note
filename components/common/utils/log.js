/**
 * @file 日志统一打印文件
 * @author houyu(houyu01@baidu.com)
 */

/* globals Page swan */

/**
 * 解析日志串为可打印的日志参数
 *
 * @param {string} logStr - 日志字符串
 * @return {Object} 打印的日志参数
 */
const parseLogParams = logStr => {
    const logInfoArr = logStr.split('|');
    return logInfoArr.reduce((res, item) => {
        const infos = item.split(':');
        res[infos[0]] = infos[1];
        return res;
    }, {});
};

Page.after({

    methods: {

        onReady(e) {
            const query = swan.createSelectorQuery();
            query.select('[class*="show-log"]')
                .fields({
                    dataset: true
                }, function (res) {
                    if (!res) {
                        return;
                    }
                    const logParams = parseLogParams(res.dataset.showLog);
                    const logName = logParams.name;
                    delete logParams.name;
                    swan.reportAnalytics(logName, logParams);
                }).exec();
        }

    },

    events: {

        '[data-click-log]:tap'(context) {
            const logInfo = context.target.dataset.clickLog || '';
            const logParams = parseLogParams(logInfo);
            const logName = logParams.name;
            delete logParams.name;
            swan.reportAnalytics(logName, logParams);
        }

    }
});
