import {useEffect, useState} from "react";
import {GetForBanglalink, GetForGp, GetForRobi} from "./package/service.ts";
import {PackageComparisonComponent} from "@/components/package-comparison.tsx";
import {Package} from "@/package/package.ts";

function App() {
    const [packages, setPackages] = useState<Package[]>([]);

    useEffect(() => {
        (async () => {
            const [gp, robi, banglalink] = await Promise.all([
                GetForGp(),
                GetForRobi(),
                GetForBanglalink(),
            ]);
            setPackages([...gp, ...robi, ...banglalink]);
        })();
    }, []);

    return (
        <PackageComparisonComponent packages={packages}/>
    );
}

export default App;
