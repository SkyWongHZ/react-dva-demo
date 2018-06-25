export default {
  // 用户类
  user: {
    name: [{    // 用户姓名
      pattern: /^([\u4e00-\u9fa5]|[a-z]){2,15}$/i,
      message: '汉字/英文，2-15个字符'
    }],
    age: [{
      pattern: /^\d{2,3}$/,
      message: '数字，2-3个字符'
    }],
    birthday: [{
      pattern: /^(1\d|20)\d{2}-(0[1-9]|1[012])$/,
      message: '日期选择，默认格式：1998-03'
    }],
    phone: [{
      patter: /^\d{11}|(((\d{3}-)?\d{8}|(\d{4}-)?\d{7,8})(-\d{1,4})?)$/,
      message: '请输入正确的固定电话或手机格式'
    }],
    sex: [{
      type: 'enum',
      enum: ['男','女'],
      message: '男、女'
    }],
    education: [{
      pattern: /^[\u4e00-\u9fa5]{2,10}$/,
      message: '汉字，2-10个字符'
    }],
    university: [{    // 毕业院校
      pattern: /^[\u4e00-\u9fa5]{2,10}$/,
      message: '汉字，2-10个字符'
    }],
    ID_card: [{    // 身份证号
      pattern: /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/,
      message: '数字/字母（最后1位允许字母，字母大小写没有限制），18个字符'
    }],
    profession: [{    // 专业
      pattern: /^([\u4e00-\u9fa5]|[a-z]){2,30}$/i,
      message: '汉字/英文，2-30个字符'
    }],
    part: [{    //  角色
      pattern: /^([\u4e00-\u9fa5]|[a-z]){2,15}$/i,
      message: '汉字/英文，2-15个字符'
    }],
    job: [{    // 职位
      pattern: /^([\u4e00-\u9fa5]|[a-z]){2,15}$/i,
      message: '汉字/英文，2-15个字符'
    }]
  },
  // 角色组
  role: {
    name: [{
      pattern: /^([\u4e00-\u9fa5]|[a-z]){2,15}$/i,
      message: '汉字/英文，2-15个字符'
    }],
  },
  // 站点类
  station: {
    name: [{    // 公司名称 站点名称 站点/测点/起止位置
      pattern: /^([\u4e00-\u9fa5]|[a-z]|[0-9]){0,30}$/i,
      message: '汉字/字母/数字，30个字符以内'
    }],
    coordinate: [{    // 经纬度
      pattern: /^(\d){1,3}(\.\d{0,6})?$/,
      message: '数字，小数点后六位'
    }],
    code: [{    // 因子编码
      pattern: /^[^\u4e00-\u9fa5]{0,30}$/i,
      message: '字母/数字/符号，30个字符以内'
    }],
  },
  // 因子类
  factor: {
    name: [{    // 因子名称
      pattern: /^([\u4e00-\u9fa5]|[a-z]|[0-9]){0,15}$/i,
      message: '汉字/字母/数字，15个字符以内'
    }],
    code: [{    // 因子编码
      pattern: /^[^\u4e00-\u9fa5]{0,15}$/i,
      message: '字母/数字/符号，15个字符以内'
    }],
    unit: [{    // 因子单位
      pattern: /^\D{0,10}$/i,
      message: '汉字/字母/符号，10个字符以内'
    }]
  },
  // 设备类
  device: {
    name: [{    // 设备名称
      max: 30,
      message: '30个字符以内'
    }],
    code: [{    // 设备编号
      pattern: /^[^\u4e00-\u9fa5]{0,15}$/i,
      message: '字母/数字/符号，15个字符以内'
    }],
    pattern: [{    // 设备型号
      max: 15,
      message: '15个字符以内'
    }],
    factory: [{    /// 设备厂家
      pattern: /^([\u4e00-\u9fa5]|[a-z]|[0-9]){0,30}$/i,
      message: '汉字/字母/数字，30个字符以内'
    }]
  },
  // 数据类
  data: {
    number: [{
      pattern: /^[0-9]+\.{0,1}[0-9]{0,2}$/,
      message: '输入数字'
    }]
  }
}
