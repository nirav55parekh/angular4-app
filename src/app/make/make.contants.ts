import { environment } from "../../environments/environment";

export class MakeConstants {
    public static GET_LIST = environment.SERVER_URL + 'vinmake';
    public static GET_MAKE_DETAILS = environment.SERVER_URL + 'vinmake';
    public static REMOVE = environment.SERVER_URL + 'vinmake';
    public static CHECK_NAME = environment.SERVER_URL + 'vinmake/checkIfNameAvailable';
    public static ADD_MAKE = environment.SERVER_URL + 'createvinmake';
    public static EDIT_MAKE = environment.SERVER_URL + 'vinmake';
    public static GET_SELECTED_MAKES_DETAILS = environment.SERVER_URL + 'makes/selectedMakes';

    public static NAME_ALREADY_AVAILABLE = "Sorry name already available, please try with diffrent name";

    public static MAKE_ADD_SUCCESS = "New make added";
    public static MAKE_EDIT_SUCCESS = "Make details updated";
    public static MAKE_DELETE_SUCCESS = "Make deleted";
}