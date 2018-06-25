/**
 * Created by win7 on 2017/9/4.
 */
import Mock from 'mockjs'

export default {
	//退回至 xx人的列表
	'GET /flowChart/chart/getAllFactor': (req, res) => {
		let data = Mock.mock([
			{
        "factorCode": "T001",
        "maxValue": 50,
        "minValue": 20,
        "unit": "pa"
      },{
        "factorCode": "T002",
        "maxValue": 30,
        "minValue": 10,
        "unit": "C"
      }
		]);
		res.send({ret: data});
	},
}
