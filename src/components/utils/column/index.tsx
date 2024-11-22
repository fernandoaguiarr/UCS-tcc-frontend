import classNames from "classnames"
import { PropsWithChildren } from "react"


export const Column: React.FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
    return (
        <>
            <div className={classNames('flex', 'flex-col', className)}>
                {children}
            </div>
        </>
    )
}