import React from 'react'
import classes from './Input.module.css'

const Input = (props: any) => {
	return <input className={classes.myInput} {...props} />
}

export default Input
