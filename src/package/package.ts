import {Operators} from "@/enums/operator.ts";
import {diffInDays, isValidDate} from "@/lib/utils.ts";

export interface Package {
    id: number;
    title: string;
    price: number;
    validity: number; // in days
    volume: number;
    bonusVolume: number;
    talkTime: number;
    bonusTalkTime: number;
    sms: number;
    bonusSms: number;
    operator: Operators;
    description?: string;
}

abstract class BasePackage implements Package {
    id: number;
    validity = 0;
    volume = 0;
    bonusVolume = 0;
    price: number;
    operator: Operators;
    talkTime = 0;
    bonusTalkTime = 0;
    sms = 0;
    bonusSms = 0;
    title: string;

    constructor(id: number, title: string, price: number, operator: Operators) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.operator = operator;
    }

    abstract setVolume(input: string | number): void;

    abstract setValidity(input: string | number): void;
}

export class GrameenphonePackage extends BasePackage {
    setValidity(input: string) {
        this.validity = isValidDate(input)
            ? diffInDays(new Date(), new Date(input)) :
            Number(input.split(' ')[0]);
    }

    setVolume(input: string) {
        const parts = input.split(' ');
        if (parts.length < 2) {
            this.volume = Infinity;
            return;
        }

        const volume = parts[0];
        const unit = parts[1];
        if (unit === 'GB') {
            this.volume = Number(volume) * 1024;
            return;
        }

        this.volume = Number(volume);
    }

}

export class RobiPackage extends BasePackage {
    setValidity(input: string | number) {
        this.validity = Number(input);
    }

    setVolume(input: string | number) {
        const isUnlimited = this.title.split(" ")[1] === "Unlimited";
        if (this.volume === 0 && isUnlimited) {
            this.volume = Infinity;
            return;
        }

        this.volume = Number(input);
    }
}

export class BanglalinkPackage extends BasePackage {
    setValidity(input : string | number) {
        this.validity = Number(input);
    }

    setVolume  (input : string | number) {
        this.volume = Number(input);
    }
}