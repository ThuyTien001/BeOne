import { LMSRoles } from './lms-role';

export type DGFUser = {
    _id: string;
    id?: string; // Alias of _id
    name: string;
    mobile: string;
    email: string;
    position: string;

    avatar?: string;
    locale?: string;
    language?: string;

    created: string; // Date ISO String
    modified: string; // Date ISO String

    email_verified: boolean;
    emails: Array<{
        address: string;
        verified: boolean;
    }>,
    utcOffset?: number;
    last_logon: string; // Date ISO String

    mobile_verified: boolean;
    lockout: boolean;
    login_failed_number: number;

    roles: Array<string>;
    profile: string;

    authToken?: string;
    spaceId?: string;
    userId?: string;

    organization?: {
        _id: string,
        name: string,
        fullname: string,
        company_id: string,
    };
    organizations_parents: Array<string>;
    company_id: string;
    company_ids: Array<string>;
    company: {
        _id: string,
        name: string,
        organization: string,
    };
    space: {
        _id: string,
        name: string,
        admins: Array<string>,
    };
    spaceUserId: string;
    is_space_admin: boolean,

    lms_role?: LMSRoles,
    lms_student?: string,
    lms_parent?: string,
    lms_teacher?: string,
    lms_profile_data?: any,
};