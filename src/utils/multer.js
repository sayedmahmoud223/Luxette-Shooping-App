// import multer from "multer";
// export const fileValidation = () => {
//     return (req, file, cb) => {
//         if (
//             (file.fieldname === "mainImage" && (file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg"))||
//             (file.fieldname === "subImages" && (file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg"))||
//             (file.fieldname === "image" && (file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg"))
//         ) {
//             return cb(null, true);
//         } 
//         else {
//             return cb(new Error("In-Valid format", { cause: 400 }), false);
//         }
//     };
// };

// export function fileUpload(size) {
//     const storage = multer.diskStorage({});
//     const limits = { fileSize: size * 1000 * 1000 };
//     const fileFilter = fileValidation();
//     const upload = multer({ fileFilter, storage, limits });
//     return upload;
// }

 import multer from "multer";


 export const  fileValidation ={
    image:["image/png" , "image/jpg" , "image/jpeg", "image/png" ],
    file:["application/pdf","application/msword"]
} 

// function fileFilter (customValidation= fileValidation.image){
//     return (req,file, cb)=>{
//         if(customValidation.includes(file.mimetype))
//         {
//             cb(null , true)
//         }else
//         {
//             cb("invalid format ",false)
//         }

//     }
// }



export function fileUpload(customValidation = fileValidation.image ) { //size,
    const storage = multer.diskStorage({});
    // const limits = { fileSize: size * 1000 * 1000 };
    function fileFilter (req,file, cb){
        if(customValidation.includes(file.mimetype))
        {
            cb(null , true)
        }else
        {
            cb("invalid format ",false)
        }
    }
    const upload = multer({ fileFilter, storage });   // limits
    return upload;
}

