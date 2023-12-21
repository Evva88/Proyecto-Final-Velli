export default class GetUserDTO {
    constructor(user){
        this.first_name = user.first_name,
        this.last_name = user.last_name,
        this.age = user.age,
        this.role = user.role,
        this.email = user.email,
        this.last_connection = user.last_connection
    }
}