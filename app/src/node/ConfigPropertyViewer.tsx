import {jsobj} from "../app/util";
import Button from "../components/Button";

export function ConfigPropertyViewer(configParams: jsobj | undefined) {
    if (!configParams) {
        console.log("[no config params found]")
        return <></>
    }

    return <>

        {Object.entries(configParams)
            .filter(([_, entry]) => !entry.hide)
            .map(([key, entry]) => {
                return <span key={key}>
                <Button small>{key}.{JSON.stringify(entry)}</Button>
            </span>

            })
        }
    </>
}