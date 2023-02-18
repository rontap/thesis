export default function BtnGroup({children, vertical}: any) {
    return <div className={"btnGroup " + (vertical && "btnVertical")}>
        {children}
    </div>

}