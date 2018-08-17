const Game = require('game');
//得分
window.score = 0;
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
        ball: {
            type: cc.Prefab,
            default: null
        },
        game: Game,
        //回家路上
        go: false,
        //player是否在家
        on_home: true,
        //气泡破碎
        boom: false,
        game_over: false,
        texture_img: {
            default: null
        },
        eat: {
            default: null,
            url: cc.AudioClip
        },
        gohome: {
            default: null,
            url: cc.AudioClip
        },
        die: {
            default: null,
            url: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    start () {
        this.node.getComponent(cc.MotionStreak).enabled = true;
        this.game.node.getChildByName("score").getComponent(cc.Label).string = "拯救 " + window.score + "个";
    },
    onBeginContact(contact, self, other) {
        // console.log(contact, self, other);
        switch (other.tag) {
            case 0://玩家碰到墙体
                cc.loader.loadRes("die", cc.AudioClip, function (err, clip) {
                    var audioID = cc.audioEngine.playEffect(clip, false);
                });
                this.game.particle1(self.node.x, self.node.y);
                this.game_over = true;
                this.over();
                break;
            case 1://玩家碰到小球
                if (this.boom == false) {
                    cc.loader.loadRes("eat", cc.AudioClip, function (err, clip) {
                        var audioID = cc.audioEngine.playEffect(clip, false);
                    });
                    this.game.particle2(self.node.x, self.node.y);
                    this.boom = true;
                }
                this.go = true;
                this.on_home = false;

                break;
            case 2://玩家碰到家
               // console.log(other.tag);
                this.go = false;

                if (this.on_home == false) {
                    cc.loader.loadRes("gohome", cc.AudioClip, function (err, clip) {
                        var audioID = cc.audioEngine.playEffect(clip, false);
                    });
                    var fo = cc.fadeOut(0.5);
                    var fi = cc.fadeIn(0.5);
                    var seq = cc.sequence(fo, fi);
                    this.game.node.runAction(seq);


                    var scl = cc.callFunc(function () {
                        this.node.scaleX = 0.5;
                        this.node.scaleY = 0.5;
                    }, this);
                    var _home = cc.moveTo(1, cc.v2(0, -425));
                    var spawn = cc.spawn(scl,_home);
                    var finished = cc.callFunc(function () {
                        this.game.player_home = true;
                    }, this);
                    var seq1 = cc.sequence(spawn, finished);
                    this.node.runAction(seq1);

                    this.on_home = true;
                    this.boom = false;
                    this.node.rotation = 360;
                    this.game.rotation_game = 360;
                    this.game.node.getChildByName('ball').parent = null;
                    this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
                    this.game.speed_num = 0;
                    /* other.node.parent = null;*/
                    var ball = cc.instantiate(this.ball);
                    var _this = this;
                    cc.loader.loadRes("baby", cc.SpriteFrame, function (err, spriteFrame) {
                        _this.game.node.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    });
                    ball.parent = this.game.node;
                    ball.x = Math.random() * this.game.node.x * 0.8;
                    ball.y = Math.random() * this.game.node.y * 0.7;
                    window.score += 1;
                    this.game.node.getChildByName("score").getComponent(cc.Label).string = "拯救 " + window.score + "个";
                }
                //   console.log(this.game.node.getChildByName("score").getComponent(cc.Label).string);

                break;
            case 3://玩家碰到障碍物
                cc.loader.loadRes("die", cc.AudioClip, function (err, clip) {
                    var audioID = cc.audioEngine.playEffect(clip, false);
                });
                this.game.particle1(self.node.x, self.node.y);
                this.game_over = true;
                this.over();
                break;
        }
    },
    over (){
        this.game.node.getChildByName('ball').parent = null;
        this.node.parent = null;
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        this.node.getComponent(cc.RigidBody).enabledContactListener = false;
        this.game.node.getChildByName("over").active = true;
        if (window.isOpen) {

        }
        else {
            this.game.node.getChildByName('over').getChildByName('music').getComponent(cc.Sprite).spriteFrame.setTexture(cc.url.raw('resources/music_off.png'));
        }
        this.game.player_over = true;
        this.game.node.getChildByName('obstacle1').getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        this.game.node.getChildByName('obstacle1').setLocalZOrder(-1);
        this.game.node.getChildByName('obstacle2').getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        this.game.node.getChildByName('obstacle2').setLocalZOrder(-1);
        this.game.node.getChildByName('over').getChildByName("Label_score").getComponent(cc.Label).string =   window.score ;
        this.game.node.pauseSystemEvents(true);
        if (typeof wx != "undefined") {
            //设置分数

            // 让子域更新当前用户的最高分，因为主域无法得到getUserCloudStorage;
            let openDataContext = wx.getOpenDataContext();
            openDataContext.postMessage({
                type: 'updateMaxScore',
                score: window.score.toString()
            });

        }
    },
    update (dt) {
        if (this.go && this.game_over == false) {
            // console.log(this.node);
            this.game.node.getChildByName('ball').x = this.node.x;
            this.game.node.getChildByName('ball').y = this.node.y;
            this.node.scaleX += 0.05 * dt;
            this.node.scaleY += 0.05 * dt;
            var url = 'happy_baby';
            var _this = this;
            cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                _this.game.node.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });

        }
        if (this.game.player_home) {


            this.node.scaleX = 0.5;
            this.node.scaleY = 0.5;
            this.node.position = cc.v2(0, -425);
            // this.node.rotation = 360;

        }
        this.node.getComponent(cc.MotionStreak)._onNodePositionChanged()
    },
});
