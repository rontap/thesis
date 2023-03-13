export default function Number(props: any) {
    return <>
        <input type={"number"}
               className={"configInputItem"}
               defaultValue={42}/>

        <button className={"configButtonItem"}>Open..</button>
    </>
}