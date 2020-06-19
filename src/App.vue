<template>
  <div id="app">
    <choose-user v-if="$root.me === null && !ischat" :userList='userList'></choose-user>
    <userlist v-if="!ischat && islogin" :users='users' :islogin='islogin' :chooseUser='chooseUser'
      :unreadList='unreadList' :logout='logout'>
    </userlist>
    <chat-user v-if="ischat" :touser='touser' :closeChat='closeChat' :newMsg=newMsg></chat-user>
  </div>
</template>

<script>
  import chooseUser from './components/chooseUser'
  import userlist from './components/userlist'
  import chatUser from './components/chatuser'
  import socket from './socket'

  export default {
    components: {
      // 选择登录用户组件
      chooseUser,
      // 用户列表组件
      userlist,
      // 单聊组件
      chatUser
    },

    data() {
      return {
        // 用户列表
        userList: [],
        me: [],
        // 标记是否登录
        islogin: false,
        users: [],
        // 标记聊天
        ischat: false,
        // 与谁聊天
        touser: null,
        // 未读消息
        unreadList: [],
        // 接受新消息
        newMsg: null
      }
    },

    computed: {
      usersObj: function () {
        let obj = {};
        this.users.forEach((item, index) => {
          obj[item.username] = item;
        })
        return obj;
      }
    },

    async beforeMount() {
      // 获取用户列表
      let res = await this.$axios.get('http://localhost:3000/api/userlist')
      this.userList = res.data;

    },

    mounted() {
      // 监听登录事件
      socket.on('login', (data) => {
        if (data.state == 'ok') {
          this.islogin = true;
          socket.emit('users');
        }

      })

      // 监听断开连接事件
      socket.on('logout', (data) => {
        this.islogin = false;
        socket.disconnect();
        // location.reload();
      })

      // 
      socket.on('users', (data) => {
        this.users = data;
      })


      // 监听未读信息
      socket.on('unReadMsg', (data) => {
        // console.log(data);
        // 设置未读消息
        data.forEach((item, index) => {
          // 设置未读红点
          // 保存到本地存储
          // 将 from/to 改成有头像的对象
          item.from = this.usersObj[item.from];
          item.to = this.usersObj[item.to];

          // 记录含有未读消息的用户
          this.unreadList.push(item.from.username);
          // console.log(this.unreadList.indexOf('小黑'));


          let strKey = 'chat-user-' + this.$root.me.username + '-' + item.from.username;

          // localStorage[strKey] = JSON.stringify(this.chatlist);
          let newArr = [];
          if (localStorage[strKey] == undefined) {
            console.log(111);
            newArr.push(item);

          } else {
            newArr = JSON.parse(localStorage[strKey]);
            newArr.push(item)
          }
          localStorage[strKey] = JSON.stringify(newArr);

        })


        // 接受数据
        socket.on('accept', (msg) => {
          // 如果正在聊天框内
          if (this.ischat == true && msg.from.username == this.touser.username) {
            this.newMsg = msg
          } else {
            // 如果用户不再聊天框内  直接存入本地  并 存入未读消息列表
            let strKey = 'chat-user-' + this.$root.me.username + '-' + msg.from.username;

            localStorage[strKey] = localStorage[strKey] ? localStorage[strKey] : '[]';
            let newArr = JSON.parse(localStorage[strKey]);
            newArr.push(msg);
            localStorage[strKey] = JSON.stringify(newArr);
            this.unreadList.push(msg.from.username)
          }
        })
      })

      // socket.on('disconnect', () => {
      //   console.log('断开连接');
      // })
    },


    methods: {
      // 选择聊天的用户
      chooseUser(user) {
        this.touser = user;
        this.ischat = true;

        // 将对应的用户的未读消息队列清空
        let index = this.unreadList.indexOf(user.username);
        this.unreadList.splice(index, 1)
      },

      // 关闭聊天框
      closeChat() {
        this.ischat = false;
      },

      // 退出
      logout() {
        // 取消登录状态
        this.islogin = false;
        // 刷新页面
        location.reload();
      }
    },



  }
</script>

<style lang="scss" scoped>

</style>