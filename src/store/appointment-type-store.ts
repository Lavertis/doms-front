import {AppointmentType} from '../types/Appointments/AppointmentType';
import {action, makeObservable, observable} from 'mobx';
import {authRequest} from '../services/api.service';
import {AxiosResponse} from 'axios';

class AppointmentTypeStore {
    appointmentTypes: AppointmentType[] = [];

    constructor() {
        makeObservable(this, {appointmentTypes: observable, fetchAppointmentTypes: action});
    }

    async fetchAppointmentTypes() {
        await authRequest.get('appointment-types')
            .then((response: AxiosResponse<AppointmentType[]>) => {
                this.appointmentTypes = response.data;
            })
            .catch(error => {
                console.log(error);
            });
    }

    getById(id: string) {
        return this.appointmentTypes?.find(appointmentType => appointmentType.id === id);
    }

    getByName(name: string) {
        return this.appointmentTypes?.find(appointmentType => appointmentType.name === name);
    }
}

const appointmentTypeStore = new AppointmentTypeStore();

export default appointmentTypeStore;