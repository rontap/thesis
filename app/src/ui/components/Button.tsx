export default function Button({children, small, className = "", ...props}: any) {
    return <button className={(small ? "btnSmall" : "") + " btn " + className}
                   {...props}
    >
        {children}
    </button>
}