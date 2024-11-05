export interface RobiData {
    uid: string;
    title_en: string;
    title_bn: string;
    talk_time: number;
    sms: number;
    volume: string;
    slug: string;
    price: number;
    duration: number; // in hours
    display_status: boolean;
}

export interface GpData {
    title: string;
    subTitle: string;
    price: string;
    timeDuration: string;
    bonusData: string;
    bonusMin: string;
    nid: string;
}