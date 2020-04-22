<template>
    <section class="taskCenterBox">
        <div class="top jcc fx" :class="{'topAct':isShowTopAct}" :style="'padding-top:'+top+'px;'">
            <img :src="back" @click="goBack" class="back" mode="aspectFit" />
            <div class="fx1 txt">任务中心</div>
        </div>
        <!--头部 start-->
        <div class="header">
            <div class="bigTitle">
                <div class="jb"></div>
                <div class="title"></div>
                <div class="ruleBox" @click="toTaskRulePage">
                    <i></i>规则
                </div>
            </div>
            <div class="tipInfo">
                <swiper
                    class="swiper_container"
                    vertical="true"
                    autoplay="true"
                    circular="true"
                    interval="2000"
                >
                    <swiper-item v-for="(item,index) in scrollInfo" :key="index">
                        <i style="margin-right:10rpx"></i>
                        <span>上周{{item.name}}获得周任务榜奖励{{item.num}}算珠</span>
                        <i style="margin-left:10rpx"></i>
                    </swiper-item>
                </swiper>
            </div>
            <div class="taskPxb" @click="toCwShareSortPage">
                <div class="tIcon"></div>
                <div class="hIcon">
                    <img :src="userPxList.photo" />
                </div>
                <div class="tipBox">
                    <div class="t">{{userPxList.name}}</div>
                    <div class="cont">
                        本周完成任务累计赚取
                        <span>{{userPxList.num}}</span>算珠
                    </div>
                </div>
                <div class="toMore"></div>
            </div>
            <div class="cjBox">
                <div class="tit">
                    <span class="line"></span>
                    <span class="txt">我的成就</span>
                    <span class="line"></span>
                </div>
                <div class="cjVal">
                    <div class="item">
                        <div class="mum">{{myCjData.complete}}/{{myCjData.total}}</div>
                        <div class="infoText">今日完成</div>
                    </div>
                    <div class="item">
                        <div class="mum">{{myCjData.weeks}}</div>
                        <div class="infoText">周算珠值</div>
                    </div>
                    <div class="item">
                        <div class="mum">{{myCjData.score}}</div>
                        <div class="infoText">总算珠值</div>
                    </div>
                </div>
                <navigator hover-class="none" url="../integralMall/main">
                    <div class="thlp">兑换礼品</div>
                </navigator>
            </div>
        </div>
        <!--end 头部-->

        <!--每日签到 start-->
        <div class="signBox">
            <div class="signTit">
                <div class="titTxt">每日签到</div>
                <div class="titTip">
                    已连续签到
                    <span style="color:#FF8A3B">{{days}}</span>天
                    <span v-if="isSigned===0" class="signBtn" @click="signIn">签到</span>
                    <span v-if="isSigned===1" class="noSignBtn">已签到</span>
                </div>
            </div>
            <div class="signStep">
                <ul>
                    <li class="firstNoAct" :class="{'firstAct':days>=1}">+{{signRule[0]}}</li>
                    <!--firstAct-->
                    <li class="orderStep textPad" :class="{'orderActStep':days>=2}">+{{signRule[1]}}</li>
                    <!--orderActStep-->
                    <li class="orderStep" :class="{'orderActStep':days>=3,'threeDay':days>=3}">
                        <div class="lp"></div>
                    </li>
                    <li class="orderStep textPad" :class="{'orderActStep':days>=4}">+{{signRule[3]}}</li>
                    <li class="orderStep textPad" :class="{'orderActStep':days>=5}">+{{signRule[4]}}</li>
                    <li class="orderStep textPad" :class="{'orderActStep':days>=6}">+{{signRule[5]}}</li>
                    <li class="orderStep" :class="{'orderActStep':days===7}">
                        <div class="lp"></div>
                    </li>
                </ul>
            </div>
            <div class="signDays">
                <div class="dayList">第1天</div>
                <div class="dayList">第2天</div>
                <div class="dayList">第3天</div>
                <div class="dayList">第4天</div>
                <div class="dayList">第5天</div>
                <div class="dayList">第6天</div>
                <div class="dayList">第7天</div>
            </div>
        </div>
        <!--end 每日签到-->

        <!--顾问角色--新手任务，每日任务 start-->
        <div class="daysTaskBox" v-if="isAdviser">
            <template v-if="newList.length>0">
                <div class="dtTitle">新手任务</div>
                <div class="dtCont">
                    <div class="itemList" v-for="(item,index) in newList" :key="index">
                        <div class="icon"></div>
                        <div class="conInfo">
                            <div class="mainTit">
                                {{item.name}}
                                <span>+{{item.point}}算珠</span>
                            </div>
                            <div class="subTit">{{item.dec}}</div>
                        </div>

                        <!--<button
                            class="btn"
                            @click="localHref(item.action)"
                            v-if="item.finished_status==0&&item.action!='share'"
                        >{{item.unfinished_field}}</button>
                        <button
                            class="btn"
                            open-type="share"
                            v-if="item.finished_status==0&&item.action=='share'"
                            @click="share()"
                        >{{item.unfinished_field}}</button>
                        <button class="btn wcBtn" v-else-if="item.finished_status==1">已完成</button>-->

                        <div v-if="item.unfinished_field==='立即提问'">
                            <navigator hover-class="none" url="../tiwenNew/main">
                                <div class="btn" v-if="item.finished_status==0">立即提问</div>
                            </navigator>
                            <div
                                class="btn wcBtn"
                                v-if="item.finished_status==1 && item.max_time!=0"
                            >完成</div>
                        </div>

                        <div v-if="item.unfinished_field==='立即答题'">
                            <navigator hover-class="none" url="../meAnswer/main">
                                <div class="btn" v-if="item.finished_status==0">立即答题</div>
                            </navigator>
                            <div
                                class="btn wcBtn"
                                v-if="item.finished_status==1 && item.max_time!=0"
                            >完成</div>
                        </div>

                        <div v-if="item.unfinished_field==='去添加'">
                            <div class="btn" v-if="item.finished_status==0" @click="showTip">去添加</div>
                            <div
                                class="btn wcBtn"
                                v-if="item.finished_status==1 && item.max_time!=0"
                            >完成</div>
                        </div>

                        <div v-if="item.unfinished_field==='绑定'">
                            <div class="btn" v-if="item.finished_status==0" @click="openKfBox">绑定</div>
                            <div
                                class="btn wcBtn"
                                v-if="item.finished_status==1 && item.max_time!=0"
                            >完成</div>
                        </div>

                        <div v-if="item.unfinished_field==='去登陆'">
                            <div class="btn" v-if="item.finished_status==0">去登陆</div>
                            <div
                                class="btn wcBtn"
                                v-if="item.finished_status==1 && item.max_time!=0"
                            >完成</div>
                        </div>

                        <div
                            class="btn wcBtn"
                            v-if="item.unfinished_field===null && item.finished_status==1"
                        >完成</div>
                    </div>
                </div>
            </template>

            <template v-if="dailyList.length>0">
                <div class="dtTitle dayTit">每日任务</div>
                <div class="dtDayCont">
                    <div class="itemList" v-for="(daily,index) in dailyList" :key="index">
                        <div class="icon"></div>
                        <div class="conInfo">
                            <div class="mainTit">
                                {{daily.name}}
                                <span>+{{daily.point}}算珠/次</span>
                            </div>
                            <div class="subTit" v-if="daily.max_time==0">不限次数</div>
                            <div class="subTit" v-else>{{daily.finished_time}}/{{daily.max_time}}</div>
                        </div>

                        <!--<button
                            class="btn"
                            @click="localHref(daily.action)"
                            v-if="daily.finished_status==0&&daily.action!='share'"
                        >{{daily.unfinished_field}}</button>
                        <button
                            class="btn"
                            open-type="share"
                            v-if="daily.finished_status==0&&daily.action=='share'"
                            @click="share()"
                        >{{daily.unfinished_field}}</button>
                        <button class="btn wcBtn" v-else-if="daily.finished_status==1 && daily.max_time==1">已完成</button>
                        <button class="btn" v-else-if="daily.finished_status==1 && daily.max_time==0">待完成</button>-->

                        <!--<button open-type="share" class="btn" v-if="daily.unfinished_field==='去分享'">立即分享</button>
                        <div class="btn" v-if="daily.unfinished_field==='去浏览'">立即浏览</div>
                        <div class="btn" v-if="daily.unfinished_field==='去咨询'">立即咨询</div>
                        <div class="btn" v-if="daily.unfinished_field==='去答题'">立即回答</div>
                        <div class="btn" v-if="daily.unfinished_field==='去旁听'">立即旁听</div>
                        <div class="btn" v-if="daily.unfinished_field==='关注'">立即关注</div>
                        <div class="btn" v-if="daily.finished_status==1 && daily.max_time==0">待完成</div>
                        <div class="btn" v-if="daily.finished_status==1 && daily.max_time==1">已完成</div>-->

                        <div v-if="daily.unfinished_field==='去分享'">
                            <button
                                open-type="share"
                                class="btn"
                                v-if="daily.finished_status==0"
                                @click="share"
                            >立即分享</button>
                            <div
                                class="btn wcBtn"
                                v-if="daily.finished_status==1 && daily.max_time!=0"
                            >完成</div>
                        </div>

                        <div v-if="daily.unfinished_field==='去浏览'">
                            <navigator hover-class="none" open-type="switchTab" url="../index/main">
                                <div class="btn" v-if="daily.finished_status==0">立即浏览</div>
                            </navigator>
                            <div
                                class="btn wcBtn"
                                v-if="daily.finished_status==1 && daily.max_time!=0"
                            >完成</div>
                        </div>

                        <!--<div v-if="daily.unfinished_field==='去咨询'">
                            <navigator hover-class="none" url="../tiwen/main">
                                <div class="btn" v-if="daily.finished_status==0">立即咨询</div>
                            </navigator>
                            <div
                                class="btn wcBtn"
                                v-if="daily.finished_status==1 && daily.max_time!=0"
                            >完成</div>
                        </div>-->

                        <div v-if="daily.unfinished_field==='去咨询'">
                            <div class="btn" v-if="daily.finished_status==0" @click="toGwList">立即咨询</div>
                            <div
                                class="btn wcBtn"
                                v-if="daily.finished_status==1 && daily.max_time!=0"
                            >完成</div>
                            <div
                                class="btn"
                                v-if="daily.finished_status==1 && daily.max_time==0"
                                @click="toGwList"
                            >待完成</div>
                        </div>

                        <div v-if="daily.unfinished_field==='去答题'">
                            <navigator hover-class="none" url="../meAnswer/main">
                                <div class="btn" v-if="daily.finished_status==0">立即回答</div>
                            </navigator>
                            <div
                                class="btn wcBtn"
                                v-if="daily.finished_status==1 && daily.max_time!=0"
                            >完成</div>
                        </div>

                        <div v-if="daily.unfinished_field==='去旁听'">
                            <navigator
                                hover-class="none"
                                open-type="switchTab"
                                url="../ptList_new/main"
                            >
                                <div class="btn" v-if="daily.finished_status==0">立即旁听</div>
                            </navigator>
                            <div
                                class="btn wcBtn"
                                v-if="daily.finished_status==1 && daily.max_time!=0"
                            >完成</div>
                            <navigator
                                hover-class="none"
                                open-type="switchTab"
                                url="../ptList_new/main"
                            >
                                <div
                                    class="btn"
                                    v-if="daily.finished_status==1 && daily.max_time==0"
                                >立即旁听</div>
                            </navigator>
                        </div>

                        <div v-if="daily.unfinished_field==='关注'">
                            <div class="btn" v-if="daily.finished_status==0" @click="toGwList">立即关注</div>
                            <div
                                class="btn wcBtn"
                                v-if="daily.finished_status==1 && daily.max_time!=0"
                            >完成</div>
                        </div>

                        <div
                            class="btn wcBtn"
                            v-if="daily.unfinished_field===null && daily.finished_status==1 && daily.max_time!=0"
                        >完成</div>
                        <div v-if="daily.unfinished_field!=='去旁听'">
                            <div
                                class="btn"
                                v-if="daily.finished_status==1 && daily.max_time==0"
                            >待完成</div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <!--end 新手任务，每日任务-->

        <!--用户角色--新手任务，每日任务 start-->
        <div class="daysTaskBox" v-else>
            <template v-if="newList.length>0">
                <div class="dtTitle">新手任务</div>
                <div class="dtCont">
                    <div class="itemList" v-for="(item,index) in newList" :key="index">
                        <div class="icon"></div>
                        <div class="conInfo">
                            <div class="mainTit">
                                {{item.name}}
                                <span>+{{item.point}}算珠</span>
                            </div>
                            <div class="subTit">{{item.dec}}</div>
                        </div>
                        <!--<button
                            class="btn"
                            @click="localHref(item.action)"
                            v-if="item.finished_status==0&&item.action!='share'"
                        >{{item.unfinished_field}}</button>
                        <button
                            class="btn"
                            open-type="share"
                            v-if="item.finished_status==0&&item.action=='share'"
                            @click="share()"
                        >{{item.unfinished_field}}</button>
                        <button class="btn wcBtn" v-else-if="item.finished_status==1">已完成</button>-->

                        <div v-if="item.unfinished_field==='立即提问'">
                            <navigator hover-class="none" url="../tiwenNew/main">
                                <div class="btn" v-if="item.finished_status==0">立即提问</div>
                            </navigator>
                            <div
                                class="btn wcBtn"
                                v-if="item.finished_status==1 && item.max_time!=0"
                            >完成</div>
                        </div>

                        <div v-if="item.unfinished_field==='立即答题'">
                            <navigator hover-class="none" url="../meAnswer/main">
                                <div class="btn" v-if="item.finished_status==0">立即答题</div>
                            </navigator>
                            <div
                                class="btn wcBtn"
                                v-if="item.finished_status==1 && item.max_time!=0"
                            >完成</div>
                        </div>

                        <div v-if="item.unfinished_field==='去添加'">
                            <div class="btn" v-if="item.finished_status==0" @click="showTip">去添加</div>
                            <div
                                class="btn wcBtn"
                                v-if="item.finished_status==1 && item.max_time!=0"
                            >完成</div>
                        </div>

                        <div v-if="item.unfinished_field==='绑定'">
                            <div class="btn" v-if="item.finished_status==0" @click="openKfBox">绑定</div>
                            <div
                                class="btn wcBtn"
                                v-if="item.finished_status==1 && item.max_time!=0"
                            >完成</div>
                        </div>

                        <div v-if="item.unfinished_field==='去登陆'">
                            <div class="btn" v-if="item.finished_status==0">去登陆</div>
                            <div
                                class="btn wcBtn"
                                v-if="item.finished_status==1 && item.max_time!=0"
                            >完成</div>
                        </div>

                        <div
                            class="btn wcBtn"
                            v-if="item.unfinished_field===null && item.finished_status==1"
                        >完成</div>
                    </div>
                </div>
            </template>

            <template v-if="dailyList.length>0">
                <div class="dtTitle dayTit">每日任务</div>
                <div class="dtDayCont">
                    <div class="itemList" v-for="(daily,index) in dailyList" :key="index">
                        <div class="icon"></div>
                        <div class="conInfo">
                            <div class="mainTit">
                                {{daily.name}}
                                <span>+{{daily.point}}算珠/次</span>
                            </div>
                            <div class="subTit" v-if="daily.max_time==0">不限次数</div>
                            <div class="subTit" v-else>{{daily.finished_time}}/{{daily.max_time}}</div>
                        </div>
                        <!--<button
                            class="btn"
                            @click="localHref(daily.action)"
                            v-if="daily.finished_status==0&&daily.action!='share'"
                        >{{daily.unfinished_field}}</button>
                        <button
                            class="btn"
                            open-type="share"
                            v-if="daily.finished_status==0&&daily.action=='share'"
                            @click="share()"
                        >{{daily.unfinished_field}}</button>
                        <button class="btn wcBtn" v-else-if="daily.finished_status==1 && daily.max_time==1">已完成</button>
                        <button class="btn" v-else-if="daily.finished_status==1 && daily.max_time==0">待完成</button>-->

                        <div v-if="daily.unfinished_field==='去分享'">
                            <button
                                open-type="share"
                                class="btn"
                                v-if="daily.finished_status==0"
                                @click="share"
                            >立即分享</button>
                            <div
                                class="btn wcBtn"
                                v-if="daily.finished_status==1 && daily.max_time!=0"
                            >完成</div>
                        </div>

                        <div v-if="daily.unfinished_field==='去提问'">
                            <navigator hover-class="none" url="../tiwenNew/main">
                                <div class="btn" v-if="daily.finished_status==0">立即提问</div>
                            </navigator>
                            <div
                                class="btn wcBtn"
                                v-if="daily.finished_status==1 && daily.max_time!=0"
                            >完成</div>
                        </div>

                        <div v-if="daily.unfinished_field==='去浏览'">
                            <navigator hover-class="none" open-type="switchTab" url="../index/main">
                                <div class="btn" v-if="daily.finished_status==0">立即浏览</div>
                            </navigator>
                            <div
                                class="btn wcBtn"
                                v-if="daily.finished_status==1 && daily.max_time!=0"
                            >完成</div>
                        </div>

                        <div v-if="daily.unfinished_field==='去咨询'">
                            <div class="btn" v-if="daily.finished_status==0" @click="toGwList">立即咨询</div>
                            <div
                                class="btn wcBtn"
                                v-if="daily.finished_status==1 && daily.max_time!=0"
                            >完成</div>
                            <div
                                class="btn"
                                v-if="daily.finished_status==1 && daily.max_time==0"
                                @click="toGwList"
                            >待完成</div>
                        </div>

                        <div v-if="daily.unfinished_field==='去答题'">
                            <navigator hover-class="none" url="../meAnswer/main">
                                <div class="btn" v-if="daily.finished_status==0">立即回答</div>
                            </navigator>
                            <div
                                class="btn wcBtn"
                                v-if="daily.finished_status==1 && daily.max_time!=0"
                            >完成</div>
                        </div>

                        <div v-if="daily.unfinished_field==='去旁听'">
                            <navigator
                                hover-class="none"
                                open-type="switchTab"
                                url="../ptList_new/main"
                            >
                                <div class="btn" v-if="daily.finished_status==0">立即旁听</div>
                            </navigator>
                            <div
                                class="btn wcBtn"
                                v-if="daily.finished_status==1 && daily.max_time!=0"
                            >完成</div>
                            <navigator
                                hover-class="none"
                                open-type="switchTab"
                                url="../ptList_new/main"
                            >
                                <div
                                    class="btn"
                                    v-if="daily.finished_status==1 && daily.max_time==0"
                                >待完成</div>
                            </navigator>
                        </div>

                        <div v-if="daily.unfinished_field==='评价'">
                            <navigator hover-class="none" url="../problemManagement/main?key=1">
                                <div class="btn" v-if="daily.finished_status==0">立即评价</div>
                            </navigator>
                            <div
                                class="btn wcBtn"
                                v-if="daily.finished_status==1 && daily.max_time!=0"
                            >完成</div>
                            <navigator hover-class="none" url="../problemManagement/main?key=1">
                                <div
                                    class="btn"
                                    v-if="daily.finished_status==1 && daily.max_time==0"
                                >待完成</div>
                            </navigator>
                        </div>

                        <div v-if="daily.unfinished_field==='关注'">
                            <div class="btn" v-if="daily.finished_status==0" @click="toGwList">立即关注</div>
                            <div
                                class="btn wcBtn"
                                v-if="daily.finished_status==1 && daily.max_time!=0"
                            >完成</div>
                        </div>

                        <div v-if="daily.unfinished_field==='采纳'">
                            <navigator hover-class="none" url="../problemManagement/main?key=1">
                                <div class="btn" v-if="daily.finished_status==0">去采纳</div>
                            </navigator>
                            <div
                                class="btn wcBtn"
                                v-if="daily.finished_status==1 && daily.max_time!=0"
                            >完成</div>
                        </div>

                        <div
                            class="btn wcBtn"
                            v-if="daily.unfinished_field===null && daily.finished_status==1 && daily.max_time!=0"
                        >完成</div>
                        <!--<div class="btn" v-if="daily.finished_status==1 && daily.max_time==0">待完成</div>-->
                    </div>
                </div>
            </template>
        </div>
        <!--end 新手任务，每日任务-->

        <div class="bottomButtons fx jcc">
            <!--<button class="button" @click="go('awardRules')">查看详细规则</button>
            <div class="line"></div>-->
            <button class="button" @click="go('countingBeads')">算珠明细</button>
        </div>

        <div class="showAddMyXcx" v-show="isShowAddTip">
            <div class="cont">
                <img
                    src="https://static.cgkc.com/miniprogram/addMyMinproNew.png?99"
                    mode="widthFix"
                    style="width:72%;"
                    alt
                />
            </div>
            <div class="closeBtn" @click="closeTip">我知道了</div>
        </div>

        <!--签到弹窗 start-->
        <div class="signPopUp" data-id="sign" @click="closeSign($event)" v-if="isShowSignPopUp">
            <div class="popCont">
                <div class="total">{{signedRow}}算珠</div>
                <div class="tip">恭喜获得算珠奖励</div>
                <div class="desc">—— 每日签到奖励 ——</div>
            </div>
        </div>
        <!--end 签到弹窗-->

        <van-popup
            class="popup"
            :show="isShowKeFuPopup"
            position="center"
            custom-style="background:none"
            lock-scroll:true
        >
            <div class="kfBg">
                <div class="kfCont">
                    <img src="https://static.cgkc.com/miniprogram/addKfBg.gif" />
                    <button
                        class="addBtn"
                        show-message-card="true"
                        send-message-title="加群：会计交流群"
                        send-message-path="/pages/addGroup/main"
                        send-message-img="https://static.cgkc.com/miniprogram/kfaddImg.png"
                        @click="closeKfBox"
                    >点击加群</button>
                </div>
            </div>
            <div class="closeBtn">
                <van-icon name="close" size="30px" color="#fff" @click="closeKfBox"></van-icon>
            </div>
        </van-popup>
    </section>
