import {AxiosResponse} from "axios";

export const saveFileFromApiResponse = (response: AxiosResponse): void => {
    const header = response.headers['content-disposition'] as string;
    const fileName = header.split(';')[1].split('=')[1];
    const fileNameWithoutQuotes = fileName.substring(1, fileName.length - 1);
    const type = response.headers['content-type'] as string;
    const blob = new Blob([response.data], {type: type});
    const fileUrl = window.URL.createObjectURL(blob);
    const fileLink = document.createElement('a');
    fileLink.href = fileUrl;
    fileLink.download = fileNameWithoutQuotes;
    fileLink.click();
}