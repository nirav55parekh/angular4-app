import { environment } from "../../environments/environment";

export class SettingsConstants {
    public static GET_SETTINGS = environment.SERVER_URL + 'getConfigSettings';
    public static UPDATE_SETTINGS = environment.SERVER_URL + 'updateConfigSettings';

    public static SETTINGS_EDIT_SUCCESS = 'Settings Updated!';
}