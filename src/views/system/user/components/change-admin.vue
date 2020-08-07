<template>
  <div>
    <el-dialog title="变更管理员" :visible="visible" width="400px" @close="close">
      <el-form v-if="step===1" label-width="100px">
        <el-alert
          title="变更管理员，需要验证当前管理员账号的身份"
          type="info"
          style="margin-bottom: 15px;"
        />
        <el-form-item label="当前管理员:">
          <span>{{ $store.state.user.raw.realName }}</span>
        </el-form-item>
        <el-form-item label="手机号:">
          <span>{{ $store.state.user.raw.mobile }}</span>
          <el-button style="margin-left: 15px;" size="mini" type="primary" :loading="!!seconds" @click="getMsgCode">
            获取验证码 {{ seconds?`(${seconds})`:'' }}
          </el-button>
        </el-form-item>
        <el-form-item label="验证码:">
          <el-input v-model="formOld.msgCode">123</el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="step===1" type="primary" :disabled="!formOld.msgCode" @click="submitOld">下一步</el-button>
        </el-form-item>
      </el-form>
      <el-form v-else label-width="100px">
        <el-form-item label="新的管理员:">
          <SelectUser v-model="formNew.newUserId" :mobile.sync="newUserMobile" :disabled-keys="[$store.state.user.raw.id]" />
        </el-form-item>
        <el-form-item label="手机号">
          <span>{{ newUserMobile }}</span>
          <el-button style="margin-left: 15px;" size="mini" type="primary" :loading="!!seconds" @click="getMsgCode">
            获取验证码 {{ seconds?`(${seconds})`:'' }}
          </el-button>
        </el-form-item>
        <el-form-item label="验证码:">
          <el-input v-model="formNew.msgCode">123</el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="!formNew.msgCode" @click="submitNew">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import SelectUser from './select-user'
export default {
  name: 'ChangeAdmin',
  components: { SelectUser },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      seconds: 0,
      step: 1,
      formOld: {

      },
      formNew: {

      },
      newUserMobile: ''
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    submitOld() {
      // todo 提交验证码验证是否正确之后进入下一步
      this.step = 2
    },
    submitNew() {
      this.axios.system.post('/cim6d/system/user/changeCompanyAdmin/' + this.formNew.newUserId).then(res => {
        this.$message.success('设置成功，即将退出系统')
        setTimeout(() => {
          this.$store.dispatch('user/logout')
          location.reload()
        }, 1000)
      })
    },
    getMsgCode() {
      this.seconds = 60
      // todo 此方法获取的倒计时不太准确
      const clock = setInterval(() => {
        this.seconds -= 1
        if (this.seconds === 0) {
          clearInterval(clock)
        }
      }, 1000)
    },
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">

</style>
