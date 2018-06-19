import { environment } from "../../environments/environment";

export class DeviceConstants {
    public static GET_LIST = environment.SERVER_URL + 'devices';
    public static GET_DEVICE_DETAILS = environment.SERVER_URL + 'devices/getDevice';
    public static GET_CONFIG_DEVICE_DETAILS = environment.SERVER_URL + 'devices/getConfigDevice'; 
    public static GET_REMOVE_CONFIG_DEVICE_DETAILS = environment.SERVER_URL + 'devices/removeConfigDevice';
    public static REMOVE = environment.SERVER_URL + 'devices';
    public static ADD_DEVICE = environment.SERVER_URL + 'createdevice';
    public static EDIT_DEVICE = environment.SERVER_URL + 'devices';
    public static GET_CHROME_DATA = environment.SERVER_URL + 'devicecodes/getchromedata';
    public static GET_SCRIPT_BY_MAKE_MODEL_YEAR = environment.SERVER_URL + 'vinyear/getscriptbymakemodelyear';
    public static RESET_DEVICE_ANGULAR_SESSION = environment.SERVER_URL + 'resetdeviceangularsession';
    public static SHOW_POST_CODES = environment.SERVER_URL + 'devicecodes/showpostcodes/';
    public static SHOW_NEAR_POST_CODES = environment.SERVER_URL + 'devicecodes/shownearpostcodes/';
    public static GET_VIN_YEAR_BY_MAKE_MODEL = environment.SERVER_URL + 'getvinyearbymakemodel/';
    public static PRINT_PDF = environment.SERVER_URL + 'devices/printpdf';
    public static CHECK_DEVICE_ABLETO_RUN_SCRIPT = environment.SERVER_URL + 'checkdeviceabletorunscript';
    public static SHOW_CODES_ALL_MODULES = environment.SERVER_URL + 'devicecodes/showcodesallmodules';
    public static MAKE_LIST = environment.SERVER_URL + 'vinmake/';
    public static GET_MODEL_BY_MAKE = environment.SERVER_URL + 'getvinmodelbymake/';
    public static VIN_YEAR = environment.SERVER_URL + 'vinyear/';
    public static GET_PROGRAM_LIST = environment.SERVER_URL + 'scripts/getprogramslist/\'';
    public static RUN_PYTHON_SCRIPT_PROGRAM = environment.SERVER_URL + 'devices/runpythonscriptprogram/';
    public static STOP_PYTHON_SCRIPT_PROGRAM = environment.SERVER_URL + 'devices/stoppythonscriptprogram/';
    public static GET_DEVICE_BY_NUMBER = environment.SERVER_URL + 'devices/getdevicebynumber/';
    public static GET_CUSTOMER_LIST = environment.SERVER_URL + 'users/getuserlist/Customer';
    public static GET_SELECTED_USER_LIST = environment.SERVER_URL + 'users/selectedUserList';

    public static SCAN_START_TEXT = "Start Procedure:::"
    public static DEVICE_ADD_SUCCESS = "New device added";
    public static DEVICE_EDIT_SUCCESS = "Device details updated";
    public static DEVICE_DELETE_SUCCESS = "Device deleted";
}