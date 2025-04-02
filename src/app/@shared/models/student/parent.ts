import { BaseDoc, DGFRecord } from '@app/@shared/digiforce';
import { Gender } from '../_common';
import { City, Nation } from '../base';

export interface Parent extends BaseDoc {
	name: string;
	code: string;

	address: string;
	birthday: Date;
	city: DGFRecord<City> | string;
	gender: Gender;
	mobile: string;
	nation: DGFRecord<Nation> | string;
	school: string;
	spsace_user: string;
}
