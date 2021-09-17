/**
 * @file rate
 * @author v_zhaoxinggang
 * @date 2020-08-17
 */

/* global swan */

/**
 * 获取元素计算样式
 */
const getComputedStyle = (id, self) =>
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

Component({ // eslint-disable-line
    externalClasses: [
        'smt-rate-wrap',
        'smt-star-wrap',
        'smt-tip-wrap'
    ],

    properties: {

        // 星星总数
        count: {
            type: Number,
            value: 5
        },
        // 激活星星个数，范围是 0 ~ count，可以是小数，例如 3.5
        stars: {
            type: Number,
            value: -1
        },
        // 激活星星的色值
        activeColor: {
            type: String,
            value: '#2772FB'
        },
        // 未激活星星的色值
        sleepColor: {
            type: String,
            value: '#ccc'
        },
        // 星星的大小
        starSize: {
            type: String,
            value: '24px'
        },
        // 右侧提示文案
        tipText: {
            type: String,
            value: ''
        },
        // 右侧提示文案颜色
        tipTextColor: {
            type: String,
            value: '#999'
        },
        // 是否显示右侧提示文案 默认提示为 （* 分）
        hasTipText: {
            type: Boolean,
            value: false
        },
        // 是否禁用
        disabled: {
            type: Boolean,
            value: false
        },
        // 是否可以滑动选择
        isSliding: {
            type: Boolean,
            value: false
        },

        // 通过 slot 自定义星星图标
        customStar: {
            type: Boolean,
            value: false
        }
    },
    attr: {
        // 未激活星星常量
        starO: {
            icon: 'star-o',
            color: '',
            level: 0
        },
        // 半激活星星常量
        starHalf: {
            icon: 'star-half',
            color: '',
            level: 0.5
        },
        // 激活星星常量
        star: {
            icon: 'star',
            color: '#2772FB',
            level: 1
        },
        // 星星父级盒子的计算样式
        starsParentNode: {
            left: 0,
            childW: 0
        }
    },

    data: {
        list: [],

        // 上次操作激活星星数
        prevStars: 0,

        // 右侧提示文案
        defaultTipText: ''
    },

    observers: {
        stars(val) {
            this.rander(val);
        }
    },
    created() {
        const {
            stars,
            activeColor,
            sleepColor
        } = this.data;
        this.attr.starO.color = sleepColor;
        this.attr.starHalf.color = activeColor;
        this.attr.star.color = activeColor;
        this.attr.prevStars = stars;
        this.setData('defaultTipText', stars);
    },
    methods: {
        /**
         * 根据当前星星激活数更新渲染数据
         */
        rander(stars) {
            this.data.list = [];
            const {
                list,
                count
            } = this.data;
            const {
                star,
                starO,
                starHalf,
                prevStars,
                starsParentNode
            } = this.attr;
            for (let i = 0; i < count; i++) {
                const itemLevel = stars - i;
                if (itemLevel >= 1) {
                    list.push(star);
                } else if (itemLevel > 0 && itemLevel < 1) {
                    list.push(starHalf);
                } else {
                    list.push(starO);
                }
            }
            this.setData({
                    list
                },
                async () => {
                    if (!starsParentNode.width) {
                        const res = await getComputedStyle('.stars-wrap', this);
                        this.attr.starsParentNode = {
                            left: res.left,
                            childW: res.width / count
                        };
                    }
                    this.setData('defaultTipText', stars);
                    this.triggerEvent('change', {
                        new: stars,
                        old: prevStars
                    });
                    this.data.prevStars = stars;
                });
        },
        /**
         * 点击星星时触发事件
         *
         * @param {Event} e 事件详情
         * @return {undefined} undefined 禁用状态终止点击事件
         */
        changeStars(e) {
            let {
                list,
                disabled
            } = this.data;
            if (disabled) {
                return;
            }
            const idx = e.currentTarget.dataset.index;
            const curStar = list[idx];
            const nextIdx = idx + 1;
            const nextStar = list[nextIdx] || {};
            if ((curStar.level === 1 && nextStar.level !== 0) || curStar.level < 1) {
                this.rander(nextIdx);
            }
        },
        /**
         * 手指滑动事件
         *
         * @param {*} e 事件详情
         * @param {undefined} 滑动超出范围终止函数
         */
        touchEnd(e) {
            const {
                isSliding,
                disabled
            } = this.data;
            if (disabled || !isSliding) {
                return;
            }
            const {
                left,
                childW
            } = this.attr.starsParentNode;
            const clientX = e.changedTouches[0].clientX;
            const disX = clientX - left;
            const count = this.data.count;
            const stars = Math.ceil(disX / childW);
            this.rander(stars > count ? count : stars < 1 ? 1 : stars);
        }
    }
});