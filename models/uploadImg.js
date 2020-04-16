// const topic = require('./models/topic')
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    image_id:{        //板块id
        // 多表关联类型
        type: Schema.Types.ObjectId,
        // 需要关联的表名称
      },
    
  image:{            //头像
    type:String,
    // default:'/public/img/image-max-img.png'
  }
})

module.exports = mongoose.model('Image',ImageSchema)