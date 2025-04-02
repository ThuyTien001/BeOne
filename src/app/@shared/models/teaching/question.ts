
import { QuestionType } from '@app/@declare';
import { BaseDoc } from '@app/@shared/digiforce';

export interface Question extends BaseDoc {
	name: string;
	code: string;
	content: string;
	type: QuestionType;
	answers?: Array<{
		_id: string,
		name: string,
		isTrue: string,
	}>;
	explain?: string;
}
