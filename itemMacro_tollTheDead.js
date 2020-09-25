// this item
let itemName = item.data.name;

// controlled Token
let tokens = canvas.tokens.controlled;
let currentActor = tokens[0];

//define damage for states
let unhurtDie = "1d8";
let hurtDie = "1d12";
let dmgType = "necrotic";

let unhurtDmg = [[unhurtDie,dmgType]];
let hurtDmg = [[hurtDie,dmgType]];

// find selected target
let targets = Array.from(game.user.targets);

if(targets.length == 0 || targets.length > 1){
	ui.notifications.warn("Please select a single target to attack.");
} else {

	let target = targets[0].actor.data;
	let targetCurrentHealth = target.data.attributes.hp.value;
	let targetMaxHealth = target.data.attributes.hp.max;

	if(targetCurrentHealth < targetMaxHealth){
		// print out chat message for hurt state
			ChatMessage.create({
				speaker: {
					alias: currentActor.data.name
				},
				content: `
					<p><b>Toll the dead: Enemy is hurt!</b><br>
					Using d12 Base Damage!</>
				`
			});
			item.update({
				'data.damage.parts': hurtDmg,
				'data.scaling.formula': hurtDie
			});

			game.dnd5e.rollItemMacro(itemName);

			// reset damage die after 500 ms
			setTimeout(function(){ 
					item.update({
						'data.damage.parts': unhurtDmg,
						'data.scaling.formula': unhurtDie
					});
				}, 500);

			// stop execution
			return;
	}

	// if not favorite enemy do standard roll
	game.dnd5e.rollItemMacro(itemName);
}
