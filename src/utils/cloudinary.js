import * as dotenv from 'dotenv'
dotenv.config()
import cloudinary from 'cloudinary';


cloudinary.v2.config({
    api_key: 541768647743142,
    api_secret: "9DejlIS-uQb2-eUkt-NBNYwOWU4",
    cloud_name: "dkgb7sf8k",
    // secure: true
})

cloudinary.config({ 
    cloud_name: 'dqowsrf2o', 
    api_key: '214478725421537', 
    api_secret: 'nuqNaBbM7vF4uA-kyvPvwlybzJQ' 
  })

export default cloudinary.v2;