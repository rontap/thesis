export default function Button({children, className, ...props}: any) {
    return <button className={"btn " + className}{...props}>
        {children}
    </button>
}