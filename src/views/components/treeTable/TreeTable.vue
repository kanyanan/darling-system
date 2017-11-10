<template>
	<el-table :data="data" border style="width: 100%" :row-style="showTr">
		<el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text" :width="column.width">
			<template scope="scope">
				<span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
				<span v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)">
		          	<i v-if="!scope.row._expanded" class="el-icon-caret-right" aria-hidden="true"></i>
		          	<i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
		        </span>
				<span v-else-if="index===0" class="ms-tree-space"></span>
				
				<span class="txt-length">{{scope.row[column.dataIndex]}}</span>
			</template>
		</el-table-column>
		<el-table-column label="操作" v-if="treeType === 'normal'" width="170" scope="scope">
			<template scope="scope">
			    <el-tooltip v-show="scope.row.ParentCode == '' && hasActions.hasManufAdd" class="item" effect="dark" content="新增子级分类" placement="bottom">
			      	<el-button type="info" size="mini" icon="custom-add" class="m-r-10" @click="fnAddChildManuf(scope.row.Code)"></el-button>
			    </el-tooltip>
				<el-tooltip v-show="hasActions.hasManufUpdate" class="item" effect="dark" content="编辑当前工艺" placement="bottom">
			      	<el-button size="mini" icon="custom-edit" class="m-r-10" @click="fnUpdateManuf(scope.row.ID)"></el-button>
			    </el-tooltip>
			    <el-tooltip v-show="scope.row.ParentCode != ''" class="item" effect="dark" content="公司分类" placement="bottom">
			      	<el-button type="info" size="mini" icon="custom-classification" class="m-r-10" @click="fnDivideCompany(scope.row.Code)"></el-button>
			    </el-tooltip>
			    <el-tooltip v-show="hasActions.hasManufDel" class="item" effect="dark" content="删除当前工艺" placement="bottom">
			      	<el-button type="danger" size="mini" icon="custom-delete" class="m-r-10" @click.native="fnDelCompany(scope.row.ID)"></el-button>
			    </el-tooltip>
			</template>
		</el-table-column>
	</el-table>
</template>
<script>
  import Svc from '../../../service/index.js';
  import MSDataTransfer from './utils/index.js'
  export default {
  	data () {
  		return {
  			hasActions : {
  				hasManufAdd : false,
  				hasManufUpdate : false,
  				hasManufDel : false
  			}
      	}
    },
    props: {
		// 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
      	treeStructure: {
        	type: Boolean,
        	default: function () {
          		return false
        	}
      	},
	  	// 这是相应的字段展示
      	columns: {
        	type: Array,
    		default: function () {
          		return []
	        }
	  	},
		// 这是数据源
	    dataSource: {
	        type: Array,
	        default: function () {
	          return []
	        }
	    },
		// 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
      	requestUrl: {
        	type: String,
        	default: function () {
          		return ''
        	}
      	},
		// 这个是是否展示操作列
      	treeType: {
    		type: String,
        	default: function () {
          		return 'normal'
    		}
    	},
		// 是否默认展开所有树
	    defaultExpandAll: {
	        type: Boolean,
	        default: function () {
	          return false
	        }
	    }
	},
    computed: {
      // 格式化数据源
      data: function () {
        let me = this
        if (me.treeStructure) {
          let data = MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll)
          return data
        }
        return me.dataSource
      }
    },
    methods: {
      	// 显示行
      	showTr: function (row, index) {
        	let show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
        	row._show = show
        	return show ? '' : 'display:none;'
      	},
    	// 展开下级
      	toggle: function (trIndex) {
        	let me = this
        	let record = me.data[trIndex]
        	record._expanded = !record._expanded
      	},
    	// 显示层级关系的空格和图标
      	spaceIconShow (index) {
        	let me = this
        	if (me.treeStructure && index === 0) {
          		return true
        	}
        	return false
      	},
    	// 点击展开和关闭的时候，图标的切换
      	toggleIconShow (index, record) {
        	let me = this
        		if (me.treeStructure && index === 0 && record.Items && record.Items.length > 0) {
          			return true
        		}
        	return false
      	},
    	//显示message提示框
        openMessage : function(msg,type){
	        this.$message({
	          	showClose: true,
	          	message: msg,
	          	type: type
	        });
        },
      	//公司分类
      	fnDivideCompany : function(code){
      		this.$router.push({path: '/dividecompany', query: {code: code}})
      	},
      	//新增子级分类
      	fnAddChildManuf : function(code){
  			this.$router.push({path: '/manufdetail', query: {opttype: "newChild",pCode:code}})
      	},
      	//编辑工艺分类
      	fnUpdateManuf : function(id){
      		this.$router.push({path: '/manufdetail', query: {opttype: "update",currentID:id}})
      	},
      	//删除工艺分类
      	fnDelCompany  : function(id){
      		console.log('开始了~~')
	   		var that = this
			that.$confirm('确认要删除此项工艺吗?', '提示', {
				type: 'warning'
			}).then(function(){
				Svc.fnPostData('/api/manuf/delete',{"ID":id},function(res){
					if (res.body.ErrCode == 0) {
						that.openMessage("制造工艺删除成功！","success")
						setTimeout(function () {
		         			//刷新当前组件
            				that.$router.go(0)
			          	},1500);
					} else {
						that.openMessage(res.body.ErrMsg,"error")
					}
				})
			})
       	},
       	//获取当前用户所拥有的按钮操作权限
       	fnCheckAction : function(){
       		var that = this
       		//新增工艺操作
			Svc.fnPostData('/api/account/authcheck',{Action:'/api/manuf/add',Method:'POST'},function(res){
				that.hasActions.hasManufAdd = res.body.Data
			})
			//更新工艺操作
			Svc.fnPostData('/api/account/authcheck',{Action:'/api/manuf/update',Method:'POST'},function(res){
				that.hasActions.hasManufUpdate = res.body.Data
			})
			//删除工艺操作
			Svc.fnPostData('/api/account/authcheck',{Action:'/api/manuf/delete',Method:'POST'},function(res){
				that.hasActions.hasManufDel = res.body.Data
			})
       	}
   	},
	mounted() {
	   	//获取当前用户所拥有的按钮操作权限
		this.fnCheckAction()
	}
}
</script>
<style scoped>
  .ms-tree-space{
  	position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;
  }
  
  .ms-tree-space::before{
  	content: "";
  }
  
  table td{
    line-height: 24px;
  }
  
  .txt-length{
  	overflow:hidden;
  	text-overflow:ellipsis; 
  	-o-text-overflow:ellipsis;
  	white-space:nowrap;
  }
  
  .m-r-10{
  	margin-left: 0px !important;
  	margin-right: 10px !important;
  }
</style>
