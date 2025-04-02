import { BaseDoc, DGFRecord } from '@app/@shared/digiforce';
import { Gender } from '../_common';
import { City, Nation } from '../base';
import { Parent } from './parent';

export interface Student extends BaseDoc {
	name: string;
	code: string;

	address: string;
	birthday: Date;
	city: DGFRecord<City> | string;
	email: string;
	gender: Gender;
	mobile: string;
	nation: DGFRecord<Nation> | string;
	parent: DGFRecord<Parent>;
	school: string;
}
