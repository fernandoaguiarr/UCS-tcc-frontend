import { PropsWithChildren } from "react"
import classNames from 'classnames';


export const Row: React.FC<PropsWithChildren<{ className?: string, styles?: any }>> = ({ children, className, styles = {} }) => {
    return (
        <>
            <div className={classNames('flex', 'flex-row', className)} style={styles}>
                {children}
            </div >
        </>
    )
}