/**
 * @file app.js
 * @author jinyu
 */

/* globals swan */

App({
    onShow(options) {
        // do something when show
        swan.setPageInfo({
            title: '小蓝便笺',
            keywords: '日记,心情,便笺,日历，天气，蓝',
            description: '给你轻量，简约的记录体验',
            articleTitle: '给你轻量，简约的记录体验',
            image: [
                ''
            ],
            success: res => {
            },
            fail: err => {
                console.log('setPageInfo fail', err);
            }
        })
    },
    onHide() {
        // do something when hide
    },
    onError() {
        // do something when error
    }
});