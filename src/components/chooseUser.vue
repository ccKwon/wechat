<template>
    <div class="chooseUser">
        <h1>请选择你聊天的角色</h1>
        <div class="list">
            <div @click="chooseEvent(item)" v-for="(item, index) in userList" :key="index" class="item">
                <img :src="item.headerimg" alt="">
                <span>{{ item.username  }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import socket from '../socket';

    export default {
        // name:choose-user
        props: ['userList'],


        methods: {
            chooseEvent(user) {
                this.$root.me = user;
                localStorage.chatme = JSON.stringify(user);
                socket.emit('login', user)
            }
        }
    }
</script>


<style lang="scss" scoped>
    .chooseUser {
        // background-color: skyblue;
        height: 100vh;

        h1 {
            font-size: 20px;
            text-align: center;
            padding: 20px 0;
        }

        .list {
            display: flex;
            flex-wrap: wrap;

            .item {
                // flex: 1;
                width: 50%;
                flex-direction: column;
                display: flex;
                justify-content: center;
                align-items: center;
                // width: 100px;
                height: 130px;
                margin: 15px 0;

                img {
                    width: 100px;
                    border-radius: 50%;
                }
            }
        }
    }
</style>