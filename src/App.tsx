import {useEffect, useState} from "react";
import {GetForBanglalink, GetForGp, GetForRobi} from "./package/service.ts";
import {PackageComparisonComponent} from "@/components/package-comparison.tsx";
import {Package} from "@/package/package.ts";

function App() {
    const [packages, setPackages] = useState<Package[]>([]);

    useEffect(() => {
        (async () => {
            const [gpResult, robiResult, banglalinkResult] = await Promise.allSettled([
                GetForGp(),
                GetForRobi(),
                GetForBanglalink(),
            ]);

            const packages = [];
            if (gpResult.status !== "rejected") {
                packages.push(...gpResult.value);
            }
            if (robiResult.status !== "rejected") {
                packages.push(...robiResult.value);
            }
            if (banglalinkResult.status !== "rejected") {
                packages.push(...banglalinkResult.value);
            }

            setPackages(packages);
        })();
    }, []);

    return (
        <PackageComparisonComponent packages={packages}/>
    );
}

export default App;
