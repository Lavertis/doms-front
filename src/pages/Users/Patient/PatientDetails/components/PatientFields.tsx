import React from 'react';
import moment from 'moment/moment';
import {Patient} from '../../../../../types/Users/Patient';

interface PatientFieldsProps {
    patient?: Patient;
}

const PatientFields = ({patient}: PatientFieldsProps) => {
    return (
        <div>
            <div className="flex flex-column md:flex-row">
                <div
                    className="font-bold text-black-alpha-70 flex md:justify-content-end col-auto md:col-4 lg:col-3">
                    First name:
                </div>
                <div className="font-bold text-black-alpha-50 ml-2 col-auto md:col-8 lg:col-9">
                    {patient?.firstName}
                </div>
            </div>
            <div className="flex flex-column md:flex-row">
                <div
                    className="font-bold text-black-alpha-70 flex md:justify-content-end col-auto md:col-4 lg:col-3">
                    Last name:
                </div>
                <div className="font-bold text-black-alpha-50 ml-2 col-auto md:col-8 lg:col-9">
                    {patient?.lastName}
                </div>
            </div>
            <div className="flex flex-column md:flex-row">
                <div
                    className="font-bold text-black-alpha-70 flex md:justify-content-end col-auto md:col-4 lg:col-3">
                    Email:
                </div>
                <div className="font-bold text-black-alpha-50 ml-2 col-auto md:col-8 lg:col-9">
                    {patient?.email}
                </div>
            </div>
            <div className="flex flex-column md:flex-row">
                <div
                    className="font-bold text-black-alpha-70 flex md:justify-content-end col-auto md:col-4 lg:col-3">
                    National ID:
                </div>
                <div className="font-bold text-black-alpha-50 ml-2 col-auto md:col-8 lg:col-9">
                    {patient?.nationalId}
                </div>
            </div>
            <div className="flex flex-column md:flex-row">
                <div
                    className="font-bold text-black-alpha-70 flex md:justify-content-end col-auto md:col-4 lg:col-3">
                    Date of birth:
                </div>
                <div className="font-bold text-black-alpha-50 ml-2 col-auto md:col-8 lg:col-9">
                    {moment(patient?.dateOfBirth).format('DD/MM/YYYY')}
                </div>
            </div>
            <div className="flex flex-column md:flex-row">
                <div
                    className="font-bold text-black-alpha-70 flex md:justify-content-end col-auto md:col-4 lg:col-3">
                    Phone:
                </div>
                <div className="font-bold text-black-alpha-50 ml-2 col-auto md:col-8 lg:col-9">
                    {patient?.phoneNumber}
                </div>
            </div>
            <div className="flex flex-column md:flex-row">
                <div
                    className="font-bold text-black-alpha-70 flex md:justify-content-end col-auto md:col-4 lg:col-3">
                    Address:
                </div>
                <div className="font-bold text-black-alpha-50 ml-2 col-auto md:col-8 lg:col-9">
                    {patient?.address}
                </div>
            </div>
            <div className="flex flex-column md:flex-row">
                <div
                    className="font-bold text-black-alpha-70 flex md:justify-content-end col-auto md:col-4 lg:col-3">
                    Account creation:
                </div>
                <div className="font-bold text-black-alpha-50 ml-2 col-auto md:col-8 lg:col-9">
                    {moment(patient?.createdAt).format('DD/MM/YYYY')}
                </div>
            </div>
        </div>
    );
};

export default PatientFields;
