import { environment } from "../../environments/environment";

export class RolesConstants {
    public static GET_LIST = environment.SERVER_URL + 'roles';
    public static GET_ROLES_DETAILS = environment.SERVER_URL + 'roles';
    public static REMOVE = environment.SERVER_URL + 'roles';
    public static CHECK_NAME = environment.SERVER_URL + 'roles/checkIfNameAvailable';
    public static ADD_ROLE = environment.SERVER_URL + 'createrole';
    public static EDIT_ROLE = environment.SERVER_URL + 'roles';
    public static NAME_ALREADY_AVAILABLE = "Sorry name already available, please try with diffrent name";

    public static ROLES_ADD_SUCCESS = "New Role added";
    public static ROLES_EDIT_SUCCESS = "Role details updated";
    public static ROLES_DELETE_SUCCESS = "Role deleted";
}