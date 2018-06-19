import { environment } from "../../environments/environment";

export class UserConstants {
    public static GET_LIST = environment.SERVER_URL + 'users/getuserlist';
    public static REMOVE = environment.SERVER_URL + 'users';
    public static GET_USER_DETAILS = environment.SERVER_URL + 'users';
    public static ADD_USER = environment.SERVER_URL + 'createuser';
    public static REGISTER_USER = environment.SERVER_URL + 'register';
    public static EDIT_USER = environment.SERVER_URL + 'users';
    public static APPROVE_USERS = environment.SERVER_URL + 'users/approveUsers';

    public static USER_ADD_SUCCESS = "New user added";
    public static USER_EDIT_SUCCESS = "User details updated";
    public static USER_DELETE_SUCCESS = "User deleted";

    public static ROLE_LIST = [
        { "id": 1, "name": "Admin" },
        { "id": 2, "name": "Customer" },
    ]
}