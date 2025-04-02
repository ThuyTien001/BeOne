
import { BaseDoc, DGFRecord } from '@app/@shared/digiforce';
import { Subject } from './subject';

export interface Chapter extends BaseDoc {
	name: string;
	code: string;
	description: string;
	subject: DGFRecord<Subject> | string;
}
