// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        //如果音乐开启了则关闭音乐和音效
        this.node.on(cc.Node.EventType.TOUCH_START, function () {
            if (window.isOpen) {
                //if (cc.audioEngine.isMusicPlaying()) {
                cc.audioEngine.pauseMusic();//暂停正在播放音乐
                cc.log("暂停正在播放音乐");
                this.node.parent.getChildByName('music').getComponent(cc.Sprite).spriteFrame.setTexture(cc.url.raw('resources/music_off.png'));
                window.isOpen = false;
            }
            else {
                // cc.log("music is not playing");
                cc.audioEngine.resumeMusic();//恢复背景音乐
                cc.log("恢复背景音乐");
                this.node.parent.getChildByName('music').getComponent(cc.Sprite).spriteFrame.setTexture(cc.url.raw('resources/music_on.png'));
                window.isOpen = true;
            }
        }.bind(this))

    },

    // update (dt) {},
});
