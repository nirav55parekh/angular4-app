import { environment } from "../../environments/environment";

export class VinConstants {
    public static GET_LIST = environment.SERVER_URL + 'vindetails';
    public static REMOVE = environment.SERVER_URL + 'vindetails';

    public static GET_VIN_DETAILS = environment.SERVER_URL + 'vindetails';
    public static CHECK_NAME = environment.SERVER_URL + 'vinvin/checkIfNameAvailable';
    public static ADD_VIN = environment.SERVER_URL + 'createvindetail';
    public static EDIT_VIN = environment.SERVER_URL + 'vindetails';

    public static VIN_ADD_SUCCESS = "New vin added";
    public static VIN_EDIT_SUCCESS = "Vin details updated";
    public static VIN_DELETE_SUCCESS = "Vin deleted";
}