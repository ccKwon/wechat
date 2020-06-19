<template>
    <div class="chatuser">
        <div class="header">
            <span @click="closeChat" class="back">
                ＜
            </span>
            {{ touser.username }}
        </div>

        <div class="chatlist" ref="chatbox">
            <div class="chatItem" v-for="(item, index) in chatlist" :key="index"
                :class="{self:$root.me.username == item.from.username}">
                <div class="header">
                    <img :src="item.from.headerimg" alt="">
                </div>
                <div class="chatContent">
                    {{ item.content }}
                </div>
            </div>
        </div>

        <div class="inputcom">
            <input type="text" v-model="inputData" @keydown.enter='sendEvent'>
            <button @click="sendEvent">发送</button>
        </div>
    </div>
</template>

<script>
    import socket from '../socket.js'

    export default {
        props: ['touser', 'closeChat', 'newMsg'],

        data() {
            return {
                // 聊天记录列表
                chatlist: [],
                inputData: '',
            }
        },

        beforeMount() {
            this.getStorage();
            socket.emit('readMsg', {
                self: this.$root.me.username,
                username: this.touser.username
            })
        },


        mounted() {
            this.toBottom();
        },

        watch: {
            // 监听新值
            newMsg(val) {
                this.chatlist.push(val);
                this.saveStorage()
            }
        },

        updated() {
            this.toBottom();

        },

        methods: {
            sendEvent() {
                // 设置聊天记录数据结构
                let msg = {
                    from: this.$root.me,
                    to: this.touser,
                    content: this.inputData,
                    time: new Date().getTime()
                }
                // 清空输入框
                this.inputData = '';
                // 将聊天记录保存到聊天记录列表
                this.chatlist.push(msg)

                // 发送到服务端
                socket.emit('sendMsg', msg),

                    this.saveStorage()
            },



            // 保存聊天记录到本地
            saveStorage() {
                let strKey = 'chat-user-' + this.$root.me.username + '-' + this.touser.username;
                localStorage[strKey] = JSON.stringify(this.chatlist);

            },

            // 获取本地保存的聊天记录
            getStorage() {
                let strKey = 'chat-user-' + this.$root.me.username + '-' + this.touser.username;
                this.chatlist = JSON.parse(localStorage[strKey]);
                // this.toBottom();
            },


            // 自动滚动到底部
            toBottom() {
                let chatBox = this.$refs.chatbox;
                chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .chatItem {
        display: flex;
        margin: 25px 10px;
        align-items: center;

        .header img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }

        .chatContent {
            background: #fff;
            border-radius: 5px;
            padding: 5px;
            color: black;
            margin: 0 0 0 15px;
            line-height: 34px;
            position: relative;
        }

        .chatContent::before {
            display: block;
            content: "";
            position: absolute;
            width: 0;
            height: 0;
            border-right: 10px solid #fff;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            top: 20px;
            left: -10px;
            // left: initial;
        }

        &.self {
            // justify-content: flex-end;
            flex-direction: row-reverse;
            justify-content: flex-start;
        }

        // &.self .chatContent {
        //     margin: 0 15px 0 0;
        // }

        &.self .chatContent::before {
            display: block;
            content: "";
            position: absolute;
            width: 0;
            height: 0;
            border-left: 10px solid #fff;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-right: 5px solid transparent;
            top: 20px;
            right: -15px;
            left: initial;
        }


        &.self .chatContent {
            background: #fff;
            border-radius: 5px;
            padding: 5px;
            color: black;
            margin: 0 15px 0 0;
            line-height: 34px;
            position: relative;
        }

    }




    .chatuser {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 0;
        left: 0;
        background: #efefef;

        .header {
            font-size: 18px;
            font-weight: 900;
            height: 40px;
            text-align: center;
            line-height: 40px;
            position: relative;

            .back {
                display: block;
                width: 60px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                position: absolute;
                left: 0;
                top: 0;
                cursor: pointer;

            }
        }

        .chatlist {
            flex: 7;
            overflow: scroll;
        }

        .inputcom {
            width: 100%;
            flex: 1;
            bottom: 100px;
            height: 50px;
            display: flex;
            background: #eee;
            justify-content: space-between;

            input {
                width: 270px;
                height: 80px;
                outline: none;
                flex: 6;
                border: 1px solid #ccc;
                // margin: 0 5px;
            }

            button {
                // width: 80px;
                flex: 1;
                height: 80px;
                border-radius: 5px;
                outline: none;
                border: 1px solid #ccc;
            }
        }
    }
</style>