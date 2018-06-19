import { environment } from "../../environments/environment";

export class ModelConstants {
    public static GET_LIST = environment.SERVER_URL + 'vinmodel';
    public static GET_MODEL_DETAILS = environment.SERVER_URL + 'vinmodel';
    public static REMOVE = environment.SERVER_URL + 'vinmodel';
    public static CHECK_NAME = environment.SERVER_URL + 'vinmodel/checkIfNameForSameMakeAvailable';
    public static ADD_MODEL = environment.SERVER_URL + 'createvinmodel';
    public static EDIT_MODEL = environment.SERVER_URL + 'vinmodel';
    public static GET_MODELS_BY_MAKE = environment.SERVER_URL + 'getvinmodelbymake';

    public static NAME_ALREADY_AVAILABLE = "Sorry name already available for this make, please try with diffrent name";

    public static MODEL_ADD_SUCCESS = "New model added";
    public static MODEL_EDIT_SUCCESS = "Model details updated";
    public static MODEL_DELETE_SUCCESS = "Model deleted";
}