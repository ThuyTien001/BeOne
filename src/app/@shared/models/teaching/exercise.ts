
import { BaseDoc, DGFRecord } from '@app/@shared/digiforce';
import { Question } from './question';

export interface Exercise extends BaseDoc {
	name: string;
	code: string;
	description: string;
	type: string;
	questions?: Array<string | DGFRecord<Question>>;
}
