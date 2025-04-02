
import { BaseDoc } from '@app/@shared/digiforce';

export interface Grade extends BaseDoc {
	name: string;
	code: string;
	description: string;
	order_number: number;
}
