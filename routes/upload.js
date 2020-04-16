import { responseClient } from '../util/util';
import Tag from '../models/tag';
import Upload from '../models/uploadImg'

//获取全部标签
exports.getImageList = (req, res) => {
	let responseData = {
		count: 0,
		list: [],
	};
	Upload.countDocuments(conditions, (err, count) => {
		if (err) {
			console.error('Error:' + err);
		} else {
			responseData.count = count;
			let fields = { nimage:1 }; // 待返回的字段
			let options = {
			};
			Upload.find(conditions, fields, options, (error, result) => {
				if (err) {
					console.error('Error:' + error);
					// throw error;
				} else {
					responseData.list = result;
					responseClient(res, 200, 0, 'success', responseData);
				}
			});
		}
	});
};
exports.addImage = (req, res) => {
	let { name, desc,url } = req.body;
	Upload.findOne({
		image,
	})
		.then(result => {
			if (!result) {
				let upload = new Upload({
					name,
				});
				upload
					.save()
					.then(data => {
						responseClient(res, 200, 0, '添加成功', data);
					})
					.catch(err => {
						throw err;
					});
			} else {
				responseClient(res, 200, 1, '该标签已存在');
			}
		})
		.catch(err => {
			responseClient(res);
		});
};
