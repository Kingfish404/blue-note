/**
 * @file behavior
 * @author zhangwen22(zhangwen22@baidu.com)
 */
import EventsEmitter from '@smt-lib/observer';

const eventsEmitter = new EventsEmitter();

/* global Behavior, getApp */
module.exports = Behavior({// eslint-disable-line
    created() {
        const app = getApp();
        if (!app._solutionEventsEmitter) {
            app._solutionEventsEmitter = eventsEmitter;
        }
        this.eventsEmitter = app._solutionEventsEmitter;
    },
    methods: {

        /**
         * 广播，通知所有组件
         *
         * @param {Object} message 需要广播的消息
         */
        broadcast(message) {
            this.eventsEmitter.fireMessage({
                ...message,
                nodeId: this.nodeId
            });
        }
    }
});
