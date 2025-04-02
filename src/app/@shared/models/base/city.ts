import { BaseDoc } from '@app/@shared/digiforce';

export interface City extends BaseDoc {
	name: string;
	code: string;
}
