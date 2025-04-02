import { BaseDoc } from '@app/@shared/digiforce';

export interface Nation extends BaseDoc {
	name: string;
	code: string;
}