</template>

<script>
import $ from '@/common'
const taskArr = [{
    name: '完成注册',
    action: 'finish_reg',
    url: '#'
},
{
    name: '首次快速提问',
    action: 'first_free_question',
    url: '../tiwenNew/main'
},
{
    name: '首次答题',
    action: 'first_answer',
    url: '../meAnswer/main'
},
{
    name: '推荐好友使用',
    action: 'recommend_friends',
    url: '#'
},
{
    name: '分享好内容',
    action: 'share',
    url: '1'
},
{
    name: '浏览内容',
    action: 'browse_content',
    url: '../index/main'
},
{
    name: '每日答题',
    action: 'daily_answer',
    url: '../questionsList/main'
},
{
    name: '图文咨询',
    action: 'ask_common',
    url: '../xzgwList/main'
},
{
    name: '在线咨询',
    action: 'ask_online',
    url: '../xzgwList/main'
},
{
    name: '每日快速提问',
    action: 'free_ask',
    url: '../tiwenNew/main'
},
{
    name: '评论任意一条问答',
    action: 'commentQuestion',
    url: '../index/main'
},
{
    name: '旁听',
    action: 'answer_listen',
    url: '../ptList_new/main'
},
]
export default {
    name: 'taskCenter',
    data() {
        return {
            isShowTopAct: false,
            isShowUsertask: false,//是否显示用户角色做任务模块
            isShowAdvisertask: false,//是否显示顾问角色做任务模块

            dailyList: [],//每日任务
            newList: [],//新手任务
            isAdviser: false,//是否是顾问
            userPxList: {},//用户排行信息
            myCjData: {},//我的成就数据
            scrollInfo: [],//上面滚动的信息

            isShow: false,//是否显示签到弹窗
            isSign: false,//是否已经签到
            days: 0,//签到的天数
            taskArr,
            isShowAddTip: false,
            isShowSignPopUp: false,//是否显示签到弹窗
            isSigned: 0,//是否签名
            signedRow: 0,//签到成功后返回的算珠
            signRule: [],//签到加分规则

            isShowKeFuPopup: false

        }
    },
    computed: {
        top() {
            let system = wx.getSystemInfoSync()
            let val = system.statusBarHeight + 10
            return val
        },
        winHeight() {
            return $.winHeight
        },
        back() {
            return $.$img("vip/back.png")
        },
    },

    onLoad(o) {
        this.getDailyList()
        this.getUserPxData()
        this.getprevPxData()
        this.getUserInfo()
        this.getScoreData()

        //返回时定义一个全局变量用于中秋活动那里自动刷新
        $.isFinishTask = true
    },

    onShow() {
        //检测到是否返回带过来参数没有
        if ($.isReturn || $.flollowGwRefresh) {
            console.log('我刷新了')
            this.getDailyList()
            this.getUserPxData()
            this.getprevPxData()
            this.getUserInfo()
            this.getScoreData()
            $.isReturn = false
        }
    },

    onHide() {

    },

    onUnload() {

    },

    methods: {

        share() {
            let t = this
            $.post($.url('share'), function (res) {
                if (res.success) {
                    t.getDailyList()
                    t.getUserPxData()
                    t.getprevPxData()
                    t.getUserInfo()
                    t.getScoreData()
                } else {
                    $.log(res.msg)
                }
            })
            // for (var p in t.taskDailyItems) {
            //     if (t.taskDailyItems[p].action == 'share') {
            //         if (t.taskDailyItems[p].finished_time < t.taskDailyItems[p].max_time) {
            //             t.score += t.taskDailyItems[p].point
            //             t.taskDailyItems[p].finished_time += 1
            //         }
            //     }
            // }
        },
        toGwList() {
            wx.switchTab({
                url: '../guwen/main'
            })
        },
        go(str) {
            let arr = str.split('?')
            let url = $.pageUrl(arr[0])
            if (arr[1]) {
                url = url + '?' + arr[1]
            }
            $.go(url)
        },

        openKfBox() {
            this.isShowKeFuPopup = true
        },

        closeKfBox() {
            let t = this;
            $.post($.url('getBinding'), function (res) {
                if (!res.success) {
                    $.tip(res.msg)
                } else {
                    t.getDailyList()
                    t.isShowKeFuPopup = false
                }
            })
        },


        //跳转到关注页面
        toPtList() {
            wx.switchTab({
                url: '../ptList_new/main'
            })
        },

        getUserInfo() {
            let t = this;
            $.post($.url('userCenterData'), function (res) {
                if (!res.success) {
                    $.tip(res.msg)
                } else {

                    t.isSigned = res.data.is_sign

                }
            })
        },

        //关闭签到弹窗
        closeSign(e) {
            console.log(e)
            if (e.currentTarget.dataset.id) {
                this.isShowSignPopUp = false
            }
        },

        goBack() {
            $.back()
        },

        showTip() {
            this.isShowAddTip = true
        },

        closeTip() {
            let t = this;
            $.post($.url('addParam'), function (res) {
                if (!res.success) {
                    $.tip(res.msg)
                } else {
                    t.getDailyList()
                    t.isShowAddTip = false
                }
            })
        },

        localHref($action) {
            //任务跳转
            let t = this;
            let url;
            for (var p in t.taskArr) {
                if (t.taskArr[p].action == $action) {
                    url = t.taskArr[p].url;
                }
            }
            $.go(url);
        },

        closePopup() {
            //关闭签到弹窗
            let t = this
            t.isShow = false
        },

        signIn() {
            //签到
            let t = this;
            $.post($.url('signIn'), function (res) {
                if (!res.success) {
                    $.tip(res.msg)
                } else {
                    t.isShowSignPopUp = true
                    t.signedRow = res.data
                    t.isSign = true
                    t.isShow = false
                    t.getScoreData()
                    t.getUserInfo()
                    t.getUserPxData()
                }
            })
        },

        getScoreData() {
            //获取签到详情
            let t = this;

            $.pp($.url('getScoreData'), function (res) {
                t.days = res.days
                t.signRule = res.rule
                // t.swiper = res.banner
                // console.log(t.swiper);
                //检测是否打开签到弹窗
                if (res.is_sign == 0) {
                    t.isShow = true
                } else {
                    t.isShow = false
                }
            })
        },

        //获取滚动信息的数据
        getprevPxData() {
            let that = this
            $.post($.url('getSoftware'), {

            }, function (res) {
                if (res.success) {
                    console.log(res)
                    that.scrollInfo = res.data

                } else {
                    $.tip(res.msg)
                }
            })
        },

        //获取用户排行和我的成就的数据
        getUserPxData() {
            let that = this
            $.post($.url('getPersonal'), {

            }, function (res) {
                if (res.success) {
                    console.log(res)
                    that.userPxList = res.data.info
                    that.myCjData = res.data.list

                } else {
                    $.tip(res.msg)
                }
            })
        },

        //获取新手任务和每日任务的数据
        getDailyList() {

            let that = this
            wx.showLoading({
                title: '加载中',
            })
            $.post($.url('getTaskList'), {

            }, function (res) {
                wx.hideLoading()
                if (res.success) {
                    console.log(res)
                    that.dailyList = res.data.daily_list.filter(ele => ele.action != 'share')
                    that.newList = res.data.new_list
                    that.isAdviser = res.data.is_adviser
                } else {
                    $.tip(res.msg)
                }
            })
        },



        //跳转到任务规则页面
        toTaskRulePage() {
            wx.navigateTo({
                url: '/pages/taskRule/main'
            })
        },

        //跳转到财问分享排行榜页面
        toCwShareSortPage() {
            wx.navigateTo({
                url: '/pages/taskShareSort/main'
            })
        }
    },

    onShareAppMessage(res) {
        let t = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '欢迎来到财税问诊',
            path: '/pages/index/main',
            imageUrl: 'https://static.cgkc.com/miniprogram/mini/qing/img/share.png'
        }
    },

    onPullDownRefresh: function () {
        this.getDailyList()
        this.getUserPxData()
        this.getprevPxData()
        this.getUserInfo()
        this.getScoreData()
        wx.stopPullDownRefresh()
    },

    onReachBottom: function () {

    },

    onPageScroll(e) {
        if (e.scrollTop >= 50) {
            this.isShowTopAct = true
        } else {
            this.isShowTopAct = false
        }
    }
}
</script>

<style lang="less" scoped>
@import "./main.less";
.swiper_container {
    height: 32rpx;
    line-height: 32rpx;
}

.swiper_item {
    font-size: 30rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
