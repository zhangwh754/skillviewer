import * as utils from "./utils.js"
import './App.css';
import React from 'react';
import * as miscData from "./miscData.js"

import { DarkHR, Icon, Text, Tooltip } from "./genericComponents.js"
import HTMLReactParser from "html-react-parser";

const parse = HTMLReactParser

export function SkillTooltip(props) {
	let skill = props.data

	let tooltip = <div className="flex-vertical tooltip">
		<SkillHeader skill={skill} />

		<SkillDescription skill={skill} />

		<SkillFooter skill={skill} />

		<Cooldown skill={skill} />

	</div>

	return (
		<Tooltip content={tooltip} placement="right">
			{props.children}
		</Tooltip>
	)
}

function ActionPoint(props) {
	return (
		<div className="action-point">
			<Icon img={"action_point"} />
		</div>
	)
}

function SkillHeader(props) {
	let skill = props.skill
	let ap = skill["ActionPoints"]

	let apOrbs = []
	for (let x = 0; x < parseInt(ap); x++) {
		apOrbs.push(<ActionPoint key={x} />)
	}

	return (
		<div className="flex-horizontal tooltip-header-bg flex-centered">
			<div className="tooltip-header flex-horizontal-small">
				<Text text={skill.DisplayNameRef} className="tooltip-header-title"/>

				<div className="flex-horizontal-small flex-centered">
					{apOrbs}
				</div>
			</div>
		</div>
	)
}

function SkillDescription(props) {
	let skill = props.skill

	let baseDescription = skill.BaseDescription
	baseDescription = parse("<p key='" + -1 + "'>" + baseDescription + "</p>")

	let infusionText = []
	let prefixes = [
		"<span class='text-si-symbol'>♦</span>: ",
		"<span class='text-si-symbol'>♦♦</span>: ",
		"<span class='text-si-symbol'>♦♦♦</span>: "
	]
	for (let level in skill.SourceInfusions) {
		infusionText.push(parse("<p key='" + level + "'>" + prefixes[level-1] + skill.SourceInfusions[level] + "</p>"))
	}

	// statuses
	let statuses = []
	for (let x in skill.TieredStatuses) {
		let status = skill.TieredStatuses[x]
		if (status in miscData.statusNames) {
			let text = parse(utils.format("<p class='compact-text' key='" + status + "'>Applies up to <span class='{0}'>{1}</span></p>", miscData.mappings.statusCSS[status], miscData.statusNames[status]))

			statuses.push(text)
		}
	}
	let statusesDisplay = null
	if (statuses.length > 0) {
		statusesDisplay = <div className="flex-vertical">

			{statuses}

		</div>
	}

	let elements = [baseDescription]
	if (Object.keys(skill.SourceInfusions).length > 0) {
		elements.push(<DarkHR/>)
		elements.push(infusionText)
		elements.push(<DarkHR/>)
	}

	return (
		<div className="text-left tooltip-middle">

			{elements}
			
			<div className="flex-vertical">
				{statusesDisplay}
				<Requirements skill={skill} />
			</div>
			
		</div>
	)
}

function SkillFooter(props) {
	let skill = props.skill

	let memoryCost = null
	// es-lint-disable-next-line
	if (skill["Memory Cost"] && skill["Memory Cost"] != "0") {
		memoryCost = <div className="">
			{/* <Icon size="14px" img="memory_white"/> */}
			<Text text={utils.format("{0} Memory Slot{1}", skill["Memory Cost"], parseInt(skill["Memory Cost"]) > 1 ? "s" : "")}/>
		</div>
	}
	
	let schoolName;
	if (skill.Ability === "None" || skill.Ability == null) {
		schoolName = "Special"
	}
	else {
		schoolName = miscData.mappings.abilityNames[skill.Ability]
	}

	return (
		<div className="tooltip-bottom flex-horizontal flex-align-centered">
			<div className="tooltip-bottom-text flex-horizontal-small">
				<Text overrideColor className={miscData.colorHighlighting[schoolName]} text={schoolName}/>
				{memoryCost}
			</div>
		</div>
	)
}

function Cooldown(props) {
	return (
		<div className="cooldown">
			<Text text={props.skill.Cooldown}/>
		</div>
	)
}

function Requirements(props) {
	
	let skill = props.skill

	// memorization requirements
	let parsedReqs = []
	for (let ability in skill.ParsedMemorizationRequirements) {
		let amount = skill.ParsedMemorizationRequirements[ability]
		let abilityName = miscData.mappings.abilityNames[ability]

		let text = parse(utils.format("<p class='compact-text' key='" + ability + "'>Requires <span class='{0}'>{1} {2}</span></p>", miscData.colorHighlighting[abilityName], amount, abilityName))

		parsedReqs.push(text)
	}
	// if (skill.MemorizationRequirements) {
	// 	let reqs = skill.MemorizationRequirements.split("; ")
	// 	for (let x in reqs) {
	// 		let stat = miscData.mappings.abilityNames[reqs[x].split(" ")[0]]
	// 		let amount = reqs[x].split(" ")[1]

	// 		let text = parse(utils.format("<p class='compact-text' key='" + x + "'>Requires <span class='{0}'>{1} {2}</span></p>", miscData.colorHighlighting[stat], amount, stat))

	// 		parsedReqs.push(text)
	// 	}
	// }

	return (
		<div className="flex-vertical">
			{parsedReqs}
		</div>
	);
}