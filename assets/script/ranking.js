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
        texture_img: {
            default: null
        },
        _rank: false
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {
        if (typeof wx != "undefined") {
            console.log(this);
            var texture = new cc.Texture2D();
            let openDataContext = wx.getOpenDataContext();
            let sharedCanvas = openDataContext.canvas;
            sharedCanvas.height = this.node.parent.getChildByName("ranking_list").height;
            sharedCanvas.width = this.node.parent.getChildByName("ranking_list").width;
            texture.initWithElement(sharedCanvas);
            texture.handleLoadedTexture();
            this.texture_img = texture;
            console.log(texture);
            this.node.on(cc.Node.EventType.TOUCH_START, function () {
                this._rank = true;
                openDataContext.postMessage({
                    type: 'ranking'
                });
                this.node.parent.getChildByName("ranking_list").active = true;
                this.node.parent.getChildByName("del").active = true;
                this.node.parent.getChildByName("ranking_bg").active = true;
              //  this.node.parent.getChildByName("ranking_list").setLocalZOrder(1);
            }.bind(this));
            this.node.parent.getChildByName("ranking_list").on(cc.Node.EventType.TOUCH_MOVE, function (e) {
                const deltaY = e.getDeltaY();
                if(typeof wx != "undefined"){
                    let openDataContext = wx.getOpenDataContext();
                    openDataContext.postMessage({
                        type: 'Paging',
                        data: deltaY
                    });
                }
            }.bind(this));
        }

        this.node.parent.getChildByName("del").on(cc.Node.EventType.TOUCH_START, function () {
            this._rank = false;
            this.node.parent.getChildByName("ranking_list").active = false;
            this.node.parent.getChildByName("del").active = false;
            this.node.parent.getChildByName("ranking_bg").active = false;
        }.bind(this))
    },

    update (dt) {
        if (this._rank == true) {
            this.node.parent.getChildByName("ranking_list").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.texture_img);
        }
    },
});
