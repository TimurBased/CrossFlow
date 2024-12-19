import React from 'react'
import classes from './Button.module.css'

const Button = ({ children, ...props }: any) => {
	return (
		<button className={classes.myBtn} {...props}>
			{children}
		</button>
	)
}

export default Button
