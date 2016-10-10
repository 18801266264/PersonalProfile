//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        /**
         * 创建游戏场景
         * Create a game scene
         */
        this.touchStatus = false; //当前触摸状态，按下时，值为true
        this.distance = new egret.Point(); //鼠标点击时，鼠标全局坐标与_bird的位置差
        this.currentY = 0;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    p.createGameScene = function () {
        this.$touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        var sky = this.createBitmapByName("bl_jpg");
        this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        var sky2 = this.createBitmapByName("bs_jpg");
        this.addChild(sky2);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky2.y = 1136;
        sky2.width = stageW;
        sky2.height = stageH;
        var topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        this.addChild(topMask);
        var haha = new egret.TextField();
        haha.textColor = 0xffffff;
        haha.width = stageW - 172;
        haha.textAlign = "center";
        haha.text = "Hello World";
        haha.size = 60;
        haha.x = 75;
        haha.y = 1136 + 440;
        this.addChild(haha);
        var image = this.createBitmapByName("1_png");
        this.addChild(image);
        image.x = 110;
        image.y = 1136 + 380;
        var colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 172;
        colorLabel.textAlign = "center";
        colorLabel.text = "个人简介";
        colorLabel.size = 70;
        colorLabel.x = 75;
        colorLabel.y = 80;
        this.addChild(colorLabel);
        var Personal = new egret.TextField();
        Personal.textColor = 0xffffff;
        Personal.width = stageW - 172;
        Personal.textAlign = "center";
        Personal.text = "个人介绍：我是一名北京工业大学软件学院数字媒体技术系的学生。我的性格偏于内向，为人坦率、热情、讲求原则；处事乐观、专心、细致、头脑清醒；富有责任心、乐于助人。我还热爱游戏与音乐，平时喜欢宅在家里打dota或者弹琴，对我喜欢的事有着无限的热情。基本上就是这些，谢谢！";
        Personal.size = 24;
        Personal.x = 80;
        Personal.y = 1136 + 180;
        this.addChild(Personal);
        var text = new egret.TextField();
        text.text = "点我点我点我";
        text.touchEnabled = true;
        /*** 本示例关键代码段开始 ***/
        text.textColor = 0xffffff;
        /*** 本示例关键代码段结束 ***/
        this.addChild(text);
        text.x = 125;
        text.y = 2100 - text.textHeight / 2;
        text.size = 60;
        text.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (image.y == 1136 + 380) {
                egret.Tween.get(image).to({ x: 110, y: 1136 + 580 }, 300, egret.Ease.sineIn);
            }
            if (image.y == 1136 + 580) {
                egret.Tween.get(image).to({ x: 110, y: 1136 + 380 }, 300, egret.Ease.sineIn);
            }
        }, this);
        var colors = [];
        colors.push(0xff0000);
        colors.push(0xFFA500);
        colors.push(0xffff00);
        colors.push(0x00ff00);
        var count = 0;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            count %= colors.length;
            text.textColor = colors[count++];
        }, this);
    };
    p.mouseDown = function (evt) {
        console.log("Mouse Down.");
        this.touchStatus = true;
        this.distance.y = evt.stageY - this.y;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
    };
    p.mouseMove = function (evt) {
        if (this.touchStatus) {
            this.y = evt.stageY - this.distance.y;
        }
    };
    p.mouseUp = function (evt) {
        console.log("Mouse Up.");
        if (this.y < -568 && this.currentY == 0) {
            egret.Tween.get(this).to({ y: -1136 }, 600, egret.Ease.backOut);
            this.y = -1136;
        }
        if (this.y < -568 && this.currentY == -1136) {
            egret.Tween.get(this).to({ y: -1136 }, 600, egret.Ease.backOut);
            this.y = -1136;
        }
        if (this.y > -568 && this.currentY == -1136) {
            egret.Tween.get(this).to({ y: 0 }, 600, egret.Ease.backOut);
            this.y = 0;
        }
        if (this.y > -568 && this.currentY == 0) {
            egret.Tween.get(this).to({ y: 0 }, 600, egret.Ease.backOut);
            this.y = 0;
        }
        this.touchStatus = false;
        this.currentY = this.y;
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
//# sourceMappingURL=Main.js.map