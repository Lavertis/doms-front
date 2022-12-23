import React from 'react';
import moment from 'moment';
import {Doctor} from '../../../../../types/Users/Doctor';

interface DoctorFieldsProps {
    doctor?: Doctor;
}

const DoctorFields = ({doctor}: DoctorFieldsProps) => {
    return (
        <div>
            <div className="flex flex-column md:flex-row">
                <div
                    className="font-bold text-black-alpha-70 flex md:justify-content-end col-auto md:col-4 lg:col-3">
                    Id:
                </div>
                <div className="font-bold text-black-alpha-50 ml-2 col-auto md:col-8 lg:col-9">
                    {doctor?.id}
                </div>
            </div>
            <div className="flex flex-column md:flex-row">
                <div
                    className="font-bold text-black-alpha-70 flex md:justify-content-end col-auto md:col-4 lg:col-3">
                    First name:
                </div>
                <div className="font-bold text-black-alpha-50 ml-2 col-auto md:col-8 lg:col-9">
                    {doctor?.firstName}
                </div>
            </div>
            <div className="flex flex-column md:flex-row">
                <div
                    className="font-bold text-black-alpha-70 flex md:justify-content-end col-auto md:col-4 lg:col-3">
                    Last name:
                </div>
                <div className="font-bold text-black-alpha-50 ml-2 col-auto md:col-8 lg:col-9">
                    {doctor?.lastName}
                </div>
            </div>
            <div className="flex flex-column md:flex-row">
                <div
                    className="font-bold text-black-alpha-70 flex md:justify-content-end col-auto md:col-4 lg:col-3">
                    Email:
                </div>
                <div className="font-bold text-black-alpha-50 ml-2 col-auto md:col-8 lg:col-9">
                    {doctor?.email}
                </div>
            </div>
            <div className="flex flex-column md:flex-row">
                <div
                    className="font-bold text-black-alpha-70 flex md:justify-content-end col-auto md:col-4 lg:col-3">
                    Phone:
                </div>
                <div className="font-bold text-black-alpha-50 ml-2 col-auto md:col-8 lg:col-9">
                    {doctor?.phoneNumber}
                </div>
            </div>
            <div className="flex flex-column md:flex-row">
                <div
                    className="font-bold text-black-alpha-70 flex md:justify-content-end col-auto md:col-4 lg:col-3">
                    Account creation:
                </div>
                <div className="font-bold text-black-alpha-50 ml-2 col-auto md:col-8 lg:col-9">
                    {moment(doctor?.createdAt).format('DD/MM/YYYY')}
                </div>
            </div>
        </div>
    );
};

export default DoctorFields;
