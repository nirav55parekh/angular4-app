import { Subject } from "rxjs/Subject";
import { HeadingConstants } from "./heading.constants";

export class HeadingService {

    setHeading(headingDetails) {

        if (headingDetails.search("edit") !== -1) {
            headingDetails = headingDetails.substring(0, headingDetails.search("edit") + 4);
        }
        if (headingDetails.search("view") !== -1) {
            headingDetails = headingDetails.substring(0, headingDetails.search("view") + 4);
        }
        if (headingDetails.search("scriptList") !== -1) {
            headingDetails = headingDetails.substring(0, headingDetails.search("scriptList") + 10);
        }
        if (headingDetails.search("settings") !== -1) {
            headingDetails = headingDetails.substring(0, headingDetails.search("settings") + 8);
        }
        return HeadingConstants.headins[headingDetails] || {};
    }

}