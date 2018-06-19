import { environment } from "../../environments/environment";

export class ScriptGroupsConstants {
    public static GET_LIST = environment.SERVER_URL + 'scriptGroups';
    public static SCRIPTS_OF_SCRIPT_GROUPS = environment.SERVER_URL + 'scriptGroups/scriptsOfScriptGroup';
    public static GET_SCRIPT_GROUPS_DETAILS = environment.SERVER_URL + 'scriptGroup';
    public static REMOVE = environment.SERVER_URL + 'scriptGroup';
    public static CHECK_NAME = environment.SERVER_URL + 'scriptGroups/checkIfNameAvailable';
    public static ADD_SCRIPT_GROUP = environment.SERVER_URL + 'createscriptGroup';
    public static EDIT_SCRIPT_GROUP = environment.SERVER_URL + 'scriptGroup';
    public static GET_SELECTED_SCRIPT_GROUPS_DETAILS = environment.SERVER_URL + 'scriptGroups/selectedScriptGroup';
    public static GET_USER_CREATED_SCRIPT_GROUPS_DETAILS = environment.SERVER_URL + 'scriptGroups/getUserCreatedScriptGroups';

    public static NAME_ALREADY_AVAILABLE = "Sorry name already available, please try with diffrent name";

    public static SCRIPT_GROUPS_ADD_SUCCESS = "New Script Group added";
    public static SCRIPT_GROUPS_EDIT_SUCCESS = "Script Group details updated";
    public static SCRIPT_GROUPS_DELETE_SUCCESS = "Script Group deleted";
}