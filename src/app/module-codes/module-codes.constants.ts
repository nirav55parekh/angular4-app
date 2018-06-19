import { environment } from "../../environments/environment";

export class ModuleCodesConstants {
    public static GET_LIST = environment.SERVER_URL + 'devicecodes/showcodesallmodules';
    public static GET_CODES = environment.SERVER_URL + 'devicecodes/showcodes';
}