// Code generated by mtribes. DO NOT EDIT.

/* tslint:disable */
import { Experience, Broker, ColorProperty } from '@mtribes/client-browser';

export interface HeaderExperienceData {
	backgroundColor?: ColorProperty;
	gradientColor?: ColorProperty;
}

export default class HeaderExperience extends Experience<HeaderExperienceData> {
	/**
	 * The kind of Experience in string form.
	 */
	readonly kind = 'HeaderExperience';

	constructor(id: string, parentId: string, broker: Broker) {
		super(id, parentId, broker, {
			id: 'yDBpL8a',
			t: 'e',
			dataAlias: {
				'1': 'backgroundColor',
				'2': 'gradientColor'
			}
		});
	}
}