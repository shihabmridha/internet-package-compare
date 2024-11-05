import {useEffect} from "react";
import {GetForGp, GetForRobi} from "./package/service.ts";

function App() {
   useEffect( () => {
       (async () => {
           const [gp, robi] = await Promise.all([
               GetForGp(),
               GetForRobi(),
           ]);

           console.log(gp);
           console.log(robi);
       })()
   }, []);

    return (
        <>
            <div>
                <h3>Shihab Mridha</h3>
            </div>
        </>
    )
}

export default App
