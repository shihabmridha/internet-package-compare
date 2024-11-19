import {BanglalinkData, GpData, RobiData} from "./types.ts";

function stringToDom(html: string): NodeListOf<ChildNode> {
    const template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;

    return template.content.childNodes;
}

export async function GetRobiData(): Promise<RobiData[]> {
    const responses = await Promise.all(
        Array.from({ length: 10 }, (_, i) => {
            return fetch(`${import.meta.env.VITE_ROBI_URL}${i}`);
        }),
    );

    const jsons = await Promise.all(
        responses.map((response) => {
            return response.json();
        }),
    );

    return jsons.map(e => e.data.data.items.data).filter(i => i !== undefined).flat() as RobiData[];
}

export async function GetGpData(): Promise<GpData[]>{
    const response = await fetch(import.meta.env.VITE_GRAMEENPHONE_URL);
    const htmlString = await response.text();

    const nodes = stringToDom(htmlString);
    let json;

    for(const node of nodes) {
        if ((node as HTMLElement).id === '__NEXT_DATA__') {
            json = JSON.parse(node.textContent!);
        }
    }

    return json?.props?.pageProps?.internet_package_card_data?.content as GpData[];
}

export async function GetBanglalinkData(): Promise<BanglalinkData[]> {
    const response = await fetch(import.meta.env.VITE_BANGLALINK_URL);
    const json = await response.json();
    const data = json.data;

    return data.filter((i: { type: string; }) => i.type === 'all')[0].packs as BanglalinkData[];
}
