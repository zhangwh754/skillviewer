
import './App.css';
import React from 'react';
// import * as miscData from "./miscData.js"
import * as utils from "./utils.js"
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { cloneDeep } from "lodash"

export function Text(props) {
	// let extraClass = app.state.darkMode && !props.overrideColor ? "dark-mode-text" : ""
    let extraClass = "unselectable" // TODO OVERRIDE
	return <p style={props.style} className={extraClass + " text " + props.className} onClick={props.onClick}>{props.text}</p>
}

export function Icon(props) {
	let className = (props.className != null) ? props.className : "icon"
	let style = (props.style != null) ? cloneDeep(props.style) : {}

	if (props.style != null) {
		style.width = (props.style.width != null) ? props.style.width : props.size
		style.height = (props.style.height != null) ? props.style.height : props.size
	}
	else {
		style.width = props.size
		style.height = props.size
	}
	
	return (
		<div style={style} className={className} onClick={props.onClick} onContextMenu={props.onContextMenu}>
			{/* <img src={props.img} style={{width: props.size, height: props.size}}/> */}
			<img alt={""} src={utils.getImage(props.img)} style={{width: "100%", height: "100%"}} draggable={false}/>
		</div>
	)
}

export function DarkHR(props) {
	return (
		<hr className="dark-hr" style={{width: "90%"}}/>
	)
}

export class Tooltip extends React.Component {
	render() {
		let placement = (this.props.placement != null) ? this.props.placement : "bottom"
		return ( // hideOnClick={false} trigger={"click"}
		  <Tippy content={this.props.content} placement={placement} duration="0" hideOnClick={false}
			render={attrs => (
				<div>
					{/* check if content prop is a valid element; if it's not, make it into a <Text> */}
					<div className={this.props.classOverride ? this.props.classOverride + " styled-tooltip" : "styled-tooltip"}>
						{React.isValidElement(this.props.content) ? this.props.content : <Text text={this.props.content}/>}
					</div>
				</div>
			)}
		  >
			<span>
			  {this.props.children}
			</span>
		  </Tippy>
		)
	}
}

export function FlairedCheckbox(props) {
	return (
		<div style={props.style} className="flaired-checkbox" onContextMenu={(e) => {props.onContextMenu(); e.preventDefault(); return false}}>
			<input type="checkbox" checked={props.ticked} onChange={props.onChange} className="checkbox"/>
			<div style={{width: "10px"}}/>
			<Text text={props.text} style={{flexGrow:"1"}} className="text-small" onClick={() => {props.onChange(!props.ticked)}}/>
		</div>
	)
}

export function Dropdown(props) {
	let options = []
	for (let x in props.options) {
		options.push(<option key={x} value={x}>{props.options[x]}</option>)
	}

	return <select onChange={props.onChange} value={props.selected} className="dropdown">
		{options}
	</select>
}