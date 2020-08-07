<template>
  <div class="main">
    <el-row>
      <el-col :span="12">
        <h4>
          {{ projectName }}
        </h4>
      </el-col>
      <el-col :span="12" style="text-align: right"> <el-button type="primary" @click="addPerson">+添加参与方</el-button></el-col>
    </el-row>
    <el-divider />
    <div>
      <el-form ref="form" :model="form" label-width="100px">
        <el-card v-for="(item,index) in form.personList" :key="index" class="box-card" @click.native="hanldeCardClick(item)">
          <div slot="header" class="clearfix">
            <span>{{ types }}</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="form.personList.splice(index,1)">删除</el-button>
          </div>
          <div class="text item">

            <!--            <el-form-item label="活动名称">-->
            <!--              <el-input v-model="form.name"></el-input>-->
            <!--            </el-form-item>-->
            <el-form-item
              :label="types+'：'"
              :prop="'personList.' + index + '.participateCompanyId'"
              :rules="[
                { required: true, message: '请选择公司', trigger: 'change' },
              ]"
            >
              <!--              <el-select v-model="item.participateCompanyName" placeholder="请选择监理" style="width: 50%">-->
              <!--                <el-option label="监理单位1" value="1243243543" />-->
              <!--                <el-option label="监理单位1" value="123243243" />-->
              <!--              </el-select>-->
              <companySelect
                v-model="item.participateCompanyId"
                :principal-name.sync="item.participateCompanyName"
                style="width: 400px"
              />
            </el-form-item>
            <el-form-item label="角色配置：" required>
              <div style="color: #4b9cff;cursor: pointer" @click="addRoleDialog(item)">+添加角色</div>
              <div class="roleList">
                <template v-if="item.roles.length">

                  <el-tag
                    v-for="(subItem,subIndex) in item.roles"
                    :key="subIndex"
                    type="info"
                    class="role"
                    closable
                    :disable-transitions="true"
                    @close="handleRoleDelete(item,subIndex)"
                  >

                    {{ item.roleNames&&item.roleNames[subIndex] }}
                  </el-tag>
                </template>
              </div>
            </el-form-item>

          </div>
        </el-card>
      </el-form>
    </div>
    <div class="btn-box-footer">
      <!--      <el-button @click="cancel">取消</el-button>-->
      <el-button type="primary" class="btn-box-footer-button" @click="submit">保存</el-button>
    </div>
    <UserSelectDialog v-if="addRoleVisible" :selcted-roles="selectedRole" :visible.sync="addRoleVisible" :value-group="valueGroup" @update="handleCloseDialog" @getTarget="getTarget" />
  </div>
</template>

<script>
import UserSelectDialog from '@/views/system/parties/components/UserSelectDialog'
import companySelect from '@/views/system/parties/components/companySelect'
import api from '@/views/system/api/parties'
export default {
  name: 'Add',
  components: {
    UserSelectDialog,
    companySelect
  },
  data() {
    return {
      projectId: this.$route.query.projectId,
      projectName: this.$route.query.projectName,
      activeId: '',
      id: '',
      selectedRole: [],
      addRoleVisible: false,
      roleVal: [],
      valueGroup: [],
      types: '',
      personList: [
        {
          id: '',
          type: this.$route.query.type,
          roles: [],
          roleNames: [],
          projectId: this.$route.query.projectId,
          participateCompanyId: '',
          participateCompanyName: ''
        }
      ],
      form: {
        name: '',
        region: '',
        personList: [
          {
            id: '',
            type: this.$route.query.type,
            roles: [],
            roleNames: [],
            projectId: this.$route.query.projectId,
            participateCompanyId: '',
            participateCompanyName: ''
          }
        ]
      },
      rules: {
        participateCompanyId: [
          { required: true, message: '请选择公司', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.types = this.$route.query.typeName
    this.id = this.$route.query.roleId
    if (this.id) {
      const params = {
        type: this.$route.query.type,
        projectId: this.projectId
      }
      api.getRoleInfo(params).then(res => {
        this.form.personList = res.data.map(res => {
          return {
            ...res, ...params
          }
        })
        console.log(this.personList)
      })
    }
  },

  methods: {
    hanldeCardClick(data) {
      console.log(data)
    },
    handleCloseDialog(data) {
      // console.log('关闭', data)
      const checkedVal = data.checkedVal || []
      const matchedItem = this.form.personList.find(item => item.id === this.activeId)
      // console.log(checkedVal)
      matchedItem.roles = checkedVal.map(item => item.value)
      matchedItem.roleNames = checkedVal.map(item => item.label)
      this.addRoleVisible = false
    },
    addRoleDialog(data) {
      this.activeId = data.id
      this.selectedRole = data.roles
      this.addRoleVisible = true
    },
    getTarget(e) {
      // console.log('change', e)
      const matchedItem = this.form.personList.find(item => item.id === this.activeId)
      // console.log('当前数据',matchedItem)
      const newRole = e.checkedVal.length ? e.checkedVal[e.checkedVal.length - 1] : {}
      if (matchedItem) {
        matchedItem.roles.push(newRole.value)
        matchedItem.roleNames.push(newRole.label)
      }
    },
    /* 删除角色*/
    handleRoleDelete(item, tag) {
      item.roles.splice(tag, 1)
      item.roleNames.splice(tag, 1)
    },
    // 添加参与方
    addPerson() {
      const type = this.$route.query.type
      this.form.personList.push({
        id: new Date().getTime(),
        projectId: this.projectId,
        type: type,
        // participateCompanyId: this.$route.query.participateCompanyId,
        participateCompanyId: '',
        participateCompanyName: '',
        roles: [],
        roleNames: []
      })
    },
    submit() {
      // console.log('J', this.personList)
      // this.personList.map(item => {
      //   console.log(item.participateCompanyId)
      //   if (item.participateCompanyId) {
      //     console.log(111)
      //   } else {
      //     this.$message.error('公司名字不能为空')
      //     return false
      //   }
      // })

      this.$refs.form.validate(async valid => {
        if (valid) {
          // this.id ? await api.getPartiesUpdate(this.form.personList) : await api.getPartiesAdd(this.form.personList)
          await api.getPartiesAdd(this.form.personList)
          this.$message.success('添加成功')
          this.$router.go(-1)
        } else {
          this.$message.error('请正确填写')
          return false
        }
      })
    }

  }
}
</script>

<style lang="less" scoped>

 .main{
   h4{
     font-size: 16px;
     font-weight: bolder;
   }
   .box-card{
     margin-bottom:15px;
   }
   /deep/ .el-card__header{
     background: #fafafa;
   }
   /deep/ .clearfix{
     font-size: 16px;
     .el-button{
       span{
         font-size: 14px;
       }
     }

   }
   .roleList{
     .role{
       margin-right: 5px;
     }

   }
 }
 .btn-box-footer {
   position: fixed;
   bottom: 0;
   height: 50px;
   background: #fff;
   -webkit-box-shadow: 0 10px 10px lightgrey;
   box-shadow: 0 10px 10px 10px lightgrey;
   width: 100%;
   right: 0;
   text-align: right;
   line-height: 50px;
   z-index: 1000;

   &-button {
     margin-right: 30px;
   }
 }

</style>
