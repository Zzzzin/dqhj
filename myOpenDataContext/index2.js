wx.onMessage(data => {
    if (data.type === 'group') {
        let shareTicket = data.text; // 开放数据域顺利拿到shareTicket
    }
    if (data.type === 'updateMaxScore') {
       /* wx.getUserCloudStorage({
            keyList:["score"],
            success:res =>{
                console.log(res);
            }
        })*/
     /*   console.log(1);
        let sharedCanvas = wx.getSharedCanvas();
        let context = sharedCanvas.getContext('2d');
        const screenWidth = wx.getSystemInfoSync().screenWidth;
        const screenHeight = wx.getSystemInfoSync().screenHeight;
        const ratio = wx.getSystemInfoSync().pixelRatio;
//绘制元素的时候
        context.scale(ratio, ratio);// 因为sharedCanvas在主域放大了ratio倍
//为了便于计算尺寸，在将context 缩放到750宽的设计稿尺寸，
        let scales = screenWidth / 750;
        context.scale(scales, scales);
// 接下来你每绘制的一个元素的尺寸，都应该按钮750宽的设计稿/
// 比如
// 画标题
        context.fillStyle = '#fff';
        context.font = '50px Arial';
        context.textAlign = 'center';
        context.fillText('好友排行榜', 750 / 2, 220); // 750的尺寸
        console.log(2);*/
        function drawRankList (data) {
            console.log(data);
            showGroupRank(data);
            data.forEach((item, index) => {
                // ...
            })
        }

        wx.getFriendCloudStorage({
            keyList: ['score'], // 你要获取的、托管在微信后台都key
            success: res => {
                let data = res.data
                drawRankList(data)
            }
        })
    }
    //绘制排行榜
    var showGroupRank = function(data){
        var shareCanvas = wx.getSharedCanvas();
        var ctx = shareCanvas.getContext("2d");
        const screenWidth = wx.getSystemInfoSync().screenWidth;
        const screenHeight = wx.getSystemInfoSync().screenHeight;
        const ratio = wx.getSystemInfoSync().pixelRatio;
        console.log(3);
        let scales = screenWidth / 750;
        ctx.scale(scales, scales);
        ctx.scale(ratio, ratio);
        ctx.fillRect(100,300,150,100);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.font="50px Georgia";
        ctx.fillText('好友排行榜', 750 / 2, 220); // 750的尺寸

        console.log("shareCanvas 显示成功！当前shareCanvas,width:" + shareCanvas.width + ";height:" + shareCanvas.height);
    };

});