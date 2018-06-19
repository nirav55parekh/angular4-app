import { environment } from "../../../../environments/environment";

export class PermissionsConstants {
  public static GET_LIST = environment.SERVER_URL + 'permissionList';
  public static GET_ROLES_PERMISSION_LIST = environment.SERVER_URL + 'rolesPermissionList';
}