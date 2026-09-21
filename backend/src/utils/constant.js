const USERTYPE = {
    ADMIN : "Admin",
    USER : "User",
    RESTAURANT : "Restaurant"
}

const STATUS_CODE = {
    SUCCESS : 200,
    CREATED : 201,
    NOT_AVAILABLE : 204,
    BAD_REQUEST : 400,
    NOT_AUTHORIZED : 401,
    FORBIDDEN : 403,
    NOT_FOUND : 404,
    CONFLICT : 409,
    INTERNAL_SERVER_ERROR : 500
}

const staticMessages =  {
    NOT_FOUND : "Data not found!",
    INTERNAL_SERVER_ERROR : "Internal Server Error!",
    MISSING_REQUIRED_FIELDS : "Missing requied fields!",
    ROUTE_NOT_FOUND : "Route not exists!",
    INCORRECT_PASSWORD : "Incorrect Password!",
    LOGIN_SUCCESS : "Login successfully!",
    LOGOUT_SUCCESS : "Logout successfully!",
    FOUND : "Data fetched successfully!",
    FORBIDDEN : "You are not allowed to perform this action",
    TOKEN_MISSING : "Token is missing!",
    TOKEN_EXPIRED : "Token is expired!",
    TOKEN_VERIFICATION_FAILED : "Token verification failed!",
    ALREADY_EXISTS : "User already exists!",
    PASSWORD_NOT_MATCHED : "Password didn't matched",
    PASSWORD_CHANGED_SUCCESS : "Password changed successfully!",
    RESET_SUCCESS : "Password reset successfully!",
    PASSWORD_RESET_LINK : "Password reset link sent to your email",
    INVALID_OR_EXPIRED : "Invalid or expired reset token",

    USER_CREATE : "User created successfully!",
    USER_UPDATE : "User updated successfully!",
    USER_ALREADY_EXISTS : "User already exists with this email!",
    USER_DELETE : "User deleted successfully!",

    RESTAURANT_CREATE : "Restaurant created successfully!",
    RESTAURANT_UPDATE : "Restaurant updated successfully!",

    PRODUCT_CREATED :  "Product created successfully!",
    PRODUCT_UPDATED :  "Product updated successfully!",
    PRODUCT_DELETED : "Product delete successfully!",

    CART_ADD : "Item added successfully in the cart!",
    CART_UPDATE : "Cart updated successfully!",
    CART_ITEM : "You can add items from only one restaurant at a time!",
    CART_TYPE : "Type must be either increase or decrease!",
    ITEM_NOT_FOUND : "Item not found in cart!" ,
    PRODUCT_REMOVED : "Product removed from cart successfully!",

    VALID_AMOUNT : "Valid amount required!",
    ORDER_CREATE : "Order created successfully!",
    ORDER_CANNOT_CANCEL : "Order cannot be cancelled when status is ${order.status}!",
    INVALID_STATUS : "Invalid order status!",
    ORDER_CANCEL : "Order cancelled successfully",
    ORDER_UPDATE : "Order updated successfully!"
}

export {STATUS_CODE,staticMessages,USERTYPE}