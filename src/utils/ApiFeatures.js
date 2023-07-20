
export class ApiFeature {

    constructor(mongooseQuery,queryData){
        this.mongooseQuery = mongooseQuery
        this.queryData = queryData
    }
    paginate(){
        let {page , size}=this.queryData;
        if(!page || page <= 0)
        {
            page = 1
        }
        if(!size || size <= 0)
        {
            size = 10
        }
        const skip = (page-1)*size
    
   
        this.mongooseQuery.limit(size).skip(skip)
        return this
    }
    filter(){
        
    let filterQuery={...this.queryData}
    
    let  dataInUrlNotNeeded= ['page','size','sort','search','fields','limit']
    dataInUrlNotNeeded.forEach((key)=>{
        if(filterQuery[key])
        {
             delete filterQuery[key]
        }
    })
    filterQuery = JSON.parse( JSON.stringify(filterQuery).replace(/(gt|gte|lte|lt|eq|in|nin)/g , match=>`$${match}` ))
   this.mongooseQuery.find(filterQuery)
   return this

    
    }
    search(){
          if(this.queryData.search )
                {
                this.mongooseQuery.find({
                        $or:[
                            {
                                ProductName:{$regex:this.queryData.search , $options:"i"}
                            },
                            {
                                description:{$regex:this.queryData.search , $options:"i"}
                            },
                            {
                                productType:{$regex:this.queryData.search , $options:"i"}
                            },
                            {
                                size:{$regex:this.queryData.search , $options:"i"}
                            },
                            {
                                productSeasonType:{$regex:this.queryData.search , $options:"i"}
                            }
                        ]
                    })
                }
             return this  
    }
    sort()
    {
         if(this.queryData.sort )
            {
            this.mongooseQuery.sort(this.queryData.sort.replaceAll("," ," "))
            }
        return this
    }
    select()
    {
         if(this.query.fields)
            {
               this.mongooseQuery.select(this.query.fields.replaceAll("," ," "))
            }
            return this
    }
}