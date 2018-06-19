import { environment } from "../../environments/environment";

export class YearConstants {
    public static GET_LIST = environment.SERVER_URL + 'vinyear';
    public static REMOVE = environment.SERVER_URL + 'vinyear';

    public static GET_YEAR_DETAILS = environment.SERVER_URL + 'vinyear';
    public static CHECK_YEAR = environment.SERVER_URL + 'vinyear/checkIfNameAvailable';
    public static ADD_YEAR = environment.SERVER_URL + 'createvinyear';
    public static EDIT_YEAR = environment.SERVER_URL + 'vinyear';

    public static YEAR_ALREADY_AVAILABLE = "Sorry year already available, please try with diffrent year";

    public static YEAR_ADD_SUCCESS = "New year added";
    public static YEAR_EDIT_SUCCESS = "Year details updated";
    public static YEAR_DELETE_SUCCESS = "Year deleted";
}