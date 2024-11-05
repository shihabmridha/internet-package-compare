import {GetGpData, GetRobiData} from "../fetcher/fetch.ts";
import {Package} from "./model.ts";

function isValidDate(value: string) {
    const date = new Date(value);
    return !isNaN(date.getTime());
}

function diffInDays(from: Date, to: Date) {
    const oneDayInMs = 1000 * 60 * 60 * 24;
    const fromMs = from.getTime();
    const toMs = to.getTime();
    const differenceInMs = Math.abs(toMs - fromMs);
    return Math.floor(differenceInMs / oneDayInMs);
}

function gpValidity(value: string): number {
    if (isValidDate(value)) {
        return diffInDays(new Date(), new Date(value));
    }

    return Number(value.split(' ')[0]);
}

export async function GetForGp(): Promise<Package[]> {
    const data = await GetGpData();
    return data.map((e, i) => {
        return {
            id: i,
            title: e.title,
            subTitle: e.subTitle,
            price: Number(e.price),
            validity: gpValidity(e.timeDuration), // ex: 7 Days to 7
            sms: 0,

        } as Package;
    })
}

export async function GetForRobi() {
    const data = await GetRobiData();
    return data.map((e, i) => {
        return {
            id: i,
            title: e.title_en,
            subTitle: '',
            price: Number(e.price),
            validity: e.duration / 24, // hours to days
            sms: e.sms,
            talkTime: e.talk_time,

        } as Package;
    })
}