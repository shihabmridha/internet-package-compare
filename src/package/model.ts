export interface Package {
    id: number;
    title: string;
    subTitle: string;
    price: number;
    validity: number; // in days
    volume: number;
    bonusVolume: number;
    talkTime: number;
    bonusTalkTime: number;
    sms: number;
    bonusSms: number;
}
