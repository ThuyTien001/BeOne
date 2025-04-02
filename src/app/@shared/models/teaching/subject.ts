import { BaseDoc } from '@app/@shared/digiforce';

export interface Subject extends BaseDoc {
	name: string;
	code: string;
}
