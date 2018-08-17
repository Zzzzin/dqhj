// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
window.revive_num = 0;
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
        this.node.on(cc.Node.EventType.TOUCH_START, function () {
            if (typeof wx != "undefined") {
                //主动拉起分享接口
                cc.loader.loadRes("texture/share", function (err, data) {
                    wx.shareAppMessage({
                        title: "不怕，就来PK！",
                        imageUrl: data.url,
                        success(res){
                            console.log("转发成功!!!");
                            cc.director.loadScene("game_scene");
                            window.revive_num = 1;
                           // this.node.getComponent(cc.Sprite).spriteFrame.setTexture(cc.url.raw('resources/music_off.png'));
                        },
                        fail(res){
                            console.log("转发失败!!!")
                        }
                    })
                })
            }
        }.bind(this), this)
    },

    // update (dt) {},
});
