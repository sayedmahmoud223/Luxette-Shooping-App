import * as dotenv from 'dotenv'
dotenv.config()
import cloudinary from 'cloudinary';


cloudinary.v2.config({
    api_key: 541768647743142,
    api_secret: "9DejlIS-uQb2-eUkt-NBNYwOWU4",
    cloud_name: "dkgb7sf8k",
    secure: true
})

export default cloudinary.v2;