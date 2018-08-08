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

        player: {
            type: cc.Node,
            default: null
        },
        ball: {
            type: cc.Prefab,
            default: null
        },
        obstacle1: {
            type: cc.Prefab,
            default: null
        },
        obstacle2: {
            type: cc.Prefab,
            default: null
        },
        particle_node: {
            type: cc.Prefab,
            default: null
        },
        //player 初始速度
        speed_game: 200,
        speed_num: 0,
        //player 初始方向
        rotation_game: 360,
        //障碍物初始速度
        obstacle_speed: 200,
        player_home: false,
        player_over: false,
        gameAudio: {
            default: null,
            url: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //物理引擎
        let phy = cc.director.getPhysicsManager();
        phy.enabled = true;
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

    start () {
        //音乐
        /* if (window.isOpen) {
         cc.audioEngine.playMusic(this.gameAudio, true);
         cc.log("正在播放音乐__game");

         }*/

        //  this.player.getComponent(cc.RigidBody).linearVelocity = speed_root[this.speed_num];
        this.node.on(cc.Node.EventType.TOUCH_START, function () {
            var speed_root = [
                cc.v2(0, this.speed_game), cc.v2(-this.speed_game, 0), cc.v2(0, -this.speed_game), cc.v2(this.speed_game, 0)
            ];
            this.player_home = false;
            if (this.speed_num == 4) {
                this.speed_num = 0;
            }
            if (this.rotation_game == 0) {
                this.rotation_game = 360;
            }
            this.player.rotation = this.rotation_game;
            this.player.getComponent(cc.RigidBody).linearVelocity = speed_root[this.speed_num];
            this.speed_num += 1;
            this.rotation_game -= 90;


        }.bind(this));

        //创建小球
        var ball = cc.instantiate(this.ball);
        ball.parent = this.node;
        ball.x = 200;
        ball.y = 200;

        //创建障碍物
        var obstacle1 = cc.instantiate(this.obstacle1);
        var obstacle2 = cc.instantiate(this.obstacle2);
        obstacle1.parent = this.node;
        obstacle2.parent = this.node;
        obstacle1.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.obstacle_speed, 0);
        obstacle2.getComponent(cc.RigidBody).linearVelocity = cc.v2(-this.obstacle_speed, 0);
        obstacle1.x = -this.node.x;
        obstacle1.y = Math.random() * this.node.y * 0.5 + this.node.y * 0.3;
        obstacle2.x = this.node.x;
        obstacle2.y = Math.random() * this.node.y * 0.5 + this.node.y * 0.3;
    },
    OnPlayertoBall(playerNode, ballNode){
        //ballNode.parent = null;
        // return 1;
    },

    _show() {
        let moveTo = cc.moveTo(0.5, 0, 0);
        this.display.runAction(moveTo);
        console.log('i show');
        var kvDataList = new Array();
        kvDataList.push({
            key: "score",
            value: "111"
        });
        wx.setUserCloudStorage({
            KVDataList: kvDataList
        })

        wx.getFriendCloudStorage({
            keyList: ['score'],
            success: function (res) {
                console.log(res);
                //TODO:进行数据绑定更新
            }
        });
    },
    _hide() {
        let moveTo = cc.moveTo(0.5, 0, 1000);
        this.display.runAction(moveTo);
    },


    particle1(x, y){
        var par = cc.instantiate(this.particle_node);
        par.parent = this.node;
        par.x = x;
        par.y = y;
    },
    wx1(){
        //调用登录接口
        wx.login({
            success: function () {
                wx.getUserInfo({
                    success: function (res) {
                        console.log(res);
                    }
                })
            }
        });
        //设置分数
        wx.setUserCloudStorage({
            KVDataList: [{key: 'score', value: score}],
            success: res => {
                console.log(res);
                // 让子域更新当前用户的最高分，因为主域无法得到getUserCloadStorage;
                let openDataContext = wx.getOpenDataContext();
                openDataContext.postMessage({
                    type: 'updateMaxScore',
                });
            },
            fail: res => {
                console.log(res);
            }
        });

        //拉取当前用户所有同玩好友的托管数据（开放数据域使用）
        wx.getFriendCloudStorage({
            keyList: ['score', 'maxScore'], // 你要获取的、托管在微信后台都key
            success: res => {
                console.log(res.data);
            }
        });

        //
        // 将获取到的好友数据绘制到sharedCanvas上
        let sharedCanvas = wx.getSharedCanvas();

        function drawRankList(data) {
            data.forEach((item, index) => {
                // ...
            })
        }

        wx.getFriendCloudStorage({
            success: res => {
                let data = res.data;
                drawRankList(data)
            }
        })


    },
    update (dt) {
        this.obstacle_speed += 0.01;
        this.speed_game += 0.01;
        if (this.player_over == false) {
            this.node.getChildByName('obstacle1').getComponent(cc.RigidBody).linearVelocity = cc.v2(this.obstacle_speed, 0);
            this.node.getChildByName('obstacle2').getComponent(cc.RigidBody).linearVelocity = cc.v2(-this.obstacle_speed, 0);
        }
        if (this.node.getChildByName('obstacle1').x > this.node.x * 1.5) {
            this.node.getChildByName('obstacle1').x = -this.node.x * 1.5;
            this.node.getChildByName('obstacle1').y = Math.random() * this.node.y * 0.5 + this.node.y * 0.3;
        }
        if (this.node.getChildByName('obstacle2').x < -this.node.x * 1.5) {
            this.node.getChildByName('obstacle2').x = this.node.x * 1.5;
            this.node.getChildByName('obstacle2').y = Math.random() * this.node.y * 0.5 + this.node.y * 0.3;
        }
    },
});
