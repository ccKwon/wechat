<template>
    <div class="userlist">
        <div class="nav">
            <div class="headerimg" :class="{online:islogin, }">
                <img v-if="$root.me != null" :src="$root.me.headerimg" alt="">
            </div>
            <div @click="logout()" class="info">
                退出
            </div>
        </div>

        <div class="users">
            <div @click="chooseUser(item)" class="useritem" v-for="(item, index) in frients" :key="index">
                <div class="left" :class="{online:item.isonline, unread:unreadList.indexOf(item.username) != -1}">
                    <img :src="item.headerimg" alt="">
                </div>

                <div class="right">
                    <span class="username">{{ item.username }}</span>
                    <span class="msg"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['islogin', 'users', 'chooseUser', 'unreadList', 'logout'],

        computed: {
            frients: function () {
                if (this.$root.me == null) {
                    return [];
                } else {
                    // 过滤用户自己 以免出现在用户列表中
                    // 获取根数据中的用户
                    let username = this.$root.me.username;
                    // 返回其他非 登录 用户
                    return this.users.filter((item, index) => {
                        return item.username != username;
                    })
                }

            }
        }

    }
</script>


<style lang="scss" scoped>
    .online {
        filter: grayscale(0) !important
    }

    .headerimg {
        filter: grayscale(1);
        margin: 0 10px;

        img {
            height: 50px;
            width: 50px;
            border-radius: 50%;
        }
    }


    .nav {
        height: 80px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: skyblue;

        .info {
            cursor: pointer;
            margin-right: 20px;
            font-size: 18px;
        }
    }

    .useritem {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        padding: 0 10px;
        margin-top: 10px;
        height: 80px;

        .unread {
            position: relative;
        }

        .unread::before {
            position: absolute;
            content: "";
            display: block;
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background: red !important;
            bottom: 5px;
        }

        .left {
            filter: grayscale(1);

            img {

                width: 60px;
                height: 60px;
                border-radius: 50%;
            }
        }

        .right {
            .username {
                padding: 10px;
            }
        }

        .online {
            filter: grayscale(0) !important
        }
    }
</style>