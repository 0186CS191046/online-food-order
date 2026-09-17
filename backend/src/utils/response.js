const successResponse = (statusCode, message, data= {})=>{
    return {
        success : true,
        statusCode,
        message,
        ...data,
    }
}

const errorResponse = (statusCode, message)=>{
    return {
        success : false,
        statusCode,
        message
    }
}

export { successResponse , errorResponse };