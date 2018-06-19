import { environment } from "../../environments/environment";

export class ScriptConstants {
    public static GET_LIST = environment.SERVER_URL + 'scripts/getscriptlist';
    public static REMOVE = environment.SERVER_URL + 'scripts';
    public static GET_PROGRAM_LIST_BY_SCRIPT = environment.SERVER_URL + 'scripts/getprogramslist';

    public static GET_SCRIPT_DETAILS = environment.SERVER_URL + 'scripts';
    public static CHECK_NAME = environment.SERVER_URL + 'vinscript/checkIfNameAvailable';
    public static ADD_SCRIPT = environment.SERVER_URL + 'createscript';
    public static EDIT_SCRIPT = environment.SERVER_URL + 'scripts';
    public static ASSIGN_PROGRAMS = environment.SERVER_URL + 'vinyear/assignprograms/';
    public static VIN_YEAR = environment.SERVER_URL + 'vinyear/';
    public static STOP_PROGRAM = environment.SERVER_URL + 'scripts/stopprogram/';
    public static GET_BY_TYPED = environment.SERVER_URL + 'devices/getbytyped/';

    public static SCRIPT_ADD_SUCCESS = "New script added";
    public static SCRIPT_EDIT_SUCCESS = "Script details updated";
    public static SCRIPT_DELETE_SUCCESS = "Script deleted";
    public static CREDIT_ADDED = "Credit updated";
    public static CREDIT_ADD_FAIL = "Please provide valid detail";
    public static NAME_ALREADY_AVAILABLE = "Sorry name already available, please try with diffrent name";

    public static CATEGORIES = [
        { "id": 1, "name": "Autorun", run_default: 1  },
        { "id": 2, "name": "Vehicle",run_default: 0  },
        { "id": 3, "name": "Make Default",run_default: 0 }
    ]
}