export class SharedContants {
    public static CONFIRM_CANCEL = 'If you leave before saving, your changes will be lost';
    public static CONFIRM_DELETE = 'Are you sure you want to remove';
    public static ADMIN_ID = '1';
    public static USER_ID = undefined;
    public static IS_ADMIN = false;
    public static USER_DETAILS = undefined;

    public static setUserDetails() {
        this.USER_DETAILS = ("user" in localStorage) ? JSON.parse(localStorage.user).user : undefined;
        if (this.USER_DETAILS !== undefined) {
            this.USER_ID = this.USER_DETAILS.id || undefined;
            this.IS_ADMIN = this.USER_DETAILS.providers.local.role.id == SharedContants.ADMIN_ID || false;
            this.USER_DETAILS.earned_credit = (this.USER_DETAILS.earned_credit) ? parseInt(this.USER_DETAILS.earned_credit) : 0;
        }
    }
}