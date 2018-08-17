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
        particle_node1: {
            type: cc.Prefab,
            default: null
        },
        particle_node2: {
            type: cc.Prefab,
            default: null
        },
        //player 初始速度
        speed_game: 300,
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
            /* if (this.rotation_game == 0) {
             this.rotation_game = 360;
             }*/
            this.player.rotation = this.rotation_game;
            this.player.getComponent(cc.RigidBody).linearVelocity = speed_root[this.speed_num];
            this.speed_num += 1;
            //  this.rotation_game -= 90;


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
        obstacle2.x = this.node.x;
        var y_r1 = Math.random();
        var y_r2 = Math.random();
        var y_root = [
            326, 163, -7, -181
        ];
        if (y_r1 < 0.25) {
            obstacle1.y = y_root[0];
            if (y_r2 < 0.3) {
                obstacle2.y = y_root[1];
            }else if(0.3 <= y_r2 < 0.6){
                obstacle2.y = y_root[2];
            }else {
                obstacle2.y = y_root[3];
            }
        }else if(0.25 <= y_r1 < 0.5){
            obstacle1.y = y_root[1];
            if (y_r2 < 0.3) {
                obstacle2.y = y_root[0];
            }else if(0.3 <= y_r2 < 0.6){
                obstacle2.y = y_root[2];
            }else {
                obstacle2.y = y_root[3];
            }
        }else if(0.5 <= y_r1 < 0.75){
            obstacle1.y = y_root[2];
            if (y_r2 < 0.3) {
                obstacle2.y = y_root[0];
            }else if(0.3 <= y_r2 < 0.6){
                obstacle2.y = y_root[1];
            }else {
                obstacle2.y = y_root[3];
            }
        }else {
            obstacle1.y = y_root[3];
            if (y_r2 < 0.3) {
                obstacle2.y = y_root[0];
            }else if(0.3 <= y_r2 < 0.6){
                obstacle2.y = y_root[1];
            }else {
                obstacle2.y = y_root[2];
            }
        }
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
        var par = cc.instantiate(this.particle_node1);
        par.parent = this.node;
        par.x = x;
        par.y = y;
    },
    particle2(x, y){
        var par = cc.instantiate(this.particle_node2);
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
        //this.obstacle_speed += 0.01;
        this.speed_game += 0.01;
        var ob1 = this.node.getChildByName('obstacle1');
        var ob2 = this.node.getChildByName('obstacle2');
        if (this.player_over == false) {
            ob1.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.obstacle_speed, 0);
            ob2.getComponent(cc.RigidBody).linearVelocity = cc.v2(-this.obstacle_speed, 0);
        }
        if (ob1.x > this.node.x * 1.8) {
            ob1.x = -this.node.x * 1.8;
            ob1.y = Math.random() * this.node.y * 0.5 + this.node.y * 0.3;
            ob2.x = this.node.x * 1.8;
          /*  var y1 = ob1.y - this.node.y / 2 + 0.8 * ob1.height / 2 + 0.8 * ob2.height / 2;
            var y2 = ob1.y + this.node.y / 2 - 0.8 * ob1.height / 2 - 0.8 * ob2.height / 2;
            //  console.log(ob1.y,y1,y2);
            if (Math.random() > 0.5 && y1 < 320) {

                ob2.y = y1;
            } else {
                ob2.y = y2;
            }*/
            var y_r1 = Math.random();
            var y_r2 = Math.random();
            var y_root = [
                326, 163, -7, -181
            ];
            if (y_r1 < 0.25) {
                ob1.y = y_root[0];
                if (y_r2 < 0.3) {
                    ob2.y = y_root[1];
                }else if(0.3 <= y_r2 < 0.6){
                    ob2.y = y_root[2];
                }else {
                    ob2.y = y_root[3];
                }
            }else if(0.25 <= y_r1 < 0.5){
                ob1.y = y_root[1];
                if (y_r2 < 0.3) {
                    ob2.y = y_root[0];
                }else if(0.3 <= y_r2 < 0.6){
                    ob2.y = y_root[2];
                }else {
                    ob2.y = y_root[3];
                }
            }else if(0.5 <= y_r1 < 0.75){
                ob1.y = y_root[2];
                if (y_r2 < 0.3) {
                    ob2.y = y_root[0];
                }else if(0.3 <= y_r2 < 0.6){
                    ob2.y = y_root[1];
                }else {
                    ob2.y = y_root[3];
                }
            }else {
                ob1.y = y_root[3];
                if (y_r2 < 0.3) {
                    ob2.y = y_root[0];
                }else if(0.3 <= y_r2 < 0.6){
                    ob2.y = y_root[1];
                }else {
                    ob2.y = y_root[2];
                }
            }
        }
    },
});
