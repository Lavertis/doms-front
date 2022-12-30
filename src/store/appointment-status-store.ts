import {AppointmentStatus} from '../types/Appointments/AppointmentStatus';
import {action, makeObservable, observable} from 'mobx';
import {authRequest} from '../services/api.service';
import {AxiosResponse} from 'axios';

class AppointmentStatusStore {
    appointmentStatuses: AppointmentStatus[] = [];

    constructor() {
        makeObservable(this, {appointmentStatuses: observable, fetchAppointmentStatuses: action});
    }

    fetchAppointmentStatuses() {
        return authRequest.get('appointment-statuses')
            .then((response: AxiosResponse<AppointmentStatus[]>) => {
                this.appointmentStatuses = response.data;
            })
            .catch(error => {
                console.log(error);
            });
    }

    getById(id: string) {
        return this.appointmentStatuses.find(appointmentStatus => appointmentStatus.id === id);
    }

    getByName(name: string) {
        return this.appointmentStatuses.find(appointmentStatus => appointmentStatus.name === name);
    }
}

const appointmentStatusStore = new AppointmentStatusStore();

export default appointmentStatusStore;