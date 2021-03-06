const PAGE_SIZE = 6;
const ITEM_HEIGHT = 125;

const dataSorter = (gameDatas, field = "score") => {
    return gameDatas.sort((a, b) => {
        const kvDataA = a.KVDataList.find(kvData => kvData.key === "score");
        const kvDataB = b.KVDataList.find(kvData => kvData.key === "score");
        const gradeA = kvDataA ? parseInt(kvDataA.value || 0) : 0;
        const gradeB = kvDataB ? parseInt(kvDataB.value || 0) : 0;
        return gradeA > gradeB ? -1 : gradeA < gradeB ? 1 : 0;
    });
}

class RankListRenderer {
    constructor() {
        this.totalPage = 0;
        this.currPage = 0;
        this.offsetY = 0;
        this.maxOffsetY = 0;
        this.gameDatas = [];    //https://developers.weixin.qq.com/minigame/dev/document/open-api/data/UserGameData.html
        this.init();
    }

    init() {
        this.canvas = wx.getSharedCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = "high";
    }

    listen() {
        //msg -> {action, data}
        wx.onMessage(msg => {
            console.log("ranklist wx.onMessage", msg);
            switch (msg.type) {
                case "ranking":
                    //case "updateMaxScore":
                    this.fetchFriendData();
                    break;
                case "updateMaxScore":
                    wx.getUserCloudStorage({
                        keyList: ["score"],
                        success: res => {
                            if (res.KVDataList[0].value/1 < msg.score/1) {
                                wx.setUserCloudStorage({
                                    KVDataList: [{ key: 'score', value: msg.score.toString() }],
                                    success: res => {
                                        console.log(res);
                                    },
                                    fail: res => {
                                        console.log(res);
                                    }
                                });
                            }
                        }
                    });
                    break;
                case "Paging" :
                    if (!this.gameDatas.length) {
                        return;
                    }
                    const deltaY = msg.data;
                    const newOffsetY = this.offsetY + deltaY;
                    if (newOffsetY < 0) {
                         console.log("前面没有更多了");
                        return;
                    }
                    if (newOffsetY + PAGE_SIZE * ITEM_HEIGHT > this.maxOffsetY) {
                         console.log("后面没有更多了");
                        return;
                    }
                    this.offsetY = newOffsetY;
                    this.showRanks(newOffsetY);
                    break;
                case Consts.DomainAction.FetchGroup:
                    if (!msg.data) {
                        return;
                    }
                    this.fetchGroupData(msg.data);
                    break;

                case Consts.DomainAction.Paging:
                    if (!this.gameDatas.length) {
                        return;
                    }
                    const delta = msg.data;
                    const newPage = this.currPage + delta;
                    if (newPage < 0) {
                        console.log("已经是第一页了");
                        return;
                    }
                    if (newPage + 1 > this.totalPage) {
                        console.log("没有更多了");
                        return;
                    }
                    this.currPage = newPage;
                    this.showPagedRanks(newPage);
                    break;
                default:
                    console.log(`未知消息类型:msg.action=${msg.action}`);
                    break;
            }
        });
    }

    fetchGroupData(shareTicket) {
        //取出群同玩成员数据
        wx.getGroupCloudStorage({
            shareTicket,
            keyList: [
                "score",
            ],
            success: res => {
                console.log("wx.getGroupCloudStorage success", res);
                const dataLen = res.data.length;
                this.gameDatas = dataSorter(res.data);
                this.currPage = 0;
                this.totalPage = Math.ceil(dataLen / PAGE_SIZE);
                if (dataLen) {
                    this.showPagedRanks(0);
                }
            },
            fail: res => {
                console.log("wx.getGroupCloudStorage fail", res);
            },
        });
    }

    fetchFriendData() {
        //取出所有好友数据
        wx.getFriendCloudStorage({
            keyList: [
                "score",
            ],
            success: res => {
                console.log("wx.getFriendCloudStorage success", res);
                const dataLen = res.data.length;
                this.gameDatas = dataSorter(res.data);
                this.currPage = 0;
                this.totalPage = Math.ceil(dataLen / PAGE_SIZE);
                if (dataLen) {
                    this.showPagedRanks(0);
                }
            },
            fail: res => {
                console.log("wx.getFriendCloudStorage fail", res);
            },
        });
    }

    showPagedRanks(page) {
        const pageStart = page * PAGE_SIZE;
        const pagedData = this.gameDatas.slice(pageStart, pageStart + PAGE_SIZE);
        const pageLen = pagedData.length;

        this.ctx.clearRect(0, 0, 1000, 1000);
        for (let i = 0, len = pagedData.length; i < len; i++) {
            this.drawRankItem(this.ctx, i, pageStart + i + 1, pagedData[i], pageLen);
        }
    }
    showRanks(offsetY) {
        const startY = offsetY % ITEM_HEIGHT;
        const startIndex = Math.floor(offsetY / ITEM_HEIGHT);
        const stopIndex = startIndex + PAGE_SIZE + (startY == 0 ? 0 : 1);
        const datas = this.gameDatas.slice(startIndex, stopIndex);

        this.ctx.clearRect(0, 0, 1000, 1000);
        for (let i = 0, len = datas.length; i < len; i++) {
            this.drawRankItem(this.ctx, i, startIndex + i + 1, datas[i], startY, this.offsetY);
        }
    }

    //canvas原点在左上角
    drawRankItem(ctx, index, rank, data, pageLen) {
        const avatarUrl = data.avatarUrl.substr(0, data.avatarUrl.length) /*+ "132"*/;
        const nick = data.nickname.length <= 10 ? data.nickname : data.nickname.substr(0, 10) + "...";
        const kvData = data.KVDataList.find(kvData => kvData.key === "score");
        const grade = kvData ? kvData.value : 0;
        console.log(grade);
        const itemGapY = ITEM_HEIGHT * index;
        //名次
        ctx.fillStyle = "#D8AD51";
        ctx.textAlign = "right";
        ctx.baseLine = "middle";
        ctx.font = "70px Helvetica";
        ctx.fillText(`${rank}`, 90, 80 + itemGapY);

        //头像
        const avatarImg = wx.createImage();
        avatarImg.src = avatarUrl;
        avatarImg.onload = () => {
            if (index + 1 > pageLen) {
                return;
            }
            ctx.drawImage(avatarImg, 120, 10 + itemGapY, 80, 80);
        };

        //名字
        ctx.fillStyle = "#777063";
        ctx.textAlign = "left";
        ctx.baseLine = "middle";
        ctx.font = "30px Helvetica";
        ctx.fillText(nick, 255, 80 + itemGapY);

        //分数
        ctx.fillStyle = "#777063";
        ctx.textAlign = "left";
        ctx.baseLine = "middle";
        ctx.font = "30px Helvetica";
        ctx.fillText(`${grade}分`, 420, 80 + itemGapY);
        //ctx.fillText(grade+'分', 420, 80 + itemGapY);

        //分隔线
        const lineImg = wx.createImage();
        lineImg.src = 'res/raw-assets/resources/hx.png';
        lineImg.onload = () => {
            if (index + 1 > pageLen) {
                return;
            }
            ctx.drawImage(lineImg, 14, 120 + itemGapY, 720, 1);
        };
    }
}

const rankList = new RankListRenderer();
rankList.listen();