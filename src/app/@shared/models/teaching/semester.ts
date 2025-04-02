import { BaseDoc } from '@app/@shared/digiforce';

export interface Semester extends BaseDoc {
	name: string;
	code: string;
	startDate: Date;
	endDate: Date;
}
