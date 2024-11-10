import {GetBanglalinkData, GetGpData, GetRobiData} from "../fetcher/fetch.ts";
import {Operators} from "@/enums/operator.ts";
import {BanglalinkPackage, GrameenphonePackage, Package, RobiPackage} from "@/package/package.ts";

export async function GetForGp(): Promise<Package[]> {
    const data = await GetGpData();
    return data.map((e, i) => {
        const pkg = new GrameenphonePackage(i, e.title, +e.price, Operators.GP);
        pkg.setVolume(e.title);
        pkg.setValidity(e.timeDuration);

        return pkg;
    });
}

export async function GetForRobi(): Promise<Package[]> {
    const data = await GetRobiData();
    console.log(data);
    return data.filter(i => i.display_status).map((e, i) => {
        const pkg = new RobiPackage(i, e.title_en, e.price, Operators.ROBI);
        pkg.setValidity(e.duration / 24); // hours to days
        pkg.setVolume(e.volume);

        return pkg;
    });
}

export async function GetForBanglalink(): Promise<Package[]> {
    const data = await GetBanglalinkData();
    return data.map((e, i) => {
        const pkg = new BanglalinkPackage(i, e.name_en, e.price_tk, Operators.BANGLALINK);
        pkg.setValidity(e.validity_days);
        pkg.setVolume(e.internet_volume_mb);

        return pkg;
    });
}