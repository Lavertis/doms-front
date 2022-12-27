import {chartData} from "../../types/chartData";
import {Chart} from "primereact/chart";
import {useEffect, useState} from "react";

interface ChartComponentProps {
    // data is a dictionary of key-value pairs where key is a string and value is a number
    data: chartData | null;
    totalCount: number
}

function ChartComponent({data, totalCount}: ChartComponentProps) {
    const [chartData, setChartData] = useState<any>(null);
    const labelz: Array<string> = [];
    const dataz: Array<number> = [];

    useEffect(() => {
        if (data == null)
            return;
        for (const [key, value] of Object.entries(data)) {
            labelz.push(key);
            dataz.push(value as number);
        }

        setChartData ({
            labels: labelz,
            datasets: [
                {
                    data: dataz,
                    backgroundColor: [
                        "#5047e5",
                        "#66BB6A",
                        "#FFA726"
                    ],
                    hoverBackgroundColor: [
                        "#64B5F6",
                        "#81C784",
                        "#FFB74D"
                    ]
                }
            ]
        });
    }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

    if (chartData != null && totalCount > 0) {
        return (
            <div className="card flex flex-column justify-content-center py-6">
                <div className={"flex flex-wrap card-container justify-content-center m-2"}>
                    <h3>Appointment type</h3>
                </div>
                <div className={"flex flex-wrap card-container justify-content-center m-2"}>
                    <Chart type="pie" data={chartData}
                           style={{position: 'relative', width: '40%'}}/>
                </div>
            </div>
        );
    }

    return <div></div>;
}

export default ChartComponent;