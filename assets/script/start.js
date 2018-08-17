// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
//是否开启音乐  默认开启
window.isOpen = true;
cc.Class({
    extends: cc.Component,

    properties: {
        // 游戏音乐资源
        gameAudio: {
            default: null,
            url: cc.AudioClip
        },


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        window.isOpen = true;//开启音乐
        cc.audioEngine.playMusic(this.gameAudio, true);
        if (typeof wx != "undefined") {
            //开启右上角的分享
            wx.showShareMenu();
            //监听右上角的分享调用
            cc.loader.loadRes("share", function (err, data) {
                wx.onShareAppMessage(function (res) {
                    console.log(data);
                    return {
                        title: "不怕，就来PK！",
                        imageUrl: data.url,
                        success(res){
                            console.log("转发成功!!!")
                            //  common.diamond += 20;
                        },
                        fail(res){
                            console.log("转发失败!!!")
                        }
                    }
                })
            });
        }
    },
    music(){
        //检查音乐开启状态
        //如果音乐开启了则关闭音乐和音效
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
    },
    start () {
        if (typeof wx != "undefined") {
            wx.checkSession({
                success: function (res) {
                    console.log("处于登录态");
                },
                fail: function (res) {
                    console.log("需要重新登录");
                    wx.login({
                        success: function () {
                            wx.getUserInfo({
                                success: function (res) {
                                    console.log(res);
                                }
                            })
                        }
                    });
                }
            });
        }
        this.node.parent.getChildByName('music').on(cc.Node.EventType.TOUCH_START, function () {
            this.music();
        }.bind(this));


        this.node.on(cc.Node.EventType.TOUCH_START, function () {
            var fo = cc.fadeOut(0.5);
            var load = cc.callFunc(function(){
                cc.director.loadScene("game_scene");
            },this);
            var seq = cc.sequence(fo, load);
            this.node.parent.runAction(seq);

        }.bind(this))
    },

    // update (dt) {},
});
