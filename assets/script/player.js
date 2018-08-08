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
        go: false,
        //player是否在家
        on_home: true,
        game_over: false,
        texture_img: {
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    start () {
        // console.log(this.game);
        this.node.getComponent(cc.MotionStreak).enabled = true;
        this.game.node.getChildByName("score").getComponent(cc.Label).string = "得分 : " + window.score;
    },
    onBeginContact(contact, self, other) {
        // console.log(contact, self, other);
        switch (other.tag) {
            case 0://玩家碰到墙体
                this.game.particle1(self.node.x, self.node.y);
                this.game_over = true;
                this.over();
                break;
            case 1://玩家碰到小球
                console.log(other.tag);
                // game.OnPlayertoBall(self.node, other.node);
                //  console.log(self.node.x, self.node.y);
                //   console.log(other.node.x, other.node.y);
                this.go = true;
                this.on_home = false;


                break;
            case 2://玩家碰到家
                // console.log(other.tag);
                this.go = false;
                if (this.on_home == false) {
                    this.on_home = true;
                    this.game.player_home = true;
                    this.node.rotation = 360;
                    this.game.rotation_game = 360;
                    this.game.node.getChildByName('ball').parent = null;
                    this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
               /*          this.node.x = 0;
                     this.node.y = -426;
*/
                    this.game.speed_num = 0;
                    /* other.node.parent = null;*/
                    var ball = cc.instantiate(this.ball);
                    ball.parent = this.game.node;
                    ball.x = Math.random() * this.game.node.x * 0.8;
                    ball.y = Math.random() * this.game.node.y * 0.8;
                    window.score += 1;
                    this.game.node.getChildByName("score").getComponent(cc.Label).string = "得分 : " + window.score;
                }
                //   console.log(this.game.node.getChildByName("score").getComponent(cc.Label).string);

                break;
            case 3://玩家碰到障碍物
                this.game.particle1(self.node.x, self.node.y);
                this.game_over = true;
                this.over();
                break;
        }
    },
    over (){
        this.game.node.getChildByName('ball').parent = null;
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        this.node.getComponent(cc.RigidBody).enabledContactListener = false;
        this.game.node.getChildByName("over").active = true;
        this.game.node.getChildByName("over_img").active = true;
        this.game.node.getChildByName("Label_score").active = true;
      //  this.game.node.getChildByName("ranking_list").active = true;
        //  this.game.node.getChildByName("ranking_list").setLocalZOrder(1);
        this.game.player_over = true;
        this.game.node.getChildByName('obstacle1').getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        this.game.node.getChildByName('obstacle1').setLocalZOrder(-1);
        this.game.node.getChildByName('obstacle2').getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        this.game.node.getChildByName('obstacle2').setLocalZOrder(-1);
        this.game.node.getChildByName("Label_score").getComponent(cc.Label).string = "得分 : " + window.score;
        //this.game.node.targetOff(this.game.node);
        this.game.node.pauseSystemEvents(true);
        if (typeof wx != "undefined") {
            //设置分数

            // 让子域更新当前用户的最高分，因为主域无法得到getUserCloadStorage;
            let openDataContext = wx.getOpenDataContext();
            openDataContext.postMessage({
                type: 'updateMaxScore',
                score: window.score.toString()
            });

        }
    },
    update (dt) {
        if (this.go && this.game_over == false) {
            this.game.node.getChildByName('ball').x = this.node.x;
            this.game.node.getChildByName('ball').y = this.node.y;
        }
        if (this.game.player_home) {
            this.node.position = cc.v2(0, -426);
            this.node.rotation = 360;
        }
        this.node.getComponent(cc.MotionStreak)._onNodePositionChanged()
    },
});
