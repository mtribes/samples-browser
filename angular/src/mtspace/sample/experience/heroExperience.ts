// Code generated by mtribes. DO NOT EDIT.

/* tslint:disable */
import { Experience, Broker } from '@mtribes/client-browser';

export interface HeroExperienceData {
	source?: string;
}

export default class HeroExperience extends Experience<HeroExperienceData> {
	/**
	 * The kind of Experience in string form.
	 */
	readonly kind = 'HeroExperience';

	constructor(id: string, parentId: string, broker: Broker) {
		super(id, parentId, broker, {
			id: 'VGd1POB',
			t: 'e',
			dataAlias: {
				'1': 'source'
			}
		});
	}
}