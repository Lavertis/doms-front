import React, {useState} from 'react';
import {AutoComplete, AutoCompleteCompleteMethodParams, AutoCompleteSelectParams} from "primereact/autocomplete";
import {Dropdown} from "primereact/dropdown";
import {InputNumber} from "primereact/inputnumber";
import {Drug, DrugApiResult} from "../../types/drugs";
import {Button} from "primereact/button";

interface AddDrugItemProps {
    drug: Drug,
    drugIndex: number,
    setDrug: (drug: Drug, index: number) => void,
    removeDrug: (index: number) => void,
    dosages: string[]
}

const AddDrugItem = ({drug, drugIndex, setDrug, removeDrug, dosages}: AddDrugItemProps) => {
    const [drugSearchName, setDrugSearchName] = useState(drug.name);
    const [drugs, setDrugs] = useState<Drug[]>([]);

    const drugItemTemplate = (drug: Drug) => {
        return (
            <table className="drug-item">
                <tbody>
                <tr>
                    <td className="pr-2"><strong>Name:</strong></td>
                    <td className="pl-auto text-overflow-ellipsis">{drug.name}</td>
                </tr>
                <tr>
                    <td className="pr-2"><strong>Alt name:</strong></td>
                    <td>{drug.alternative_name}</td>
                </tr>
                <tr>
                    <td className="pr-2"><strong>ID:</strong></td>
                    <td>{drug.rxcui}</td>
                </tr>
                </tbody>
            </table>
        );
    }

    const fetchDrugsAsync = async (drugName: string): Promise<Drug[]> => {
        if (!drugName || !drugName.trim().length)
            return [];
        const apiUrl = `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${drugName}`
        const response = await fetch(apiUrl);
        if (!response.ok)
            return [];

        const apiResult: DrugApiResult = await response.json();
        let drugs = new Array<Drug>();
        if (apiResult.drugGroup == null || apiResult.drugGroup.conceptGroup == null)
            return drugs;

        for (const conceptGroup of apiResult.drugGroup.conceptGroup) {
            if (conceptGroup.conceptProperties == null || conceptGroup.conceptProperties.length === 0)
                continue;

            for (const conceptProperty of conceptGroup.conceptProperties) {
                const drug = {
                    rxcui: Number(conceptProperty.rxcui),
                    name: conceptProperty.name,
                    alternative_name: conceptProperty.synonym,
                    quantity: 1,
                    dosage: dosages[0]
                }
                drugs.push(drug);
            }

            break;
        }
        return drugs;
    }

    const searchDrug = (params: AutoCompleteCompleteMethodParams) => {
        setTimeout(async () => {
            const drugName = params.query.toLowerCase();
            let filteredDrugs = await fetchDrugsAsync(drugName);
            setDrugs(filteredDrugs);
        }, 0);
    }

    const onDrugSelect = (params: AutoCompleteSelectParams) => {
        setDrug({
            ...drug,
            name: params.value.name,
            alternative_name: params.value.alternative_name,
            rxcui: params.value.rxcui
        }, drugIndex);
    }

    return (
        <div className="p-fluid mb-3 flex">
            <div className="col-11 p-0 pr-5">
                <div className="pl-0 pt-2">
                    <label htmlFor="fulfillmentDeadline" className="block text-900 font-medium mb-2">
                        Search drug
                    </label>
                    <AutoComplete
                        value={drugSearchName}
                        suggestions={drugs}
                        completeMethod={searchDrug}
                        field="name"
                        dropdown
                        forceSelection
                        onSelect={onDrugSelect}
                        itemTemplate={drugItemTemplate}
                        onChange={(e) => setDrugSearchName(e.value)}
                        aria-label="Drugs"
                        className="w-12"
                    />
                </div>

                <div className="flex flex-column sm:flex-row">
                    <div className="col-12 sm:col-4 md:col-3 pl-0">
                        <label htmlFor="daily-dosage" className="block text-900 font-medium mb-2">
                            Daily dosage
                        </label>
                        <Dropdown
                            id="daily-dosage"
                            value={drug?.dosage}
                            options={dosages}
                            onChange={(e) => setDrug({...drug, dosage: e.value}, drugIndex)}
                            placeholder="Select dosage"
                            className="w-auto"
                        />
                    </div>

                    <div className="col-12 sm:col-4 md:col-3">
                        <label htmlFor="quantity" className="block text-900 font-medium mb-2">Quantity</label>
                        <InputNumber
                            inputId="quantity"
                            value={drug.quantity}
                            onValueChange={(e) => setDrug({...drug, quantity: Number(e.value)}, drugIndex)}
                            min={1}
                            max={99}
                            showButtons
                        />
                    </div>
                </div>
            </div>
            <div className="my-auto mx-auto">
                <Button
                    icon="pi pi-minus"
                    type="button"
                    className="align-self-start p-button-rounded p-button-danger justify-content-center"
                    onClick={() => removeDrug(drugIndex)}
                />
            </div>
        </div>
    );
};

export default AddDrugItem;
